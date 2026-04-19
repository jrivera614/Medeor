# CLAUDE.md — Medeor Context File

## Project
- App: medeor.app
- Stack: Next.js 14 App Router, React 18, TypeScript
- Deploy: Vercel (auto-deploy from GitHub main branch)
- Repo: github.com/jrivera614/Medeor (private)
- Analytics: GA4 (G-E8LSJD2HJJ), Vercel Analytics
- AdSense: ca-pub-2117457463850623

## Architecture
All source files live in src/app/. Entire codebase is TypeScript except
src/app/blog/posts.js which is pure data content.

Key structure:
- src/app/page.tsx — Homepage
- src/app/layout.tsx — Global layout, GA4, AdSense, PWA meta
- src/app/HomeClient.tsx — Interactive homepage client
- src/app/components.tsx — Shared: useAppState, S (styles), Bar, Prog
- src/app/AppWrapper.tsx — Client wrapper with progress state
- src/app/ErrorBoundary.tsx — Root error boundary
- src/app/AdUnit.tsx — AdSense unit component
- src/app/sitemap.ts — XML sitemap (27 entries)
- src/app/not-found.tsx — 404 page
- src/app/[module]/page.tsx — Dynamic module route (async params)
- src/app/[module]/ModuleClient.tsx — Interactive module UI (steps, quiz, flashcards, scenarios)
- src/app/[module]/error.tsx — Module error boundary
- src/app/data/ — TOPICS array with all training content, fully typed
- src/app/data/types.ts — Central type definitions
- src/app/data/index.ts — Re-exports all data
- src/app/ui/ — Design system primitives
- src/app/ui/tokens.ts — Color, spacing, radius, text tokens (authoritative source)
- src/app/ui/Card.tsx, Tile.tsx, primitives.tsx — Shared UI components
- src/app/pfc/ — PFC Casualty Card (fully decomposed)
- src/app/pcc/ — PCC Hub, Medications, Card alias
- src/app/meds/, tools/, reference/, cpgs/, videos/, rmh/, table8/ — Reference/utility pages
- src/app/blog/ — Blog index + [slug] posts
- src/app/contact/, privacy/, terms/ — Content pages
- src/app/pfc/page.tsx — Legacy redirect to /pcc/card (308)

## PFC Casualty Card (decomposed via PR 6 arc)
- src/app/pfc/PfcClient.tsx — ~115 line orchestrator
- src/app/pfc/styles.ts — shared style constants
- src/app/pfc/types.ts — all state shape interfaces (Patient, Mist, VitalSet, etc.)
- src/app/pfc/constants.ts — TABS, TX_ITEMS, PRIORITIES, LABS, BURN_REGIONS,
  VENT_FIELDS, NURSE_ITEMS, GCS option lists, calcGCS/calcMAP/calcSI helpers
- src/app/pfc/hooks/usePfcState.ts — consolidates all state + localStorage
  load/save with v1→v2 migration. Exports PFC_VERSION = 2.
- src/app/pfc/hooks/usePdfExport.ts — PDF export via html2pdf.min.js popup
- src/app/pfc/components/Fields.tsx — Field, SmallField, NumField,
  ReadOnlyField, SelectorRow, CheckRow, SectionHeader primitives
- src/app/pfc/components/Layout.tsx — header + tab bar + bottom nav
- src/app/pfc/tabs/ — 11 tab components (PatientTab, MistTab, HistoryTab,
  InterventionsTab, LabsTab, BurnsTab, TreatmentTab, VitalsTab, VentTab,
  NursingTab, PpgcTab)
- localStorage key: medeor_pfc_card (MUST NOT CHANGE — existing user data)
- Save format uses shortened keys for backward compat: pt, mist, hx, tq,
  meds, labR, burns, burnD, checks, checkT, prio, vitals, vent, ppgc

