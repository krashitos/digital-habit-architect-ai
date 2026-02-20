import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Import the API app's routes
from api.index import app as api_app, generate_plan, health_check, HabitRequest

app = FastAPI(title="Digital Habit Architect")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount API routes
app.post("/api/generate")(generate_plan)
app.get("/api/health")(health_check)


@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(BASE_DIR, "public", "index.html"))


@app.get("/style.css")
async def serve_css():
    return FileResponse(os.path.join(BASE_DIR, "public", "style.css"))


@app.get("/script.js")
async def serve_js():
    return FileResponse(os.path.join(BASE_DIR, "public", "script.js"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
