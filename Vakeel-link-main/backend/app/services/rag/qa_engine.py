import json
import re
from typing import Any, Dict, List, Optional

from groq import Groq

from app.core.config import settings
from .retrieval_from_qdrant import LegalRetriever

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
GROQ_API_KEY = settings.GROQ_API_KEY
GROQ_MODEL   = "llama-3.3-70b-versatile"
DISCLAIMER = "This is AI-generated legal guidance, not legal advice. Please consult a verified lawyer."

class LegalQAEngine:
    def __init__(self, retriever=None):
        self.retriever = retriever or LegalRetriever()
        self.client = Groq(api_key=GROQ_API_KEY)

    @staticmethod
    def _merge_unique(primary: Optional[List[Any]], fallback: Optional[List[Any]] = None) -> List[str]:
        ordered: List[str] = []
        for value in (primary or []) + (fallback or []):
            text = str(value).strip()
            if text and text not in ordered:
                ordered.append(text)
        return ordered

    @staticmethod
    def _clean_json_payload(raw_content: str) -> str:
        content = raw_content.strip()
        
        # Remove markdown code blocks (```json or ```)
        if content.startswith("```"):
            # Find the first opening ```
            first_backtick = content.find("```")
            if first_backtick != -1:
                # Find the closing ```
                # Skip the opening ``` and optional 'json' keyword
                after_open = content[first_backtick + 3:]
                # Remove 'json' if present
                if after_open.strip().lower().startswith('json'):
                    after_open = after_open.strip()[4:]
                # Find the closing ```
                last_backtick = after_open.rfind("```")
                if last_backtick != -1:
                    content = after_open[:last_backtick].strip()
                else:
                    # Fallback: just remove the first ```
                    content = re.sub(r"^```(?:json)?\s*", "", content, flags=re.IGNORECASE)
                    content = re.sub(r"\s*```$", "", content)
        return content.strip()

    @staticmethod
    def _build_citations(results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        citations: List[Dict[str, Any]] = []
        seen = set()

        for result in results:
            source_collection = str(result.get("source_collection") or result.get("domain") or "unknown").strip()
            law_name = str(result.get("law_name") or result.get("case_name") or result.get("source") or "").strip()
            section_number = str(result.get("section_number") or result.get("sections") or "").strip()
            act_name = str(result.get("act_name") or result.get("acts") or "").strip()
            case_name = str(result.get("case_name") or result.get("law_name") or "").strip()
            chunk_text = str(result.get("chunk_text") or "").strip()
            document_title = case_name or law_name or act_name or section_number or source_collection

            candidate_items = [
                ("section", section_number, section_number),
                ("case", case_name, case_name or law_name),
                ("act", act_name, act_name),
            ]

            for citation_type, citation_text, citation_source in candidate_items:
                normalized = citation_text.strip()
                if not normalized:
                    continue

                dedupe_key = (citation_type, normalized, source_collection)
                if dedupe_key in seen:
                    continue
                seen.add(dedupe_key)

                citations.append(
                    {
                        "type": citation_type,
                        "text": normalized,
                        "title": document_title,
                        "source_collection": source_collection,
                        "source": citation_source,
                        "score": float(result.get("score") or 0.0),
                        "excerpt": chunk_text[:240],
                        "full_text": chunk_text,
                    }
                )

        return citations

    def ask(self, query: str) -> Dict[str, Any]:
        print(f"\n[AI] Processing query: {query}...")

        retrieval = self.retriever.search_with_meta(query, top_k=5)
        results = retrieval.get("results", [])
        domain_candidates = retrieval.get("domain_candidates", [])
        confidence_score = float(retrieval.get("confidence_score", 0.0))
        retrieval_status = str(retrieval.get("retrieval_status") or "ok")
        retrieval_notice = retrieval.get("retrieval_notice")

        context_blocks: List[str] = []
        for index, result in enumerate(results[:5], start=1):
            chunk_text = str(result.get("chunk_text", "")).strip()
            section_number = str(result.get("section_number") or "").strip()
            act_name = str(result.get("act_name") or "").strip()
            case_name = str(result.get("case_name") or result.get("law_name") or "").strip()
            source_collection = str(result.get("source_collection") or result.get("domain") or "").strip()

            context_blocks.append(
                f"CHUNK {index}\n"
                f"COLLECTION: {source_collection}\n"
                f"CASE: {case_name}\n"
                f"ACT: {act_name}\n"
                f"SECTION: {section_number}\n"
                f"TEXT: {chunk_text}"
            )

        context_text = "\n\n".join(context_blocks) if context_blocks else "No relevant chunks were returned by the vector search."

        system_msg = (
            "You are a Senior Indian Legal Counsel. Your goal is to analyze the user's query using ONLY the provided context. "
            "Return a strict JSON response with these keys: 'domain', 'summary', 'cited_sections', 'cited_cases', 'cited_acts', 'confidence_score'.\n\n"
            "CRITICAL INSTRUCTIONS:\n"
            "1. CITE only sections, cases, and acts that appear EXPLICITLY in the context chunks provided.\n"
            "2. For 'cited_sections': Extract exact section numbers mentioned in the context (e.g., 'Article 21', 'Section 13').\n"
            "3. For 'cited_cases': Extract exact case names mentioned in the context (e.g., 'Bandhua Mukti Morcha vs Union Of India').\n"
            "4. For 'cited_acts': Extract exact act names mentioned in the context (e.g., 'Constitution of India').\n"
            "5. The 'summary' should be a professional legal analysis structured with: 'Facts:', 'Issues:', 'Analysis:', and 'Conclusion:'.\n"
            "6. 'confidence_score' should be between 0.0 and 1.0 based on context relevance.\n"
            "7. DO NOT wrap your response in markdown code blocks. Return ONLY valid JSON.\n"
            "8. If the context doesn't contain specific citations, use empty arrays for cited_sections, cited_cases, and cited_acts."
        )
        user_msg = f"USER QUERY: {query}\n\nRETRIEVED CONTEXT:\n{context_text}"

        completion = self.client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.1,
            max_tokens=1500,
        )

        answer = completion.choices[0].message.content or ""
        print(f"[AI] LLM Response received ({len(answer)} chars)")
        
        try:
            cleaned_json = self._clean_json_payload(answer)
            parsed_answer = json.loads(cleaned_json)
        except Exception as e:
            print(f"[AI] JSON parsing failed: {e}")
            parsed_answer = {"summary": answer, "domain": "general", "confidence_score": 0.5}

        summary_text = str(
            parsed_answer.get("summary")
            or parsed_answer.get("analysis")
            or answer
        ).strip()

        # Identify citations mentioned by the model
        model_sections = self._merge_unique(parsed_answer.get("cited_sections"))
        model_cases = self._merge_unique(parsed_answer.get("cited_cases"))
        model_acts = self._merge_unique(parsed_answer.get("cited_acts"))

        # Build citations by matching model mentions to retrieved chunks
        final_citations = []
        seen_texts = set()
        seen_chunks = set()

        # Helper to check if a chunk is relevant to model's citations
        def is_chunk_relevant(chunk, type_val, text_val):
            try:
                c_text = str(chunk.get("chunk_text") or "").lower()
                c_sec = str(chunk.get("section_number") or "").lower()
                c_act = str(chunk.get("act_name") or "").lower()
                c_case = str(chunk.get("case_name") or chunk.get("law_name") or "").lower()
                needle = str(text_val or "").lower().strip()
                
                if not needle: return False
                if type_val == "section" and (needle in c_sec or needle in c_text): return True
                if type_val == "case" and (needle in c_case or needle in c_text): return True
                if type_val == "act" and (needle in c_act or needle in c_text): return True
            except:
                pass
            return False

        for type_label, mentions in [("section", model_sections), ("case", model_cases), ("act", model_acts)]:
            for mention in mentions:
                try:
                    normalized_mention = str(mention or "").strip().lower()
                    if not normalized_mention or normalized_mention in seen_texts:
                        continue
                    
                    matched = False
                    for chunk in results:
                        if is_chunk_relevant(chunk, type_label, mention):
                            chunk_id = f"{chunk.get('source_collection')}-{chunk.get('score')}"
                            if (mention, chunk_id) in seen_chunks:
                                continue
                            seen_chunks.add((mention, chunk_id))
                            
                            final_citations.append({
                                "type": type_label,
                                "text": str(mention),
                                "title": str(chunk.get("case_name") or chunk.get("law_name") or mention),
                                "source_collection": str(chunk.get("source_collection") or "Legal Library"),
                                "source": str(chunk.get("source") or "Official Record"),
                                "score": float(chunk.get("score") or 0.0),
                                "excerpt": str(chunk.get("chunk_text") or "")[:280],
                                "full_text": str(chunk.get("chunk_text") or ""),
                            })
                            seen_texts.add(normalized_mention)
                            matched = True
                            break # Only one chunk per mention to keep it clean
                    
                    # If model mentioned it but no exact chunk match, add a fallback
                    if not matched:
                        final_citations.append({
                            "type": type_label,
                            "text": str(mention),
                            "title": str(mention),
                            "source_collection": "General Knowledge",
                            "source": "Synthesized",
                            "score": 0.5,
                            "excerpt": "This reference was identified by the AI as relevant but exact text was not retrieved from the primary corpus.",
                            "full_text": "Text not available.",
                        })
                        seen_texts.add(normalized_mention)
                except Exception as e:
                    print(f"[AI] Citation build error for {mention}: {e}")

        # Final pass deduplication
        unique_final = []
        final_seen = set()
        for c in final_citations:
            try:
                key = (str(c.get("type", "")), str(c.get("text", "")).strip().lower())
                if key not in final_seen:
                    final_seen.add(key)
                    unique_final.append(c)
            except:
                continue
        
        final_citations = unique_final
        final_citations.sort(key=lambda x: x.get("score", 0.0), reverse=True)

        return {
            "domain": str(parsed_answer.get("domain") or (domain_candidates[0] if domain_candidates else "unknown")),
            "summary": summary_text,
            "analysis": summary_text,
            "answer": summary_text,
            "cited_sections": model_sections,
            "cited_cases": model_cases,
            "cited_acts": model_acts,
            "disclaimer": DISCLAIMER,
            "confidence_score": float(parsed_answer.get("confidence_score", confidence_score)),
            "retrieved_chunks": results[:5],
            "domain_candidates": domain_candidates,
            "citations": final_citations,
            "retrieval_status": retrieval_status,
            "retrieval_notice": retrieval_notice,
        }


if __name__ == "__main__":
    engine = LegalQAEngine()
    query = "What are the rights of manual scavengers under the Indian Constitution?"
    answer = engine.ask(query)
    print("\n" + "="*50)
    print("LEGAL ANALYSIS")
    print("="*50)
    print(answer)
    print("="*50)