## Training Modules (TOPICS in data/)
- march — MARCH Protocol (14 steps, 15 quiz, 15 flashcards)
- epaws — E-PAWS-B (9 steps, 12 quiz, 12 flashcards)
- ravines — RAVINES PFC (8 steps, 12 quiz, 12 flashcards)
- hemorrhage — Hemorrhage Control (8 steps, 10 quiz, 10 flashcards)
- airway — Airway Management (8 steps, 10 quiz, 10 flashcards)
- wbb — Walking Blood Bank (10 steps, 15 quiz, 12 flashcards)
- pfc-scenarios — Tactical Scenarios (4 branching scenarios)
- pfc-meds — PFC Medications
- shock — Shock Recognition
- longitudinal — Longitudinal PFC
- pfc-procedures — PFC Procedures (finger thoracostomy, chest tube, escharotomy,
  fasciotomy, lateral canthotomy, wound debridement) — includes diagrams

## Procedure Diagrams (public/diagrams/)
- cric.svg — Surgical cricothyrotomy, anterior neck view
- ncd.svg — Needle chest decompression, anterior chest with rib landmarks
- npa.svg — NPA insertion, midsagittal schematic (updated for Change 24-1)
- lateral-canthotomy.svg — Orbital compartment syndrome release
- fasciotomy.svg — Lower leg four-compartment release
- escharotomy.png — Circumferential burn incision lines
All diagrams use dark theme (#0d0d14 bg) matching app aesthetic.

## Patterns
- All user data: localStorage only, no backend
- Export: window.open + html2pdf.min.js in /public
- Styles: inline, dark theme (#0a0a0f bg, #e8e8ed text)
- Brand color: #8b5cf6 (purple), #10b981 (green), #ef4444 (red), #f59e0b (amber)
- Fixed header + scrollable tab bar + fixed bottom nav (PFC card layout)
- Max width 480px, mobile-first PWA
- Client components: "use client" at top
- Server components: generateMetadata + hidden SSR div for SEO

## Tooling
- tsconfig.json: strict: true (fully type-safe, enforced in CI)
- next.config.js: no eslint.ignoreDuringBuilds — lint runs on build
- .eslintrc.json: extends next/core-web-vitals, react/no-unescaped-entities off,
  @next/next/no-img-element as warning
- CI: typecheck + validate + smoke + build on every PR
- Branch protection: validate-and-build required status check
- Tests: 219 passing across tests/validate-data.js + tests/smoke-tests.js
- Dependencies: @types/*, eslint, eslint-config-next, typescript all in devDependencies

## SEO Setup
- Each module page has generateMetadata with canonical
- Hidden SSR div in each module page for Google crawlability
- Sitemap excludes: /pfc, /tools, /contact, /privacy, /terms
- layout.tsx has NO hardcoded canonical (each page sets its own)
- themeColor in viewport export (not metadata — Next 14.2 requirement)

## Service Worker (public/sw.js)
- CACHE_NAME: medeor-v8
- Strategy: network-first for HTML (with fallback to cache and "/"),
  cache-first for non-HTML (CSS, JS, images, SVGs)
- Origin check: url.origin !== self.location.origin (strict equality)
- Known gap: no stale-while-revalidate, cached JS chunks require cache
  version bump to invalidate
- Precache list includes core routes but not /pcc/meds, /contact,
  /privacy, /terms (revisit when needed)

## IP
- Trademark: MEDEOR, Class 41, filed 03/24/2026, serial pending
- Copyright: © 2026 Justin Rivera. All rights reserved.

## Style Conventions
- No em dashes anywhere in code or content
- Responses direct and human
- TypeScript throughout (strict: true enforced)
- Inline styles only, no CSS modules
- Comments in plain English, minimal
- Localstorage keys are stable API surface — never rename without migration

## Known gaps / debt
- ModuleClient.tsx is a ~220-line multi-view god-component (same pattern
  PfcClient was before PR 6 arc). Candidate for PR 7 surgery.
- Double design system: components.tsx S bag overlaps with ui/tokens.ts.
  Tokens should win — scheduled for unification.
- ~10 empty catch blocks across AppWrapper, components, contact, tools,
  usePfcState. Candidate for safeStorage helper PR.
- Tests use fs + regex + Function constructor to extract data from TS files.
  Fragile. Replace with tsx/esbuild-register.
- No React Testing Library or interactive-flow tests.
- `<img>` tags in ModuleClient and VideoClient warn on build; scheduled
  conversion to Next's Image component.
