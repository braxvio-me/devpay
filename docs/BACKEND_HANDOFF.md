# Backend handoff

Everything below works in the app today with **on-device or demo data**. Each item names the file that owns it and what the backend has to provide. Replace one seam at a time; the screens should not need to change.

| Area | Where it lives now | What the backend must provide |
| --- | --- | --- |
| Accounts & sign-in | `src/contexts/AuthContext.tsx` (AsyncStorage, SHA-256 password hash on device, seeded demo accounts) | Sign-up, sign-in, sessions/refresh tokens, password reset. Enforce **one role per account** and unique phone/email server-side. Remove seeded accounts and on-device password hashes. |
| Phone OTP | `src/app/verify-otp.tsx`, `forgot-password.tsx` (any 6 digits accepted) | Send and verify SMS codes (e.g. Hubtel or Twilio), with rate limits. |
| Google / Apple sign-in | `src/app/login.tsx` (buttons show “not connected yet”) | OAuth via `expo-auth-session` / Sign in with Apple, linked to one role. |
| Policy acceptance | `AuthContext.acceptPolicies`, `src/constants/legal.ts` | Store accepted `POLICY_VERSION` + timestamp per user; serve policy text; legal review of the drafts. |
| Verification (KYC) | `src/app/kyc.tsx`, `src/contexts/VerificationContext.tsx` | Upload ID/business documents and the face-scan selfie, Ghana Card (NIA) / GRA checks, **selfie-to-card face match and liveness** (the app only simulates the match today), verification status. Fee amounts (GH₵ 50 / GH₵ 150) are placeholders in `verification.tsx`. |
| Payments & escrow | `payment.tsx`, `withdraw.tsx`, `verification.tsx`, `premium.tsx` (timers simulate success) | Paystack / Hubtel / MoMo collections and payouts, escrow ledger, webhooks, receipts, fees. |
| Projects & milestones | `src/constants/projects.ts`, `src/app/project/[id].tsx`, `contracts.tsx` | Contracts, milestone states (funded → in progress → submitted → released), auto-release after 7 days, revisions, disputes. Deadlines are currently set relative to app start. |
| Jobs & proposals | `src/constants/jobs.ts`, `job/create.tsx`, `job/apply.tsx`, `job/applicants.tsx` | Job posts, search/filter, proposals, hiring. |
| First-run profile | `src/app/profile-setup.tsx` (saved to `Account.details` on device) | Store profile fields per role (freelancer: category, level, skills, rate, bio, payout MoMo; client: type, industry, team size, about, hiring needs, budget). |
| Talent | `src/constants/talent.ts`, `talent/[id].tsx`, `explore.tsx` | Public profiles, portfolio projects, reviews, ratings. |
| Chat | `src/constants/threads.ts`, `src/app/chat/[id].tsx` (replies are simulated) | Realtime messaging (websocket), read receipts, typing events, media upload (photos, voice notes), file storage. |
| Notifications | `src/lib/notify.ts` (local only; `enableRemoteNotifications: false` in `app.json`) | Push tokens (`expo-notifications` + EAS project id), server-sent pushes for escrow, proposals, messages and deadlines. |
| Deadline reminders | `nextReminder()` in `projects.ts`, `scheduleDeadline()` in `notify.ts` | Real due dates; server-scheduled reminders so they survive reinstalls. |
| DevPay Assistant | `src/lib/assistant.ts` (keyword rules over local data) | Search API and, if wanted, an AI model with access to listings and help content. Voice and photo questions are not supported yet. |
| Wallet PIN | `src/contexts/WalletLockContext.tsx` (SHA-256 hash in the device keychain via `expo-secure-store`), `src/components/pin-sheet.tsx` | Verify the PIN server-side before payouts (hashed, rate-limited, lockout), PIN reset after identity check. The on-device check only hides the balance. |
| Receipts | `src/contexts/ReceiptsContext.tsx` (on device, with demo history), PDF via `src/lib/receipt-pdf.ts` (`expo-print` + `expo-sharing`) | Issue a receipt per settled payment server-side (numbered, tamper-proof), list endpoint, and optionally email the PDF. Registered company name, address and TIN on the receipt. |
| Earnings & notifications feed | `earnings.tsx`, `notifications.tsx` | Transaction history and notification inbox APIs. |
| Support | `src/app/help.tsx` (opens a pre-filled email), `SUPPORT_EMAIL` placeholder in `src/constants/app.ts` | Real support inbox or ticketing; dispute workflow. |
| Crash reporting | `ErrorBoundary` in `src/app/_layout.tsx` | Sentry (or similar) DSN and source-map upload in EAS builds. |

## Security notes

- Face ID / fingerprint (`AppLockContext`) only gates the app locally. The server must still require a valid session for every request.
- Never trust client-side checks such as “verified only” jobs or hire permissions; enforce them on the server.
- Escrow balances, fees and payout amounts must be calculated server-side.
