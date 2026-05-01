import logging
import re
from typing import Dict, List, Tuple

import numpy as np
from numpy.linalg import norm
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

from app.core.config import settings

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
QDRANT_URL     = settings.QDRANT_URL
QDRANT_API_KEY = settings.QDRANT_API_KEY
MODEL_NAME     = settings.EMBEDDING_MODEL_NAME

# ─────────────────────────────────────────────
# DOMAIN CLASSIFIER (KEYWORD-BASED)
# ─────────────────────────────────────────────
DOMAIN_KEYWORDS = {
    "legal_constitutional": {
        "primary": ["article 17", "article 21", "fundamental rights", "manual scavenger", "untouchability", "writ petition", "puttaswamy"],
        "secondary": ["dignity", "equality", "constitution"]
    },
    "legal_criminal": {
        "primary": ["bail", "fir", "ipc", "crpc", "murder", "theft", "arrest", "custody",
                    "cheque bounce", "section 138", "negotiable instruments", "dishonour",
                    "cybercrime", "it act", "section 66", "498a", "cruelty", "dowry"],
        "secondary": ["offence", "accused", "criminal"]
    },
    "legal_labour": {
        "primary": ["employment", "wages", "workmen", "labour court", "retrenchment", 
                    "industrial disputes", "posh act", "sexual harassment", "maternity benefit"],
        "secondary": ["worker", "employer", "compensation"]
    },
    "legal_consumer": {
        "primary": ["consumer complaint", "deficiency of service", "ncdrc", 
                    "district forum", "consumer court", "consumer protection",
                    "rera", "possession delay", "medical negligence", "flight cancellation", "online refund"],
        "secondary": ["insurance", "refund", "manufacturer", "service provider"]
    },
    "legal_motor_accident": {
        "primary": ["motor accident", "mact", "hit and run", "vehicle collision",
                    "motor vehicle", "accident claim", "motor insurance", "compensation multiplier", "loss of income"],
        "secondary": ["tribunal", "compensation", "rash driving"]
    },
    "legal_family": {
        "primary": ["divorce", "maintenance", "custody", "hindu marriage", "section 13"],
        "secondary": ["cruelty", "alimony", "spouse"]
    }
}

DOMAIN_DESCRIPTIONS = {
    "legal_constitutional": "fundamental rights constitution article writ",
    "legal_criminal": "crime bail arrest FIR punishment offence",
    "legal_consumer": "consumer complaint deficiency service product",
    "legal_family": "marriage divorce custody maintenance family",
    "legal_labour": "employment wages worker termination labour",
    "legal_motor_accident": "accident vehicle compensation motor MACT"
}

DOMAIN_PRIORITY = [
    "legal_constitutional", 
    "legal_criminal",
    "legal_consumer", 
    "legal_family",
    "legal_labour",
    "legal_motor_accident"
]


logger = logging.getLogger(__name__)


def cosine_similarity(a, b):
    denominator = norm(a) * norm(b)
    if denominator == 0:
        return 0.0
    return float(np.dot(a, b) / denominator)


def _as_text(value) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return ", ".join(str(item).strip() for item in value if str(item).strip())
    return str(value).strip()

