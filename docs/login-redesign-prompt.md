# AKSA DIGITAL — MASTER UI GENERATION PROMPT

You are generating preview-only HTML for the Aksa HTML Canvas.

## Non-negotiable boundary

You MUST NOT modify the React application. Treat React as read-only infrastructure.

Do not edit or delete:
- `src/**`
- `package.json`
- `vite.config.ts`
- `tsconfig*.json`
- `index.html`
- `bridge/**`
- `mcp/**`
- `docs/**`

Your only deliverable is self-contained HTML for the preview frames. Publish through the `publish_frame_html` MCP tool.

## Required output: one prompt, four states

Generate exactly these four outputs from the same design:
1. `idle`
2. `filled`
3. `positive`
4. `negative`

Do not create four unrelated concepts. Geometry, typography, spacing, component hierarchy and visual language must remain consistent; only state-specific content/feedback may change.

## Device frame

Every output is designed for **iPhone 17 Pro portrait, 402 × 874 logical points**.

The canvas wrapper already supplies the iPhone 17 Pro presentation. Your HTML must be exactly 402px wide and 874px tall and must remain usable when placed inside that frame.

Use safe-area-aware CSS:
- `env(safe-area-inset-top, 62px)` for top content fallback
- `env(safe-area-inset-bottom, 34px)` for bottom content fallback
- never put meaningful controls under the Dynamic Island or Home Indicator
- do not invent Android system UI
- do not draw a fake Dynamic Island/Home Indicator inside the generated HTML; the canvas frame handles that

## Design direction

Use `docs/design.md` as the source of truth. Preserve its terminology, hierarchy and visual direction.

The UI should feel like an enterprise HRIS product: calm, precise, credible, functional and contemporary without being trend-driven.

Avoid generic AI-generated UI patterns. Do NOT use:
- gradients
- glassmorphism
- glowing borders
- decorative blobs
- excessive pills
- fake metrics
- fake testimonials
- fake avatars
- AI sparkle/robot decoration
- giant illustrations
- unnecessary cards
- marketing hero sections
- decorative charts
- excessive shadows

Every visual choice must serve information hierarchy or interaction.

## Login structure

Preserve the product intent:
- back navigation
- Login heading
- supporting instruction
- email field
- password field
- password visibility control
- remember me
- forgot password
- Login CTA
- SSO CTA

## State rules

### idle
- email empty
- password empty
- no error
- no success
- primary CTA follows the design's validation intent

### filled
- realistic email such as `name@company.com`
- masked password
- normal focused/filled field treatment
- no error or success feedback

### positive
- preserve the same layout
- show restrained progress/success transition, e.g. `Signing in…`
- no confetti, fireworks or invented dashboard
- do not introduce a new visual system

### negative
- preserve the user's entered email
- show a concrete inline authentication error:
  `Incorrect email or password. Check your credentials and try again.`
- error styling must be clear but restrained
- do not flood the screen with red

## Technical output

Each HTML document must be standalone:
- inline CSS
- inline JS only if interaction is necessary
- no React
- no Tailwind dependency
- no external component libraries
- no network dependency unless explicitly required
- no iframe nesting

After generating, publish all four states with MCP `publish_frame_html`.
Then call `list_frames` and verify all four exist.

## v2 execution contract

When invoked from the Agent Canvas, treat the prompt as one generation job. Do not split the design into unrelated concepts. Publish only the requested states. The preview canvas will snapshot each state and show a per-frame HTML diff after a later publish.


## Independent frame generation

Each state is an independent artboard/frame. Never merge multiple states into one HTML document or one preview surface. A generation request may target one state only; when multiple states are selected, the host creates one job per state.
