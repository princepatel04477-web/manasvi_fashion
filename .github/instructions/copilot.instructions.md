> Prince | CS Student + Developer | Surat, India
Stack: Next.js · FastAPI · React · Supabase · Python · Node.js · Bootstrap · Tailwind
> 

---

## ⚡ WHO I AM (Read this first, every session)

I am **Prince** — a CS student (Enrollment: 23SE02CS030) and a developer building multiple real-world products simultaneously. I work fast, think in systems, and expect production-grade output. I don't want explanations I didn't ask for. I want **working deliverables**.

---

## 🔧 HOW I WORK (Operational Rules)

### Code Style

- **TypeScript** preferred over plain JS in Next.js/React projects
- **Python**: FastAPI with async/await patterns; type hints always
- Use **named exports** in React; default export only for pages
- File naming: `kebab-case` for files, `PascalCase` for components, `camelCase` for functions
- Keep components **single-responsibility** — split if >150 lines
- Always add **error boundaries** and loading states in React
- API routes: RESTful with proper HTTP status codes

### Git

- Commit messages: `type(scope): description` — e.g. `feat(auth): add OAuth2 login`
- Branch naming: `feature/`, `fix/`, `chore/`
- Never commit `.env` files

### Testing & Verification

- After writing code, **mentally trace the happy path + one error case**
- For FastAPI: always check that Pydantic models are correct
- For Supabase: verify RLS policies won't block the operation

---

## 📁 PROJECT STRUCTURE CONVENTIONS

```
/src
  /app          → Next.js App Router pages
  /components   → Reusable UI components
  /lib          → Utilities, helpers, Supabase client
  /api          → FastAPI routers (Python backend)
  /types        → TypeScript interfaces & types
/public         → Static assets
/docs           → Architecture docs, specs, plans
  architecture.md
  progress.md   ← UPDATE THIS at end of each session
```

**Always check `/docs/architecture.md` before making structural decisions.Always check `/docs/progress.md` at session start to know where we left off.**

---

## 🛠️ COMMANDS (Use these exact commands — don't guess)

```bash
# Dev
npm run dev           # Next.js dev server
uvicorn main:app --reload  # FastAPI dev server

# Build & Check
npm run build         # Production build
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript check

# DB
npx supabase db push  # Push migrations
npx supabase gen types typescript --local > src/types/supabase.ts

# Package managers
npm install           # Node deps (NOT yarn unless package-lock.json is missing)
pip install -r requirements.txt  # Python deps
```

---

## 🎨 DESIGN SYSTEM

### Color Palettes per Project

Ask For Me To Generate

**Always match the correct palette to the correct project. Never mix palettes.**

### UI Principles

- Premium, dark-first aesthetic
- Smooth micro-animations (Framer Motion in Next.js)
- Mobile-first responsive design
- Loading skeletons > spinners

---

## 🤖 HOW TO WORK WITH ME

### DO

- ✅ Give me **complete, working code** — not stubs or placeholders
- ✅ Use `@docs/filename.md` references for detailed specs
- ✅ Ask clarifying questions **before** writing code, not halfway through
- ✅ Think step-by-step for architecture decisions (use `ultrathink` level reasoning)
- ✅ Update `/docs/progress.md` at end of each significant session

### DON'T

- ❌ Add comments like `// TODO: implement this`
- ❌ Write generic boilerplate I didn't ask for
- ❌ Explain basic concepts unless I ask
- ❌ Suggest alternatives unless my approach has a real problem
- ❌ Use `any` type in TypeScript
- ❌ Use `console.log` in production code (use proper logging)

---

## 📊 SESSION PROTOCOL

**At the START of every session:**

1. Read `@docs/progress.md` (if it exists)
2. Identify the active project from the working directory
3. Load relevant sub-rules from `.claude/rules/` if applicable

---

## 🔐 SECURITY RULES

- **NEVER** hardcode API keys, secrets, or credentials in code
- All secrets → `.env.local` (Next.js) or `.env` (FastAPI)
- Supabase operations → always check RLS is enabled on sensitive tables
- Auth → use Supabase Auth; never roll custom JWT unless required
- Input validation → Pydantic (FastAPI) / Zod (Next.js) always

---

## 🚀 DEPLOYMENT TARGETS

**Vercel config**: Always check `vercel.json` exists. Environment variables must be set in Vercel dashboard — remind me if they're missing.

---

## 📌 QUICK REFERENCES

- Supabase JS client → `/src/lib/supabase.ts`
- API base URL → `NEXT_PUBLIC_API_URL` env variable
- Auth context → `/src/context/AuthContext.tsx`
- Types → `/src/types/` (auto-generated Supabase types + custom)

---

*Last updated: Auto-update this date when you modify this file.This file is the supreme law of this project. When in doubt, follow this file.*