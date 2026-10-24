---
name: premium-motion-protocol
description: Implementation protocol for adding production-ready motion, gestures, and transitions to Expo React Native apps.
---

# Premium React Native Motion Implementation Protocol

You are working on a production Expo React Native application. Follow the `expo-animation`, `expo-design-system`, `expo-router`, and `premium-motion-engineer` skills when relevant.

Do not immediately add animations. First inspect the existing codebase and understand the screen, navigation, components, dependencies, and user interaction.

---

## Step-by-Step Workflow

Follow these steps in strict order:

1. **Audit:**
   - Identify the interactions that genuinely benefit from motion.
   - Leave routine actions unanimated when native behavior is already sufficient.

2. **Design:**
   - Define the trigger, start and end states.
   - Establish duration or spring behavior, easing curves, and gesture response.
   - Plan interruption behavior and a reduced-motion alternative.

3. **Plan:**
   - Identify the smallest set of files and dependencies required.
   - Reuse existing components, theme variables, and design tokens.

4. **Implement:**
   - Use **React Native Reanimated** for continuous motion.
   - Use **React Native Gesture Handler** for gesture interactions.
   - Leverage native navigation transitions where appropriate.

5. **Refine:**
   - Make movement feel immediate, confident, and controlled.
   - Avoid excessive bounce, unnecessary stagger, decorative loops, and animations that delay the user's task.

6. **Validate:**
   - Run type checks (`npx tsc --noEmit`) and linting (`npx expo lint`).
   - Run relevant tests.
   - Check accessibility, rapid interaction, cancellation, and error states.

7. **Review:**
   - Test on both iOS and Android platforms when available.
   - Use a release build and test on a representative lower-end Android device for performance verification.

---

## Non-Negotiable Requirements

- **Keep frame-by-frame gesture work off the React Native JavaScript runtime:** Run continuous updates strictly on the UI thread using shared values and animated styles.
- **No per-frame React state updates:** Never call `setState` or dispatch actions every animation frame.
- **Respect accessibility:** Honor system reduced-motion preferences (`AccessibilityInfo.isReduceMotionEnabled`).
- **Preserve core app functionality:** Do not break navigation, business logic, form validation, or existing behaviors.
- **Evidence-based reporting:** Do not claim performance, accessibility, or test success without verified evidence and measurement.
- **Transparent reporting:** Report changed files, verification results, and any remaining limitations or unverified environments.

---

## Execution Principle

> **Complete one interaction at a time and verify it before moving to the next.**  
> Do not animate the entire application in one uncontrolled rewrite.
