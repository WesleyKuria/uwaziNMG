from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ArticleInput(BaseModel):
    article_text: str

@app.post("/compare")
async def compare_article(input: ArticleInput):
    # Dummy examples for now
    comparison_sources = [
        "Kenya faces climate change crisis, says UNEP",
        "Protesters in Nairobi demand global climate justice",
        "Government denies link between floods and climate change",
    ]

    query_embedding = model.encode(input.article_text, convert_to_tensor=True)
    scores = []

    for article in comparison_sources:
        score = util.cos_sim(query_embedding, model.encode(article, convert_to_tensor=True)).item()
        scores.append((article, score))

    top = sorted(scores, key=lambda x: x[1], reverse=True)[:3]
    return {"similar_articles": [{"text": t, "score": s} for t, s in top]}
