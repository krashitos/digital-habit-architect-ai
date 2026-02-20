# 🧠 Digital Habit Architect

**AI-Powered Tiny Habits Plan Generator** — Break bad habits and build positive routines using BJ Fogg's scientifically-backed Tiny Habits methodology.

## 🌐 Live Demo

> [Add your Vercel deployment URL here]

## ✨ Features

- **AI-Powered Plans**: Generates personalized 5-step Tiny Habits plans using Pollinations AI (free, no API key needed)
- **Tiny Habits Methodology**: Each step follows BJ Fogg's proven formula: "After I [ANCHOR], I will [TINY BEHAVIOR]"
- **Beautiful UI**: Deep space violet glassmorphism design with animated particles and timeline layout
- **Copy to Clipboard**: Export your entire plan as formatted text
- **Responsive Design**: Works perfectly on desktop and mobile
- **Fast & Free**: No API keys required, uses free AI service

## 🛠️ Tech Stack

- **Backend**: Python / FastAPI
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **AI**: Pollinations AI (free, no sign-up)
- **Deployment**: Vercel (serverless Python functions)

## 🚀 How to Run Locally

### Prerequisites
- Python 3.9+

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd digital-habit-architect
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   python main.py
   ```

4. **Open in browser:**
   ```
   http://localhost:8002
   ```

## 📁 Project Structure

```
digital-habit-architect/
├── api/
│   └── index.py          # FastAPI serverless function (Vercel)
├── public/
│   ├── index.html         # Frontend HTML
│   ├── style.css          # Premium glassmorphism design
│   └── script.js          # Frontend logic
├── planning/              # Project planning docs
├── main.py                # Local development server
├── requirements.txt       # Python dependencies
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🎯 How It Works

1. Enter the **bad habit** you want to break (e.g., "Phone scrolling before bed")
2. Enter your **goal** (e.g., "Better sleep quality")
3. Click **"Architect My Plan"**
4. Get a **5-step Tiny Habits plan** with:
   - Actionable step titles
   - Psychology-backed explanations
   - Tiny Habit recipes (anchor → tiny behavior)
   - Celebration suggestions to reinforce the behavior

## 📦 Deployment on Vercel

1. Push this project to a GitHub repository
2. Import the repository in Vercel
3. Deploy — no environment variables needed!
