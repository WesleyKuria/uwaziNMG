from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import requests
from bs4 import BeautifulSoup
import spacy
from sentence_transformers import SentenceTransformer, util
import nltk
from nltk.corpus import wordnet as wn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp = spacy.load("en_core_web_sm")
sentence_model = SentenceTransformer('all-MiniLM-L6-v2')

# Mock news sources - replace with actual API calls/scrapers
NEWS_SOURCES = {
    "nation": "https://www.nation.co.ke/search?q={query}",
    "bbc": "https://www.bbc.com/search?q={query}",
    "aljazeera": "https://www.aljazeera.com/search/{query}"
}

def extract_keywords(text: str) -> List[str]:
    doc = nlp(text)
    return [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]

def fetch_articles(query: str) -> List[Dict]:
    # In a real implementation, this would fetch from actual APIs
    # For hackathon demo, we'll use mock data
    mock_articles = [
        {
            "source": "Nation",
            "title": "Government announces new climate initiative",
            "content": "The Kenyan government has pledged to reduce carbon emissions by 30% by 2030.",
            "url": "#"
        },
        {
            "source": "BBC",
            "title": "Kenya sets ambitious climate goals",
            "content": "In a bold move, Kenya commits to cutting emissions significantly in the next decade.",
            "url": "#"
        },
        {
            "source": "Al Jazeera",
            "title": "Critics question Kenya's climate plan",
            "content": "While Kenya announces emission cuts, environmentalists doubt the targets are achievable.",
            "url": "#"
        }
    ]
    return mock_articles

def compare_articles(articles: List[Dict]) -> Dict:
    # Compare semantic differences between articles
    comparisons = []
    base_article = articles[0]
    base_embedding = sentence_model.encode(base_article["content"])
    
    for article in articles[1:]:
        curr_embedding = sentence_model.encode(article["content"])
        similarity = util.cos_sim(base_embedding, curr_embedding).item()
        
        # Simple comparison for demo - in real app use more sophisticated NLP
        comparisons.append({
            "source": article["source"],
            "similarity": similarity,
            "differences": find_semantic_differences(base_article["content"], article["content"])
        })
    
    return {
        "base_article": base_article,
        "comparisons": comparisons
    }

def find_semantic_differences(text1: str, text2: str) -> List[str]:
    # Simple implementation for demo
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    return list(words2 - words1)

@app.get("/compare")
async def compare_news(query: str = Query(...)):
    articles = fetch_articles(query)
    analysis = compare_articles(articles)
    return analysis

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)