class LegalRetriever:
    def __init__(self):
        self.client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        self.model = SentenceTransformer(MODEL_NAME)

    def _query_collection(self, collection_name: str, query_vec: np.ndarray, top_k: int):
        """Run a nearest-neighbor lookup against Qdrant with API compatibility fallback."""
        if hasattr(self.client, "query_points"):
            response = self.client.query_points(
                collection_name=collection_name,
                query=query_vec.tolist(),
                limit=top_k,
                with_payload=True,
            )
            return getattr(response, "points", []) or []

        if hasattr(self.client, "search"):
            return self.client.search(
                collection_name=collection_name,
                query_vector=query_vec.tolist(),
                limit=top_k,
                with_payload=True,
            )

        raise AttributeError("QdrantClient does not support query_points or search")

    def _embed_query(self, query: str) -> np.ndarray:
        embedding = self.model.encode(query, normalize_embeddings=True)
        return np.asarray(embedding, dtype=np.float32)

    def classify_domain(self, query: str) -> Tuple[List[str], float]:
        query_lower = query.lower()
        domain_scores: Dict[str, float] = {}
        
        for domain, keywords in DOMAIN_KEYWORDS.items():
            score = 0.0
            score += sum(3.0 for kw in keywords["primary"] if kw in query_lower)
            score += sum(1.0 for kw in keywords["secondary"] if kw in query_lower)
            if score > 0:
                domain_scores[domain] = score
        
        if not domain_scores:
            query_embedding = self._embed_query(query)
            domain_scores = {
                domain: cosine_similarity(query_embedding, self._embed_query(description))
                for domain, description in DOMAIN_DESCRIPTIONS.items()
            }

        sorted_domains = sorted(domain_scores.items(), key=lambda item: item[1], reverse=True)
        best_domain, best_score = sorted_domains[0]
        confidence_score = max(0.0, min(1.0, float(best_score / 9.0)))

        if confidence_score < 0.6 and len(sorted_domains) > 1:
            return [sorted_domains[0][0], sorted_domains[1][0]], confidence_score

        matched_domains = [domain for domain, _ in sorted_domains]
        matched_domains.sort(key=lambda domain: DOMAIN_PRIORITY.index(domain) if domain in DOMAIN_PRIORITY else 99)
        return matched_domains[:1], confidence_score

    def search_with_meta(self, query: str, top_k: int = 5):
        print(f"\n[QUERY] {query}")

        try:
            target_collections, confidence_score = self.classify_domain(query)
            print(f"[DOMAINS] {target_collections}")

            query_vec = self._embed_query(query)
            print(f"[QDRANT] vector_shape={tuple(query_vec.shape)}")

            citations = re.findall(r'article \d+|section \d+|crpc \d+|ipc \d+', query.lower())
            if citations:
                print(f"[CITATIONS DETECTED] {citations}")

            all_results = []
            collection_errors = []
            for coll in target_collections:
                try:
                    search_result = self._query_collection(coll, query_vec, top_k)
                    print(f"[QDRANT] collection={coll} results={len(search_result)}")

                    for res in search_result:
                        payload = res.payload or {}
                        score = float(res.score or 0.0)

                        chunk_text = _as_text(payload.get("chunk_text") or payload.get("text") or payload.get("content") or "").lower()
                        if citations:
                            citation_boost = sum(0.15 for c in citations if c in chunk_text)
                            score += citation_boost

                        if chunk_text:
                            section_number = _as_text(payload.get("section_number") or payload.get("sections", ""))
                            act_name = _as_text(payload.get("act_name") or payload.get("acts", ""))
                            case_name = _as_text(payload.get("case_name") or payload.get("law_name") or "")
                            law_name = _as_text(payload.get("law_name") or payload.get("case_name") or payload.get("source") or "")
                            all_results.append({
                                "chunk_text": _as_text(payload.get("chunk_text") or payload.get("text") or payload.get("content") or ""),
                                "score": score,
                                "domain": coll,
                                "source_collection": coll,
                                "subdomain": payload.get("subdomain", ""),
                                "law_name": law_name,
                                "legal_issue": payload.get("legal_issue", ""),
                                "section_number": section_number,
                                "act_name": act_name,
                                "case_name": case_name,
                                "sections": _as_text(payload.get("sections", "")),
                                "acts": _as_text(payload.get("acts", "")),
                                "source": _as_text(payload.get("source") or payload.get("law_name") or payload.get("case_name") or ""),
                            })
                except Exception as e:
                    error_message = f"Qdrant search failed for {coll}: {e}"
                    logger.warning(error_message)
                    collection_errors.append(error_message)

            if not all_results and collection_errors:
                return {
                    "domain_candidates": target_collections,
                    "confidence_score": confidence_score,
                    "query_vector": query_vec.tolist(),
                    "results": [],
                    "retrieval_status": "degraded",
                    "retrieval_notice": "Qdrant retrieval is currently unavailable, so the assistant is responding without vector citations.",
                    "collection_errors": collection_errors,
                }

        except Exception as exc:
            logger.warning("Falling back from retrieval failure: %s", exc)
            return {
                "domain_candidates": ["unknown"],
                "confidence_score": 0.0,
                "query_vector": [],
                "results": [],
                "retrieval_status": "degraded",
                "retrieval_notice": "Retrieval failed before vector search completed, so the assistant is answering from the language model only.",
                "collection_errors": [str(exc)],
            }

        seen = set()
        deduped_results = []
        for item in sorted(all_results, key=lambda x: x["score"], reverse=True):
            dedupe_key = (
                _as_text(item.get("source_collection", "")),
                _as_text(item.get("case_name", "")),
                _as_text(item.get("section_number", "")),
                _as_text(item.get("chunk_text", ""))[:200],
            )
            if dedupe_key in seen:
                continue
            seen.add(dedupe_key)
            deduped_results.append(item)

        return {
            "domain_candidates": target_collections,
            "confidence_score": confidence_score,
            "query_vector": query_vec.tolist(),
            "results": deduped_results[:top_k],
            "retrieval_status": "ok",
            "retrieval_notice": None,
        }

    def search(self, query: str, top_k: int = 5, score_threshold: float = 0.35):
        _ = score_threshold
        return self.search_with_meta(query, top_k=top_k)["results"]

    def apply_mmr(self, results: List[Dict], top_k: int, lambda_param: float = 0.5):
        """Simple MMR to prevent returning the same case multiple times."""
        if not results: return []
        
        selected = []
        seen_cases = set()
        
        for res in results:
            case = res["law_name"]
            if case not in seen_cases:
                selected.append(res)
                seen_cases.add(case)
            if len(selected) >= top_k:
                break
                
        return selected

# ─────────────────────────────────────────────
# TEST
# ─────────────────────────────────────────────
if __name__ == "__main__":
    retriever = LegalRetriever()
    
    test_queries = [
        "rights of manual scavengers",
        "how to file a FIR for assault?",
        "compensation for motor accident",
        "divorce procedure in India"
    ]
    
    for q in test_queries:
        results = retriever.search(q)
        print(f"Results for: {q}")
        for i, res in enumerate(results):
            print(f"  {i+1}. [Score: {res['score']:.4f}] Case: {res['law_name']}")
            print(f"     Domain: {res['domain']} | Subdomain: {res['subdomain']}")
            print(f"     Legal Issue: {res['legal_issue']}")
            print(f"     Acts: {res['acts']} | Sections: {res['sections']}")
            # Truncate text for display
            text_preview = res['chunk_text'][:200].replace('\n', ' ') + "..."
            print(f"     Text: {text_preview}\n")