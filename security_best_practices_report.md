# Security best-practices report

Date: 2026-09-11

## Executive summary

No critical, high, or medium application vulnerabilities were found after review and remediation. The production bundle contains a Supabase publishable key, not a secret key; database access is constrained by owner-based Row Level Security policies. Two low-risk browser hardening limitations remain and are documented below.

## Remediated during this review

- Added a header-delivered Content Security Policy, clickjacking protection, MIME sniffing protection, a restrictive Permissions Policy, and a Referrer Policy in `_headers:1-7`.
- Removed all native `confirm()` calls and replaced them with the accessible in-app confirmation dialog in `index.html:197-204` and `app.js:88-108`.
- Scoped all profile settings, workout reads, offline synchronization, edits, restores, and deletes to the single profile key in `app.js:172-204` and `app.js:329-371`.
- Updated the vulnerable development dependency reported through `fast-uri`; `npm audit --audit-level=high` now reports zero vulnerabilities.
- Verified the checked-in RLS policies bind select, insert, update, and delete operations to `auth.uid() = user_id` in `supabase/migrations/20260724181611_optimize_rls_policies.sql:1-33`.
- Live anonymous read checks returned zero rows for both `workout_entries` and `profile_settings`.

## Low severity

### SEC-01 — Browser-persisted Supabase session

- Rule ID: JS-STORAGE-001
- Severity: Low
- Location: `app.js:6`, Supabase client initialization
- Evidence: The browser client uses Supabase Auth's default persistent session storage.
- Impact: A successful same-origin XSS could access the browser session. No exploitable XSS path was found in this review, and rendered stored values pass through `escapeHtml` or `escapeAttr`.
- Fix: Moving authentication to server-issued `HttpOnly` cookies requires a server-backed auth architecture and is outside this static PWA change.
- Mitigation: Strict script CSP, pinned third-party script with SRI, owner-based RLS, bounded imports, and escaped rendering reduce the risk.
- False positive notes: Browser session persistence is expected Supabase client behavior and is required for the current installable PWA experience.

### SEC-02 — CSP permits inline styles

- Rule ID: JS-CSP-002
- Severity: Low
- Location: `_headers:2` and `index.html:7`
- Evidence: `style-src 'self' 'unsafe-inline'` is required by existing static and generated style attributes.
- Impact: The CSP provides less protection against CSS injection, but scripts still cannot use `unsafe-inline` or `unsafe-eval`.
- Fix: Replace remaining inline style attributes with CSS classes, then remove `'unsafe-inline'` from `style-src`.
- Mitigation: `script-src` remains allowlisted, object embedding is blocked, and framing is denied by the HTTP header.
- False positive notes: No path from untrusted input to a raw style attribute was found.

## Verification boundary

Static analysis, unit/contract tests, dependency audit, build validation, live response headers, and anonymous database reads are covered. A full authenticated two-account isolation test was not performed because no second account credentials were available.
