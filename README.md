# SkillBridge — Your Network, Your Opportunity

<div align="center">

![SkillBridge Banner](https://img.shields.io/badge/SkillBridge-Editorial%20Edition-0f172a?style=for-the-badge&logo=compass&logoColor=white)
<br /><br />

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy_Ready-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**Bridging ambitious self-taught developers, fresh graduates, and non-traditional engineers with verified mentors, tech communities, and hiring partners.**

[Live Repository](https://github.com/amit-dev01/Skills) · [Features](#key-features) · [Quickstart](#getting-started) · [Vercel Deployment](#deploying-to-vercel)

</div>

---

## 💡 The Problem & The Mission

> *"Your career opportunities shouldn't depend on who you already know."*

Talented developers outside premier tier-1 colleges and major tech hubs face a massive disadvantage:
- They lack pre-existing alumni networks, personal referrals, and recruiter pipelines.
- Traditional job portals drown candidate applications in unpersonalized resume black-holes.
- Reaching out to recruiters and engineering mentors blindly often leads to zero response.

**SkillBridge dismantles this access gap.** By pairing a **Proof-of-Work Skill Passport** with a **4-Factor Smart Compatibility Engine** and a **Gemini-powered AI Outreach Studio**, SkillBridge enables any developer to discover the right people and make high-converting, respectful connections.

---

## ✨ Key Features

### 1. Minimalist Editorial Landing Page
- **Cinematic Experience:** Atmospheric background video showcasing artistic elegance.
- **Bespoke Editorial Typography:** High-contrast `Instrument Serif` display headings paired with functional `Inter` body text.
- **Fluid Micro-interactions:** Staggered `fade-rise` entrance transitions, `scale-1.03` hover physics, and high-contrast actions.
- **Seamless Navigation:** One-click transition into the full-featured dashboard.

### 2. Digital Proof-of-Work Skill Passport
- **Standardized Profile:** Showcases verified skills, education, experience tier, target roles, preferred work locations, and personal bio.
- **GitHub REST API Sync:** Instantly pulls public repositories, stargazers, and top programming languages directly into your profile.
- **Readiness Metric:** Dynamic passport completion meter helping candidates optimize their profile visibility.

### 3. 4-Factor Smart Compatibility Engine
Unlike arbitrary keyword matching, candidates receive an objective **Match Score (0–99%)** with full transparent factor breakdowns:
- **Skill Compatibility (50%):** Direct overlap of candidate core skills with recruiter or mentor requirements.
- **Role Alignment (25%):** Target job roles matched against active hiring mandates.
- **Work Mode & Location (15%):** Remote, hybrid, or on-site geographic preferences.
- **Experience Relevance (10%):** Level matching tailored for freshers, juniors, and self-taught talent.
- **Radar Visualizer:** Visual 4-axis compatibility chart powered by Recharts.

### 4. Verified Recruiter & Mentor Directories
- **Recruiters:** Talent acquisition specialists from companies like Vercel, Supabase, Postman, Stripe, and Canva who actively hire non-traditional candidates.
- **Mentors:** Staff engineers, open-source maintainers, and system architects offering portfolio reviews, mock design interviews, and tier-3 career guidance.
- **Direct GitHub Stats Modal:** Inspect mentor repositories, stars, and language stacks in one click.

### 5. AI Message Studio (Google Gemini 1.5 Flash)
- **High-Converting Outreach:** Generates concise, tailored cold messages under 130 words for LinkedIn or Email.
- **Context-Aware Personalization:** References the candidate's real projects and connects them directly to the recipient's tech stack.
- **Tone Flexibility:** Switch effortlessly between *Warm*, *Concise*, or *Enthusiastic*.
- **Heuristic Fallback:** If API credentials are not provided, an intelligent heuristic generator takes over seamlessly without errors.

### 6. Candidate CRM & Connections Tracker
- **Kanban-Style Pipeline:** Track networking progress through `Saved` → `Message drafted` → `Contacted` → `Responded`.
- **Private Notes:** Save custom interview notes, date logs, and outreach feedback.
- **1-Click CSV Export:** Export your entire professional networking pipeline anytime.

### 7. Tech Communities Directory
- Curated circles across Open Source (Outreachy, GSSoC), Student Hackathons (MLH, Devpost), and Tech Stacks (Reactiflux, Supabase, Next.js).
- Categorized by platform (Discord, Slack, Web) with one-click direct access.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with custom dark navy SaaS theme |
| **Typography** | `Instrument Serif` (Google Fonts) & `Inter` |
| **AI Integration** | [Google Gemini 1.5 Flash](https://aistudio.google.com/) via `@google/generative-ai` |
| **Database** | [Supabase PostgreSQL](https://supabase.com/) with Row Level Security (RLS) *(Optional)* |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **External APIs** | GitHub REST API v3 |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```text
skillbridge/
├── public/                     # Static SVG assets & favicons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── connections/    # Saved connections & pipeline CRM API
│   │   │   ├── generate-message/# Gemini 1.5 Flash AI message generator
│   │   │   ├── github/         # GitHub profile & language stats sync
│   │   │   ├── profile/        # User passport profile endpoints
│   │   │   └── recommendations/# Dynamic compatibility ranking engine
│   │   ├── globals.css         # Tailwind styles & fade-rise keyframes
│   │   ├── layout.js           # HTML shell & font definitions
│   │   └── page.js             # Root application shell & view switcher
│   ├── components/
│   │   ├── communities/        # Tech community discovery & filters
│   │   ├── connections/        # Pipeline tracker, CRM & notes modals
│   │   ├── dashboard/          # Metric cards, radar chart & quick actions
│   │   ├── landing/            # Minimalist Editorial landing page
│   │   ├── layout/             # Header, Sidebar, and Mobile navigation
│   │   ├── mentors/            # Mentor directory & GitHub inspect modal
│   │   ├── message-studio/     # AI Message Studio interface
│   │   ├── passport/           # Skill Passport view, editor & sync
│   │   ├── recruiters/         # Recruiter cards & match score breakdowns
│   │   ├── settings/           # Demo persona switcher & system status
│   │   └── ui/                 # Reusable atomic UI components (Button, Modal, Card)
│   ├── context/
│   │   ├── AppContext.jsx      # Global state (local-first offline persistence)
│   │   └── ToastContext.jsx    # System notifications & alerts
│   ├── data/
│   │   ├── sampleCommunities.js# Curated developer communities
│   │   ├── sampleMentors.js    # Verified mentor profiles
│   │   ├── samplePersonas.js   # Preloaded test candidate profiles
│   │   └── sampleRecruiters.js # Tech talent partners dataset
│   └── lib/
│       ├── matchingEngine.js   # 4-factor mathematical scoring algorithm
│       ├── supabaseClient.js   # Supabase client & fallback detector
│       └── utils.js            # Tailwind merge & formatting helpers
├── .env.example                # Template for environment keys
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.18+` or `v20+`
- **npm** or **pnpm**

### 2. Clone the Repository
```bash
git clone https://github.com/amit-dev01/Skills.git
cd Skills
```

### 3. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Configure Environment Variables *(Optional)*
SkillBridge is designed with an **offline-first & demo-ready architecture**. You can start developing immediately without any third-party accounts.

To unlock live AI generation, create a `.env.local` file:
```env
# Google Gemini API Key (for real-time AI Message Studio generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase PostgreSQL (if persisting across cloud devices)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: GitHub Personal Access Token (boosts rate limit from 60 to 5,000 req/hr)
GITHUB_TOKEN=your_github_personal_token
```

> [!NOTE]
> If environment variables are omitted, SkillBridge runs automatically in **Demo Mode** using browser `localStorage` and smart heuristic templates.

### 5. Launch the Local Dev Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ☁️ Deploying to Vercel

SkillBridge is built specifically for zero-friction deployment on **Vercel**:

1. Push your code to your GitHub repository.
2. In the [Vercel Dashboard](https://vercel.com/new), import `amit-dev01/Skills`.
3. Framework Preset: **Next.js** (detected automatically).
4. *(Recommended)* Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your Gemini API key from [Google AI Studio](https://aistudio.google.com/).
5. Click **Deploy**.

*(Supabase variables can be completely skipped if you prefer running in demo/local mode!)*

---

## 🗄️ Supabase PostgreSQL Setup *(Optional)*

If you wish to use Supabase instead of local browser persistence:
1. Create a project on [Supabase](https://supabase.com/).
2. Open the **SQL Editor** and paste the following schema:

```sql
-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  location TEXT,
  education TEXT,
  experience_level TEXT,
  preferred_roles TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  career_interests TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Saved Connections Table
CREATE TABLE IF NOT EXISTS public.saved_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('recruiter', 'mentor', 'community')),
  entity_name TEXT NOT NULL,
  entity_company TEXT,
  entity_role TEXT,
  entity_avatar TEXT,
  entity_data JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'Saved' CHECK (status IN ('Saved', 'Message drafted', 'Contacted', 'Responded')),
  notes TEXT DEFAULT '',
  match_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, entity_id, entity_type)
);

ALTER TABLE public.saved_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own connections" ON public.saved_connections FOR ALL USING (auth.uid() = user_id);
```

---

## 📄 License

This project is licensed under the **MIT License** — feel free to modify and build upon it.

---

<div align="center">
  <sub>Built with care for self-taught engineers, students, and equal-opportunity tech seekers everywhere.</sub>
</div>
