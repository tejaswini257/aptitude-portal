# Aptitude Portal Goal Gap Analysis (From Supplied Documents)

## 1) Document Synthesis
- Core product target: multi-role recruitment platform with aptitude + coding assessment lifecycle.
- Roles required: `Student`, `Super Admin`, `College Admin`, `Company Admin`.
- Recommended (future): `Content Manager`, `Proctor/Evaluator`, `Placement Coordinator`.
- Cross-cutting needs: RBAC, subscription validity, proctoring logs, analytics, report export, drive lifecycle.

## 2) Current Codebase Reality
- Backend stack implemented: `NestJS + Prisma + PostgreSQL`.
- Frontend stack implemented: `Next.js App Router + Tailwind/CSS`.
- This differs from one document that proposes Mongo/Next API routes. Current implementation is already aligned better with the scalability doc (Node/Nest + PostgreSQL style architecture).

## 3) Requirement Coverage Matrix

### 3.1 Authentication + RBAC
- Login/Register: `Implemented`.
- JWT auth guards: `Implemented`.
- Fine-grained permissions matrix (beyond role gates): `Partial`.
- Session/logout invalidation strategy: `Partial` (token removal on client; no server blacklist).

### 3.2 Student Module
- Practice topics and attempt flow: `Partial` (some static topic/challenge pages remain).
- Mock/company tests attempt lifecycle: `Implemented/Partial` (start + submit answer exists; advanced controls limited).
- Student analytics dashboard: `Implemented/Partial`.
- Scorecard export/download: `Missing`.
- Drive registration/apply workflow: `Missing/Partial`.

### 3.3 Company Module
- Company CRUD/admin creation: `Implemented`.
- Company dashboard stats: `Implemented`.
- Create/manage tests: `Implemented` (recently fixed).
- Create/manage drives: `Implemented` (recently fixed, list/create now functional).
- Eligibility criteria engine (10th/12th/CGPA/percentile): `Missing`.
- Invite colleges/students to drive: `Partial` (invite endpoints exist; UX not fully integrated).
- Shortlisting and publish-result lifecycle: `Partial/Missing`.

### 3.4 College Module
- College CRUD and dashboard stats: `Implemented/Partial`.
- Student mapping and management: `Implemented/Partial`.
- Department management: `Implemented`.
- College-level analytics/reporting: `Partial`.
- Approvals for company participation: `Missing`.

### 3.5 Admin Module
- Dashboard overview: `Implemented`.
- Companies/colleges/students listings and CRUD: `Implemented/Partial`.
- Roles page: `Missing` (placeholder UI).
- Subscriptions/validity page: `Missing` (placeholder UI + backend model absent).
- Monitoring/proctoring page: `Missing` (placeholder UI + backend events not wired).
- Global analytics page: `Missing/Partial` (placeholder).
- Audit logs/support workflows: `Missing`.

### 3.6 Questions / Content Governance
- Question CRUD API: `Implemented`.
- Approval workflow for company-created content: `Missing`.
- Tagged question bank controls: `Partial`.

### 3.7 Proctoring + Security
- Proctoring event schema exists: `Partial` (DB model present).
- Webcam/tab-switch ingestion APIs: `Missing`.
- Monitoring dashboard for violations: `Missing`.

### 3.8 Submissions + Evaluation
- Submission start/answer APIs: `Implemented`.
- Coding evaluation modes (compiler/manual/AI): `Missing` end-to-end.
- Auto-submit/expiry jobs: `Missing` (job files empty).

### 3.9 Scalability/Operations (Backend Architecture doc)
- Health endpoint `/health`: `Missing` (controller empty).
- Redis caching layer: `Missing`.
- Queue for async tasks: `Missing`.
- Structured monitoring/metrics: `Missing`.
- Load-test harness (k6/JMeter): `Missing`.

## 4) UI/UX Consistency Status
- Strong global shell/theme now exists and many key pages are aligned.
- Remaining inconsistency areas:
  - Legacy pages still use mixed styles and non-shared patterns.
  - Some pages are placeholders without functional actions.
  - Navigation does not yet expose full lifecycle actions uniformly.

## 5) Lessons to Adopt From Existing Portals
- Superset: drive lifecycle states + eligibility filtering + college-company coordination.
- Handshake: college-gated access and verified student-employer flow.
- IndiaBIX/Testbook: topic-first practice UX, timed sections, explanation-first learning.
- CoCubes/AMCAT: standardized analytics and employability scorecards.

## 6) Recommended Product Name
- Recommended short name: **AptiHire**.
- Why: combines aptitude + hiring intent, short, memorable, and professional.

## 7) Execution Plan (Practical Build Order)

### Phase 1 (High Impact, Low Risk)
- Finish admin functional parity:
  - Roles management (UI + backend role config endpoint).
  - Subscriptions/validity (DB model + middleware + UI).
  - Monitoring page wired to proctoring events.
- Standardize all remaining pages to shared global theme classes.
- Add health endpoint and readiness checks.

### Phase 2
- Company recruitment lifecycle:
  - Eligibility criteria model + APIs + UI.
  - Drive invitation UX and candidate registration workflows.
  - Shortlist + publish result workflow.

### Phase 3
- Student/college advanced outcomes:
  - Scorecard export/download.
  - Rich analytics breakdown and trend graphs.
  - College approval workflows for participation.

### Phase 4 (Scale/Production)
- Redis caching, async queue, retries/circuit breaker.
- Observability stack, rate limiting hardening.
- Load testing scripts and SLO baselines.

## 8) Immediate Next Sprint (Recommended)
- Build full `subscriptions + validity` flow first.
- Then complete `monitoring/proctoring`.
- Then complete `roles/permissions` management UI + backend.

