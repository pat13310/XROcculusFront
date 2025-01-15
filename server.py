from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
async def read_root():
    return {
        "message": "Bienvenue sur l'API XrOcculus FastAPI",
        "version": "1.0.0",
        "date_de_creation": "2025-01-01",
        "auteur": "Xen"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

class AssistantConfig(BaseModel):
    model: str = "gpt-3.5-turbo"
    maxTokens: int = 4096

@app.get("/assistant/config")
async def get_assistant_config():
    return AssistantConfig()

class AssistantQuery(BaseModel):
    query: str

@app.post("/assistant")
async def process_assistant_query(query: AssistantQuery):
    return {"message": f"Réponse à votre requête : {query.query}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
