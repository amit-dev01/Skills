# SkillBridge — Your Network, Your Opportunity

> **Our Mission:** *Your opportunities shouldn't depend on who you already know.*

SkillBridge is a modern, responsive full-stack platform built to dismantle unequal access to professional tech opportunities. Many talented students, fresh graduates, self-taught developers, and people from tier-2/3 cities struggle to land roles because they lack industry networks, family referrals, and access to tech hubs.

SkillBridge levels the playing field by matching users with **relevant recruiters, verified mentors, and supportive tech communities** based on their demonstrated skills, interests, and aspirations.

---

## Key Features

1. **User Dashboard**
   - Personalized welcome banner & dynamic readiness score.
   - 4-Factor Smart Compatibility Index (Recharts Radar chart).
   - 4 Compact metric cards: Skill Passport score, Matched Recruiters, Available Mentors, Tracked Connections.
   - Quick match carousels with direct outreach actions.
   - Real-time activity log.

2. **Skill Passport (Digital Proof-of-Work)**
   - Standardized profile: Technical skills, education, experience tier, target roles, location/remote preferences, portfolio, and bio.
   - Interactive live profile editor with instant validation.
   - One-click GitHub REST API sync: fetches public repositories, stars, and languages.
   - Shareable public passport link.

3. **Recruiter Finder**
   - Curated directory of tech talent partners actively sourcing early-career, non-traditional, and remote talent (Vercel, Postman, Stripe, Supabase, Canva, etc.).
   - 4-Factor Smart Match score (0–99%) with transparent explanation popover.
   - Filtering by domain (Frontend, Backend, Early Career), remote options, and sorting.

4. **Mentor Finder**
   - Experienced engineers, staff architects, and open-source contributors ready to guide off-campus talent.
   - Mentorship focus topics: System design, portfolio reviews, tier-3 to staff engineer career strategy, first PR guidance.
   - Live GitHub profile inspection modal.

5. **Community Discovery**
   - High-impact circles: Open Source programs (Outreachy, GSSoC), Student Hackathons (MLH, Devpost), Special Interest Groups (Reactiflux, Next.js, Supabase), and Self-Taught Developer Collectives.
   - Categorized by platform (Discord, Slack, Web) with one-click join links.

6. **4-Factor Smart Matching Engine**
   - Mathematically weighted compatibility algorithm:
     - **Skill Compatibility:** 50%
     - **Career-Role Relevance:** 25%
     - **Location / Remote Compatibility:** 15%
     - **Experience Tier Relevance:** 10%
   - Transparent score breakdown modal with explicit prototype estimate disclaimers.
   - Configurable factor weight sliders in the Settings panel.

7. **AI Message Studio (Powered by Google Gemini)**
   - Server-side Next.js Route Handler (`/api/generate-message`).
   - Generates natural, concise, high-converting outreach for Recruiter Intros, Mentor Requests, Internship Inquiries, and Networking.
   - Configurable tone (Warm, Concise, Enthusiastic).
   - One-click "Copy to Clipboard" and "Save to Connection Notes".
   - High-quality heuristic template fallback if API keys are not supplied.

8. **My Connections Tracker (Candidate CRM)**
   - Pipeline stages: `Saved` → `Message drafted` → `Contacted` → `Responded`.
   - Private outreach notes modal.
   - Filter by entity type and pipeline stage.
   - 1-click Export to CSV.

9. **Settings & Architecture**
   - Live Supabase connection status indicator with instant schema inspection.
   - Switchable Demo Personas (Priya Sharma, Alex Rivera, Marcus Chen).
   - Reset local demo data button.

---

## Technology Stack

- **Framework:** Next.js (App Router, JavaScript)
- **Styling:** Tailwind CSS (Dark navy SaaS aesthetic, electric blue and violet accents)
- **UI Components:** Custom components inspired by shadcn/ui
- **Icons:** Lucide React
- **Analytics & Charts:** Recharts
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **AI Engine:** Google Gemini API (`@google/generative-ai`)
- **Developer Data:** GitHub REST API
- **Deployment:** Vercel-ready

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
cd skillbridge
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables (Optional)

Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key (for live AI generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase PostgreSQL (for cloud database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional GitHub Token (to increase rate limits)
GITHUB_TOKEN=your_github_token_here
```

> **Note:** If environment variables are omitted, SkillBridge runs automatically in **Working Demo Mode** using local browser persistence and intelligent heuristic message generation.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## Supabase PostgreSQL Schema & RLS

Execute the following script in the Supabase SQL Editor:

```sql
-- Profiles Table
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

-- Saved Connections Table
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

## License

MIT © 2026 SkillBridge. Built to expand equal access to technology careers worldwide.
