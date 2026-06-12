"""
Document ingestion pipeline.

Run once to populate the knowledge base:
    cd backend && make ingest

Design decisions:
- RecursiveCharacterTextSplitter: splits on paragraph → sentence → word
  boundaries in order, preserving semantic coherence better than fixed-
  character chunking.
- Chunk size 800 / overlap 100: fits meaningfully in retrieval context
  while staying useful as a standalone passage.
- Upsert by document name: re-running ingest is idempotent.
- Batch embedding: reduces OpenAI API calls from N to ceil(N/100).
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.database import init_db
from app.models import DocumentChunk
from app.services.embeddings import embed_batch
from app.config import settings

# Use sync session for the one-off ingestion script
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DOCUMENTS_DIR = Path(__file__).parent / "documents"


def _get_sync_session():
    """Ingestion runs as a one-off script — sync session is fine here."""
    sync_url = settings.database_url.replace("+asyncpg", "+psycopg2")
    engine = create_engine(sync_url)
    Session = sessionmaker(bind=engine)
    return Session()


def load_documents() -> list[dict]:
    docs = []
    for path in sorted(DOCUMENTS_DIR.glob("*.md")):
        docs.append({"name": path.stem, "content": path.read_text(encoding="utf-8")})
    print(f"Loaded {len(docs)} documents: {[d['name'] for d in docs]}")
    return docs


def chunk_document(name: str, content: str) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return [
        {"name": name, "index": i, "content": c}
        for i, c in enumerate(splitter.split_text(content))
    ]


def run():
    import asyncio
    asyncio.run(init_db())

    db = _get_sync_session()
    try:
        documents = load_documents()
        all_chunks: list[dict] = []
        for doc in documents:
            chunks = chunk_document(doc["name"], doc["content"])
            all_chunks.extend(chunks)
            print(f"  {doc['name']}: {len(chunks)} chunks")

        print(f"\nGenerating embeddings for {len(all_chunks)} chunks...")
        BATCH = 100
        embeddings: list[list[float]] = []
        for i in range(0, len(all_chunks), BATCH):
            batch = all_chunks[i: i + BATCH]
            embeddings.extend(embed_batch([c["content"] for c in batch]))
            print(f"  Embedded {min(i + BATCH, len(all_chunks))}/{len(all_chunks)}")

        # Upsert: clear existing then insert fresh
        doc_names = {c["name"] for c in all_chunks}
        db.query(DocumentChunk).filter(
            DocumentChunk.document_name.in_(doc_names)
        ).delete(synchronize_session=False)

        for chunk, embedding in zip(all_chunks, embeddings):
            db.add(DocumentChunk(
                document_name=chunk["name"],
                chunk_index=chunk["index"],
                content=chunk["content"],
                embedding=embedding,
                metadata_={"source": chunk["name"]},
            ))

        db.commit()
        print(f"\nDone. {len(all_chunks)} chunks stored in document_chunks.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
