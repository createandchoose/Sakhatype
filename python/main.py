from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from generator import generate_monkeytype_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/generate_text")
def generate_text(words: int = 50):
    text = generate_monkeytype_text(word_count=words)
    return {"text": text}
