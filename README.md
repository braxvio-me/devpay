# DevPay

Freelance marketplace for Ghana with escrow-protected milestone payments. Clients post jobs and fund each milestone into escrow; freelancers deliver and get paid to Mobile Money.

Built with Expo SDK 58, Expo Router and React Native 0.88 (New Architecture). **The app is frontend-only for now**: accounts, payments, chat and notifications run on device with demo data. See [docs/BACKEND_HANDOFF.md](docs/BACKEND_HANDOFF.md) for what the backend must replace.

## Run it

```bash
npm install
npx expo start -c        # dev server (clear cache after dependency changes)
npx expo run:ios         # development build on iOS (needs Xcode)
npx expo run:android     # development build on Android (needs Android Studio)
```

Camera, microphone, Face ID / fingerprint, notifications and the app icon need a **development build**, not Expo Go or a JS reload.

Before committing:

```bash
npx tsc --noEmit
npx expo lint
```

### Demo accounts

| Role | Phone | Password |
| --- | --- | --- |
| Freelancer | 24 123 4567 | `devpay123` |
| Client | 20 555 0101 | `devpay123` |

The sign-up OTP accepts any 6 digits. Accounts and sessions are stored on the device (AsyncStorage).

## Project map

```
src/
  app/                 Routes (Expo Router). Every file is a screen.
    _layout.tsx        Providers, auth guard (Stack.Protected), splash, lock screen, policy gate, dialogs
    welcome.tsx        Onboarding (signed out)
    login / register / verify-otp / forgot-password / choose-role
    index.tsx          Home (freelancer feed or client dashboard)
    contracts.tsx      Work hub: open jobs / my posts, active, in review, completed
    project/[id].tsx   Project detail: milestones, files, activity
    job/…              Job detail, apply, create, applicants
    talent/[id].tsx    Freelancer profile (as seen by clients)
    chat/…, messages   Chat (voice notes, photos, typing)
    assistant.tsx      DevPay Assistant (rule-based search + FAQ)
    verification, kyc, premium, earnings, withdraw, payment, settings, legal, help, about …
  components/
    ds.tsx             Design-system kit (buttons, cards, chips, fields, sheets, switch…)
    ui-text.tsx        Text/TextInput with the Inter font (same on iOS and Android)
    floating-tab-bar   Bottom nav (elastic active pill)
    chat/, payments, success-overlay, dialog-host, lock-screen, policy-gate, animated-splash …
  contexts/
    AuthContext        Accounts, sessions, one role per account, policy acceptance
    AppLockContext     Face ID / fingerprint app lock and privacy cover
    VerificationContext, RoleContext, ThemeContext
  constants/           Theme tokens and demo data (jobs, projects, talent, threads, legal, app)
  lib/                 notify (local notifications), dialog, assistant
  hooks/               use-online (network), pick-image
assets/images/         App icon, splash, adaptive icons, logo (logo-source.jpg is the original upload)
```

Design decisions live in [DESIGN.md](DESIGN.md); product context in [PRODUCT.md](PRODUCT.md).

## Conventions

- Import `Text` / `TextInput` from `@/components/ui-text`, never from `react-native` (keeps Inter and Android metrics consistent).
- Use `Dialog.alert` from `@/lib/dialog` instead of `Alert.alert`.
- Use the `Shadows` tokens / `boxShadow`, not `shadowColor` + `elevation`.
- Colours come from `useTheme().colors`; never hard-code a light-only colour.
- Money-moving actions check `useOnline()` and show `offlineAlert()` when offline.
- Policy text lives in `src/constants/legal.ts`. Bump `POLICY_VERSION` when it changes; every user is asked to accept again.

## Launch

See [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).
