"""AI Stadium Copilot endpoint — RAG-grounded chatbot."""
from fastapi import APIRouter, HTTPException

from backend.core.config import get_settings
from backend.core.database import save_chat_message
from backend.core.security import sanitize_text
from backend.models.schemas import ChatRequest, ChatResponse, SourceChunk
from backend.services import gemini_service, rag_service

router = APIRouter(prefix="/api/chat", tags=["Stadium Copilot"])
_settings = get_settings()


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Answer a fan's question, grounded in the local stadium knowledge base."""
    try:
        clean_message = sanitize_text(request.message)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    save_chat_message(request.session_id or "anonymous", "user", clean_message, request.language)

    retrieved = rag_service.retrieve(clean_message, top_k=_settings.RAG_TOP_K)
    relevant_chunks = [chunk for chunk in retrieved if chunk.score >= _settings.RAG_MIN_SCORE]

    prompt = gemini_service.build_copilot_prompt(
        user_message=clean_message,
        language_code=request.language,
        context_chunks=[chunk.content for chunk in relevant_chunks],
    )
    reply = await gemini_service.generate_text(prompt)

    save_chat_message(request.session_id or "anonymous", "assistant", reply, request.language)

    return ChatResponse(
        reply=reply,
        sources=[
            SourceChunk(title=chunk.title, content=chunk.content, score=round(chunk.score, 3))
            for chunk in relevant_chunks
        ],
        used_knowledge_base=bool(relevant_chunks),
        language=request.language,
    )
