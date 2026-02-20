import os
import time
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Digital Habit Architect API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

POLLINATIONS_URL = "https://text.pollinations.ai/"


class HabitRequest(BaseModel):
    bad_habit: str
    goal: str


class HabitStep(BaseModel):
    step_number: int
    title: str
    description: str
    anchor: str
    tiny_behavior: str
    celebration: str


class HabitPlanResponse(BaseModel):
    bad_habit: str
    goal: str
    plan: List[HabitStep]
    motivation: str
    duration: float


def generate_habit_plan(bad_habit: str, goal: str) -> dict:
    """Use Pollinations AI to generate a 5-step Tiny Habits plan."""

    prompt = f"""You are a behavioral psychology expert specializing in BJ Fogg's Tiny Habits methodology.

A user wants to break this bad habit: "{bad_habit}"
Their goal is: "{goal}"

Generate a 5-step "Tiny Habits" plan to help them. Each step must follow the Tiny Habits formula:
"After I [ANCHOR], I will [TINY BEHAVIOR]."

Return your response in EXACTLY this JSON format, with no additional text before or after:
{{
  "plan": [
    {{
      "step_number": 1,
      "title": "Short catchy title for this step",
      "description": "2-3 sentence explanation of why this step works psychologically",
      "anchor": "The existing habit/routine that triggers the new behavior",
      "tiny_behavior": "The small new behavior (must take less than 30 seconds)",
      "celebration": "A small celebration to reinforce the behavior (e.g., smile, fist pump, say 'I did it!')"
    }},
    {{
      "step_number": 2,
      "title": "...",
      "description": "...",
      "anchor": "...",
      "tiny_behavior": "...",
      "celebration": "..."
    }},
    {{
      "step_number": 3,
      "title": "...",
      "description": "...",
      "anchor": "...",
      "tiny_behavior": "...",
      "celebration": "..."
    }},
    {{
      "step_number": 4,
      "title": "...",
      "description": "...",
      "anchor": "...",
      "tiny_behavior": "...",
      "celebration": "..."
    }},
    {{
      "step_number": 5,
      "title": "...",
      "description": "...",
      "anchor": "...",
      "tiny_behavior": "...",
      "celebration": "..."
    }}
  ],
  "motivation": "An inspiring 2-3 sentence motivational message about their journey to breaking '{bad_habit}' and achieving '{goal}'"
}}

IMPORTANT: Return ONLY the JSON object. No markdown code fences, no extra text."""

    try:
        start_time = time.time()

        response = httpx.get(
            POLLINATIONS_URL,
            params={
                "model": "openai",
                "seed": int(time.time()),
                "prompt": prompt,
            },
            timeout=60.0,
        )

        if response.status_code != 200:
            raise ValueError(f"API returned status {response.status_code}")

        raw_text = response.text.strip()
        duration = time.time() - start_time

        # Clean up potential markdown fences
        if raw_text.startswith("```"):
            lines = raw_text.split("\n")
            # Remove first and last lines (```json and ```)
            lines = [l for l in lines if not l.strip().startswith("```")]
            raw_text = "\n".join(lines)

        import json

        parsed = json.loads(raw_text)

        return {
            "plan": parsed["plan"],
            "motivation": parsed["motivation"],
            "duration": round(duration, 2),
        }

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}\nRaw text: {raw_text[:500]}")
        raise HTTPException(
            status_code=500,
            detail="AI returned invalid format. Please try again.",
        )
    except Exception as e:
        print(f"Error in AI generation: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"AI Generation Error: {str(e)}"
        )


@app.post("/api/generate", response_model=HabitPlanResponse)
async def generate_plan(request: HabitRequest):
    if not request.bad_habit.strip():
        raise HTTPException(status_code=400, detail="Bad habit cannot be empty")
    if not request.goal.strip():
        raise HTTPException(status_code=400, detail="Goal cannot be empty")

    result = generate_habit_plan(request.bad_habit, request.goal)

    return HabitPlanResponse(
        bad_habit=request.bad_habit,
        goal=request.goal,
        plan=result["plan"],
        motivation=result["motivation"],
        duration=result["duration"],
    )


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Digital Habit Architect"}
