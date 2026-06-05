import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import Conversation, Message
from app.schemas import ChatRequest, ChatResponse
from app.services.rag import get_rag_response

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    # Get or create conversation
    if req.conversation_id:
        result = await db.execute(
            select(Conversation).where(Conversation.id == req.conversation_id)
        )
        conv = result.scalar_one_or_none()
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conv = Conversation(user_id=req.user_id, title=req.message[:60])
        db.add(conv)
        await db.flush()

    # Persist user message
    db.add(Message(
        conversation_id=conv.id,
        role="user",
        content=req.message,
        prompt_version=req.prompt_version,
    ))

    # RAG + generation
    try:
        rag = await get_rag_response(db, req.user_id, req.message, req.prompt_version)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    # Persist assistant message with source provenance
    db.add(Message(
        conversation_id=conv.id,
        role="assistant",
        content=rag["response"],
        retrieved_sources=[c.document_name for c in rag["sources"]],
        prompt_version=req.prompt_version,
    ))
    await db.commit()

    return ChatResponse(
        response=rag["response"],
        conversation_id=conv.id,
        sources=rag["sources"],
    )


@router.get("/history/{conversation_id}", tags=["chat"])
async def get_history(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {
        "conversation_id": str(conv.id),
        "messages": [
            {
                "role": m.role,
                "content": m.content,
                "sources": m.retrieved_sources or [],
            }
            for m in conv.messages
        ],
    }
