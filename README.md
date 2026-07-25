# AI Video Content Studio 🚀

**AI Video Content Studio** is a commercial-grade, scalable SaaS platform designed for content creators, marketers, and video editors to automate video pre-production. Turn any raw topic, blog post, article, PDF document, or website URL into complete video content assets in seconds.

---

## 🌟 Key Features

- **Automated Video Pre-Production**: Generates structured hooks, body scripts, call-to-actions, and scene timing breakdown.
- **Timed Scene & Visual Prompts**: Visual B-roll cues, camera angles (zoom, tilt, macro), and duration estimates.
- **ElevenLabs Speech Synthesis**: Direct backend integration with ElevenLabs text-to-speech engine with live audio player preview.
- **Auto SRT Subtitle Export**: Downloadable `.srt` subtitle files with aligned timestamps ready for Premiere Pro, CapCut, or DaVinci.
- **Midjourney & DALL-E Thumbnail Synthesizer**: High-click-through visual prompt generation.
- **YouTube SEO Package**: 5 viral title variations, timestamped SEO descriptions, indexed keywords, and trending hashtags.
- **Freemium SaaS Model**: Built-in daily quota tracking (3 generations/day on Free tier) and Pro plan upgrades.
- **Supabase Authentication & Row Level Security (RLS)**: Bank-grade security policies strictly isolating user projects.

---

## 🏗️ Architecture & Technology Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │ React 18 + TypeScript + Vite + Tailwind CSS + Lucide UI │
   └────────────────────────────┬────────────────────────────┘
                                │
                  HTTP / REST API Proxy Layer
                                │
   ┌────────────────────────────▼────────────────────────────┐
   │    Express.js Node.js Server (Backend Security Proxy)   │
   └─────────────┬─────────────────────────────┬─────────────┘
                 │                             │
    ┌────────────▼─────────────┐  ┌────────────▼─────────────┐
    │ ElevenLabs TTS Speech API│  │ Supabase PostgreSQL DB   │
    │ (Voice synthesis Engine) │  │  (RLS Policies & Auth)   │
    └──────────────────────────┘  └──────────────────────────┘
```

---

## 📂 Project Folder Structure

```
ai-video-studio/
├── supabase/
│   └── schema.sql                # Complete PostgreSQL DB schema, RLS policies, triggers & seeds
├── server/                       # Node.js + Express backend
│   ├── src/
│   │   ├── config.ts             # Server environment variables
│   │   ├── index.ts              # Express API entry point
│   │   ├── controllers/          # AI, Voice & Project Controllers
│   │   └── services/             # ElevenLabs & AI Pre-Production Engine
│   ├── package.json
│   └── tsconfig.json
├── client/                       # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/           # Navbar, Footer, AuthModal, Landing, Dashboard Tabs
│   │   │   └── Dashboard/        # Overview, Create, Studio Workspace, My Projects, Settings
│   │   ├── context/              # AuthContext & ThemeContext
│   │   ├── lib/                  # Supabase & API Client
│   │   ├── types/                # TypeScript Interfaces
│   │   ├── App.tsx
│   │   ├── index.css             # Glassmorphism & Tailwind design system
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .env.example                  # Environment template
├── package.json                  # Root monorepo script runner
├── README.md                     # Documentation
└── DEPLOYMENT.md                 # Production deployment guide
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies:
```bash
# Install root, client, and server dependencies
npm run install:all
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development

# ELEVENLABS API KEY (Backend Server Only)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# SUPABASE CONFIGURATION
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### 4. Database Setup
1. Log into your [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** and execute the contents of `supabase/schema.sql`.
3. This creates all tables (`profiles`, `subscriptions`, `usage`, `voices`, `projects`, `project_history`) with full RLS security and seed voices.

### 5. Running Locally
Run client and server concurrently:
```bash
# Terminal 1: Run Express Backend API
npm run dev:server

# Terminal 2: Run React Frontend App
npm run dev:client
```

Open `http://localhost:3000` in your browser.

---

## 🔒 Security Policy
All calls to ElevenLabs API are proxied securely through the Express backend (`server/src/services/elevenLabsService.ts`). API keys are **never** exposed to client-side JavaScript code.
