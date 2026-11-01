# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Freelancers in Ghana** (developers, designers, writers, marketers) who have been underpaid, paid late or not paid at all by clients, and want to be sure the money exists before they start work. They are paid on Mobile Money and live on their phones.
- **Clients in Ghana** (startups, agencies, individuals) hiring that talent, who want proof of work before money leaves their hands.
- Visitors arrive on a phone or laptop, usually from a shared link, deciding whether to install an app that will hold their money.

## Product Purpose

DevPay is a milestone escrow marketplace. A client funds each milestone before work starts; DevPay holds the money; the freelancer delivers; the client releases it, or it releases automatically after 7 days of silence. Payouts go to Mobile Money (MTN MoMo, Telecel Cash, AT Money) or bank.

This website exists to explain that mechanism, show the real app, and get the visitor to install the Android APK. App Store and Google Play listings are coming later.

## Positioning

Money first, then work. Each milestone is funded before work begins and released only on approval (or after a 7-day silent review window), with Ghana Card verification for freelancers and business checks for clients, and payouts straight to Mobile Money in cedis.

## Operating Context

- The app is an Expo / React Native app for Android and iOS. Only an Android APK will be distributed at first.
- One account holds one role, client or freelancer.
- Sign-up: phone number, OTP, policies accepted page by page, first-run profile form.
- Security: Face ID / fingerprint app lock, a personal 4-digit wallet PIN that opens the wallet card, and payouts checked with that PIN.
- Verification: upload the Ghana Card (front and back), then a live face scan matched to the card. One-time fee (GH₵ 50 freelancer, GH₵ 150 client; placeholder pricing).
- Payments: fund escrow, release milestones, withdraw to MoMo; a PDF receipt for every payment.
- Chat with voice notes, photos and files; live deadline reminders; a work hub of active and in-review projects.
- Plans: Free, Pro and Business tiers exist in the app (prices are placeholders, not confirmed).

## Capabilities and Constraints

- The backend is not live yet. Payments, OTP and verification are simulated in the app today. The site must not claim that money is moving, that DevPay is licensed by the Bank of Ghana, or that payments are processed by a named partner.
- The APK link is not ready. The download button reads from one config value and shows "coming soon" until it is set.
- Support email is a placeholder (`support@devpay.app` in the app); it must be replaced before launch.
- The policies are drafts awaiting legal review.

## Brand Commitments

- Name: **DevPay**. Tagline in the app: "Freelance work, paid safely."
- Logo: code brackets around a map of Africa, teal with an orange marker (`../assets/images/logo-mark.png`, transparent PNG).
- Colours used in the app and required by the user for the site: action blue `#1C6E99` (dark mode `#2479A6`), ink `#15181B`, brand teal `#13C3A3`, logo orange, canvas `#F3F6F9`, dark ground `#0C1317`.
- No glassmorphism, no translucent frosted surfaces. Solid surfaces, solid status colours.
- Voice: plain, direct, reassuring about money; Ghanaian context (cedis, MoMo, Ghana Card, Accra/Kumasi).

## Evidence on Hand

- The running app (web build of the Expo project at the repository root) for real screenshots: escrow wallet card, PIN pad, face scan, chat with voice notes, receipts, policies flow, profile.
- No users, testimonials, partners, press, ratings or volume figures exist. Do not invent any.

## Product Principles

1. Money is shown before work is asked for.
2. Every claim on the site is something the app visibly does.
3. Ghana first: cedis, Mobile Money, Ghana Card, local cities.
4. Calm and trustworthy over loud: this is somewhere people leave their money.

## Accessibility & Inclusion

Many visitors are on mid-range Android phones and mobile data: fast pages, small images, readable sizes, good contrast, reduced-motion support.
