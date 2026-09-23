# Aksa Digital — Login Preview Design Direction

## Canvas
- Device: iPhone 17 Pro portrait presentation.
- HTML viewport: 402 × 874 logical pixels.
- The React canvas owns device chrome: Dynamic Island and Home Indicator.
- Generated HTML owns only the app surface.
- Use `env(safe-area-inset-top, 62px)` and `env(safe-area-inset-bottom, 34px)` fallbacks.

## Product character
Enterprise HRIS: calm, precise, credible, functional and contemporary without being trend-driven.

## Login hierarchy
1. Back navigation.
2. Login heading.
3. Supporting instruction.
4. Email field.
5. Password field with visibility control.
6. Remember me.
7. Forgot password.
8. Login CTA.
9. SSO CTA.

## State model
The four outputs share one geometry and one visual language:
- idle — empty credentials, no feedback.
- filled — realistic email and masked password, normal filled/focused treatment.
- positive — restrained progress/success transition; no celebratory decoration.
- negative — inline authentication error; preserve entered email and avoid flooding the screen with red.

## Anti-slop rules
Do not introduce gradients, glassmorphism, glowing borders, decorative blobs, excessive pills, fake metrics, fake testimonials, fake avatars, AI sparkle/robot decoration, giant illustrations, unnecessary cards, marketing hero sections, decorative charts, or excessive shadows.

Every visual decision must support information hierarchy or interaction.
