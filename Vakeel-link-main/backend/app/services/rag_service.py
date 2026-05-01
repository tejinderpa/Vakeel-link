from typing import List, Dict, Any
from app.services.rag.retrieval_from_qdrant import LegalRetriever
from app.services.rag.qa_engine import LegalQAEngine

class RagService:
    """
    A shared core service that wraps the retrieval engine and QA engine.
    This acts as a singleton or centralized service to ensure we don't 
    duplicate pipeline logic or unnecessarily re-initialize models across endpoints.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RagService, cls).__new__(cls)
            cls._instance.retriever = LegalRetriever()
            cls._instance.qa_engine = LegalQAEngine(retriever=cls._instance.retriever)
        return cls._instance

    def retrieve_context(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Endpoint 1 use-case: Quick search without generation.
        Returns relevant chunks and metadata (hybrid search + MMR).
        """
        return self.retriever.search(query, top_k=top_k, score_threshold=0.45)

    def generate_answer(self, query: str) -> Dict[str, Any]:
        """
        Endpoint 2 use-case: Full generative QA.
        Generates a comprehensive answer using the RAG pipeline.
        """
        return self.qa_engine.ask(query)
        
    async def run_query(self, query: str) -> Dict[str, Any]:
        """
        Clean async wrapper for the RAG pipeline.
        Returns: domain, answer, citations.
        """
        import asyncio
        return await asyncio.to_thread(self.qa_engine.ask, query)

rag_service = RagService()
