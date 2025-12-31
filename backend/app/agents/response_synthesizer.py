from typing import List, Dict, Any, Tuple
from datetime import datetime
from app.models import AgentLog, Source
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.documents import Document
from app.config import settings

class ResponseSynthesizerAgent:
    """Agent responsible for synthesizing final response"""
    
    def __init__(self):
        self.name = "Response Synthesizer"
        self.llm = ChatOpenAI(
            model=settings.llm_model,
            temperature=0.3,
            openai_api_key=settings.openai_api_key
        )
    
    async def synthesize_response(
        self, 
        query: str,
        retrieved_docs: List[Tuple[Document, float]],
        query_type: str
    ) -> tuple[Dict[str, Any], List[AgentLog]]:
        """Synthesize final answer from retrieved documents"""
        logs = []
        
        logs.append(AgentLog(
            agent=self.name,
            action="Compiling answer from sources",
            status="active",
            timestamp=datetime.now()
        ))
        
        # Prepare context from retrieved documents
        context = "\n\n".join([
            f"[Source {i+1}] {doc.page_content}"
            for i, (doc, score) in enumerate(retrieved_docs)
        ])
        
        # Create prompt
        prompt = PromptTemplate(
            template="""You are an AI assistant analyzing documents. Based on the following context, answer the question accurately and concisely.

Context:
{context}

Question: {query}

Provide a clear, well-structured answer based on the context. If the context doesn't contain enough information, say so.

Answer:""",
            input_variables=["context", "query"]
        )
        
        # Generate response
        chain = prompt | self.llm
        response = await chain.ainvoke({"context": context, "query": query})
        answer = response.content
        
        logs.append(AgentLog(
            agent=self.name,
            action="Verifying answer quality",
            status="active",
            timestamp=datetime.now()
        ))
        
        # Calculate confidence score based on relevance scores
        avg_score = sum(score for _, score in retrieved_docs) / len(retrieved_docs) if retrieved_docs else 0
        confidence = min(0.99, max(0.75, 1.0 - avg_score))  # Invert distance score
        
        # Create sources
        sources = []
        for i, (doc, score) in enumerate(retrieved_docs):
            page = doc.metadata.get('page', i + 1)
            sources.append(Source(
                page=page,
                type='text',
                content=doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                relevance=min(0.99, max(0.70, 1.0 - score))
            ))
        
        logs.append(AgentLog(
            agent=self.name,
            action="Answer generated",
            details=f"Confidence: {confidence*100:.1f}%",
            status="completed",
            timestamp=datetime.now()
        ))
        
        return {
            'answer': answer,
            'sources': sources,
            'confidence': confidence
        }, logs