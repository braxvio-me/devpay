# Launch checklist (non-backend)

Done in the app is marked ✅. Everything else still needs doing before App Store / Play Store submission.

## Product & legal
- ✅ Terms, Privacy, Escrow & Payments, Refunds & Disputes, Community Guidelines (drafts in `src/constants/legal.ts`)
- ✅ Policy acceptance at sign-up and re-acceptance when `POLICY_VERSION` changes
- ✅ In-app account deletion (required by Apple and Google)
- ⬜ Lawyer review of every policy; registered company name and address in the Terms
- ⬜ Bank of Ghana / payment-partner requirements for holding escrow
- ⬜ Real support email in `src/constants/app.ts`
- ⬜ Company name, address and tax number (TIN) on PDF receipts (`src/lib/receipt-pdf.ts`)

## Store assets
- ✅ App icon, adaptive icon, monochrome icon, splash, favicon (generated from the uploaded logo)
- ⬜ Logo as SVG or ≥1024 px PNG; regenerate icons (current source is 282 px)
- ⬜ Store screenshots (6.7", 6.1", iPad if supported; Android phone/tablet), feature graphic, descriptions
- ⬜ Apple privacy “nutrition label” and Google Play Data safety form (camera, microphone, photos, contacts-free, location-free)
- ⬜ Age rating questionnaires

## Build & release
- ⬜ `eas.json` with development / preview / production profiles; bundle id `com.devpay.app` (or chosen) in `app.json`
- ⬜ EAS project id (needed for push tokens and updates)
- ⬜ Sentry (crash reporting) and analytics (e.g. PostHog) keys
- ⬜ Versioning and OTA update policy (`eas update` channels)

## Quality
- ✅ Typecheck and lint clean
- ✅ Same UI on iOS and Android (Inter font, `boxShadow`, custom switch and dialog)
- ✅ Light and dark mode; small phones and tablets; reduce-motion support
- ⬜ Automated tests: unit tests for `AuthContext`, `assistant`, `projects`; end-to-end (Maestro) for sign-up, apply, fund escrow, withdraw
- ⬜ Test on real devices: Face ID / fingerprint lock and sign-in, face scan camera, voice notes, receipt PDF share sheet
- ⬜ Device testing on a low-end Android (Android 9+ for shadows) and an older iPhone
- ⬜ Accessibility pass with VoiceOver / TalkBack and largest text size
- ⬜ Localisation (e.g. Twi, French) if in scope
