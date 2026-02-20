# Digital Habit Architect — Planning

## Concept
AI-powered web app that generates personalized 5-step "Tiny Habits" plans to help users break bad habits using BJ Fogg's behavioral science methodology.

## Architecture
- **Backend**: FastAPI with Pollinations AI (free, no API key)
- **Frontend**: Vanilla HTML/CSS/JS with Deep Space Violet glassmorphism theme
- **Deployment**: Vercel serverless Python functions

## Design Theme: Deep Space Violet
- Background: Dark space (#0a0a1a)
- Primary accent: Violet (#7C3AED)
- Secondary accent: Cyan (#06B6D4)
- Glassmorphism cards with blur effects
- Animated floating orbs and particles
- Timeline-based step display

## API Design
- `POST /api/generate` — Accepts bad_habit and goal, returns 5-step plan
- `GET /api/health` — Health check endpoint
