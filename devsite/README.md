# DevPay website

Marketing site for DevPay: what it does, how escrow works, real screenshots from the app, and the Android APK download. Next.js 16 + Tailwind v4.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Before launch

| What | Where |
| --- | --- |
| APK download link | `NEXT_PUBLIC_APK_URL` (and `NEXT_PUBLIC_APK_VERSION`) env vars. Until set, the button says "APK coming soon" and scrolls to the download section. |
| Support email | `SUPPORT_EMAIL` in `lib/site.ts` (placeholder, same as the app). |
| Policies | `lib/legal.ts` is copied from the app's `src/constants/legal.ts`. Keep both in sync; both are drafts pending legal review. |
| Store links | Google Play / App Store are shown as "coming soon" text. Add official badges when the listings exist. |

## App screenshots

`public/screens/*.jpg` are real captures of the DevPay app's web build at 390×844 (@2x). To refresh them, run the app (`npx expo start --web` in the repo root), capture the same screens, and replace the files with the same names.

## Notes

- No invented numbers, testimonials or partners. The ledger rows are labelled as examples from the app's demo account.
- The site says payments switch on at public launch, because the backend isn't live yet.
