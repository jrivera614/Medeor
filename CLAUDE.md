# CLAUDE.md — Medeor Context File

## Project
- App: medeor.app
- Stack: Next.js 14 App Router, React, JavaScript
- Deploy: Vercel (auto-deploy from GitHub main branch)
- Repo: github.com/jrivera614/Medeor (private)
- Analytics: GA4 (G-E8LSJD2HJJ), Vercel Analytics
- AdSense: ca-pub-2117457463850623

## Architecture
All source files live in src/app/. Key structure:
- src/app/page.js — Homepage (client component)
- src/app/layout.js — Global layout, GA4, AdSense, PWA meta
- src/app/components.js — Shared: useAppState, S (styles), Bar, Prog
- src/app/[module]/page.js — Dynamic module route (server component wrapper)
- src/app/[module]/ModuleClient.js — Interactive module UI (client)
- src/app/data/ — TOPICS array with all training content
- src/app/pfc/ — PFC Casualty Card (PfcClient.js)
- src/app/sf600/ — SF 600 Medical Record (SF600Client.js)
- src/app/tools/ — Calculators (GCS, Parkland, etc.)
- src/app/reference/ — Reference hub
- src/app/cpgs/ — JTS CPG links
- src/app/videos/ — Deployed Medicine videos
- src/app/rmh/ — Ranger Medic Handbook
- src/app/table8/ — Table 8 reference
- src/app/blog/ — Blog posts
- src/app/sitemap.js — XML sitemap (content pages only, no utility pages)

## Training Modules (TOPICS in data/)
- march — MARCH Protocol (14 steps, 15 quiz, 15 flashcards)
- epaws — E-PAWS-B (9 steps, 12 quiz, 12 flashcards)
- ravines — RAVINES PFC (8 steps, 12 quiz, 12 flashcards)
- hemorrhage — Hemorrhage Control (8 steps, 10 quiz, 10 flashcards)
- airway — Airway Management (8 steps, 10 quiz, 10 flashcards)
- wbb — Walking Blood Bank (10 steps, 15 quiz, 12 flashcards)
- pfc-scenarios — Tactical Scenarios (4 branching scenarios)

## Pending Additions (built, not yet integrated)
- PFC Medications module (pfc-meds)
- Shock Recognition module (shock)
- Longitudinal Care module (longitudinal)
- PFC Procedures module (pfc-procedures)
- SF600 Chronological Medical Record (sf600/)

## Patterns
- All user data: localStorage only, no backend
- Export: window.open + html2pdf.min.js in /public
- Styles: inline, dark theme (#0a0a0f bg, #e8e8ed text)
- Brand color: #8b5cf6 (purple), #10b981 (green), #ef4444 (red)
- Fixed header + scrollable tab bar + fixed bottom nav
- Max width 480px, mobile-first PWA
- Client components: "use client" at top
- Server components: generateMetadata + hidden SSR div for SEO

## SEO Setup
- Each module page has generateMetadata with canonical
- Hidden SSR div in each module page for Google crawlability
- Sitemap excludes: /pfc, /tools, /contact, /privacy, /terms
- layout.js has NO hardcoded canonical (each page sets its own)

## IP
- Trademark: MEDEOR, Class 41, filed 03/24/2026, serial pending
- Copyright: © 2026 Justin Rivera. All rights reserved.

## Style Conventions
- No em dashes anywhere in code or content
- Responses direct and human
- No TypeScript (plain .js throughout)
- Inline styles only, no CSS modules
- Comments in plain English, minimal
