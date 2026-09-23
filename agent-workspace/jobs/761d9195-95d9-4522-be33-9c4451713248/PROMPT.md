# TASK — REDESIGN LOGIN SCREEN

Redesign the Login screen of the Aksa Digital employee application based on the supplied screenshots and the project's `design.md`.

Use Anti-Slop UI principles throughout the design process.

The screenshots are references for the existing product structure and interaction intent, NOT for copying the existing visual implementation.

The final result must feel like a deliberate enterprise HRIS/mobile employee product interface, not a generic AI-generated login screen.

---

## 1. PRIMARY OUTPUT REQUIREMENT

Create ONE Login screen design system that contains exactly FOUR separate visual states:

1. IDLE
2. FILLED
3. POSITIVE
4. NEGATIVE

These are four states of the SAME Login screen.

Do NOT create four unrelated designs.

Do NOT redesign the layout between states unless the state itself requires a meaningful interaction change.

The following must remain consistent across all states:

- page structure
- typography
- spacing
- component dimensions
- button placement
- input placement
- icon treatment
- color system
- radius
- safe-area behavior
- visual hierarchy
- navigation behavior

Only the state-dependent content, validation, loading/success/error feedback, and control state may change.

Output the four states as four separate frames/screens in the same design set.

---

# 2. MANDATORY DEVICE FRAME

Every output MUST use:

Device:
iPhone 17 Pro

Orientation:
Portrait

Frame:
402 × 874

Unit:
logical design points

Use exactly:

402 × 874

DO NOT use:

- 402 × 847
- 393 × 852
- 390 × 844
- 375 × 812
- 428 × 926
- Android device frames
- generic mobile frames
- responsive browser frames

The frame must visually represent the iPhone 17 Pro.

Do not silently substitute another device.

---

# 3. iOS SYSTEM UI + SAFE AREA

The current screenshots contain Android-like system UI.

Do NOT reproduce the Android system UI.

The redesign target is explicitly:

iPhone 17 Pro.

The application UI must be designed around the iOS safe-area model.

Reference safe-area intent:

- top system region: approximately 62pt
- bottom system region: approximately 34pt
- Dynamic Island occupies the top system region
- Home Indicator occupies the bottom system region

These values are visual design references only.

In implementation, safe-area values MUST come from the device/runtime rather than hard-coded assumptions.

---

## SAFE AREA RULES

The application background may extend edge-to-edge.

Application content must NOT collide with:

- Dynamic Island
- status indicators
- Home Indicator

The primary content hierarchy should begin below the top safe area.

The bottom-most interactive content must remain comfortably above the Home Indicator.

Do not place important text, buttons, fields, or navigation controls inside the system UI region.

Do not draw fake:

- Dynamic Island
- status bar
- battery indicator
- Wi-Fi indicator
- Home Indicator

as application components.

The system UI belongs to iOS.

---

# 4. REFERENCE INTERPRETATION

Use the supplied Login screenshot as structural reference.

The existing screen contains:

- back navigation
- Login title
- supporting instruction
- Email field
- Password field
- password visibility control
- Remember me
- Forgot password
- Login CTA
- SSO alternative
- floating support/report control

Preserve the functional intent.

Do NOT blindly preserve the current visual execution.

The goal is to improve hierarchy, spacing, readability, state communication, and product specificity while remaining recognizably part of the same product.

---

# 5. DESIGN DIRECTION FROM DESIGN.MD

Follow the project's existing design system.

Primary visual direction:

- enterprise HRIS
- clean
- credible
- calm
- structured
- functional
- modern without looking trendy
- strong typographic hierarchy
- restrained use of color
- white / neutral surfaces
- deep neutral typography
- blue as the primary interaction color
- semantic colors for state
- thin borders
- subtle elevation only where necessary
- Montserrat typography
- clear hierarchy
- no unnecessary decoration

The interface should feel like a real internal employee application.

Avoid making it look like:

- a marketing landing page
- an AI product
- a fintech app
- a consumer social app
- a generic SaaS template
- a futuristic dashboard
- a glassmorphism concept
- an Apple clone

---

# 6. TYPOGRAPHY

Use Montserrat according to the project's design system.

Establish hierarchy through:

- weight
- size
- line height
- spacing

Do NOT compensate for weak hierarchy with:

- oversized typography
- gradients
- shadows
- decorative containers
- excessive colors

The Login heading must remain visually dominant.

Supporting copy must be clearly secondary.

Field labels must be clearly distinguishable from input values.

Error messages must be readable without becoming visually louder than the primary task.

---

# 7. PAGE STRUCTURE

Use a simple vertical mobile composition.

Recommended hierarchy:

SAFE AREA

↓
Back navigation

↓
Login heading

↓
Supporting description

↓
Email field

↓
Password field

↓
Remember me / Forgot password

↓
Primary Login CTA

↓
Alternative authentication separator

↓
SSO CTA

↓
Available remaining space

↓
Support/report control if required

↓
HOME INDICATOR SAFE AREA

Do not introduce additional sections merely to fill empty space.

The large lower whitespace in the reference can remain if it improves breathing room.

Do not fill empty space with:

- illustrations
- decorative gradients
- feature cards
- statistics
- testimonials
- security badges
- fake product benefits
- decorative shapes

---

# 8. INPUT DESIGN

Email and password fields must feel like part of the same component family.

Each field should have:

- clear label
- input container
- leading icon only if it provides useful recognition
- placeholder/value
- appropriate focus state
- error state where applicable

Do not use excessive rounded-pill styling.

Use the radius defined by `design.md`.

Borders should communicate:

- default
- focused
- error
- disabled

without relying only on color.

---

# 9. PASSWORD FIELD

Password field must contain:

- password input
- visibility toggle

The visibility icon must communicate the actual action.

Do not use decorative icons.

The visibility control must have an appropriate touch target.

When password is hidden:

show masked password.

When password is visible:

show the entered password.

Do not change the overall field geometry between these states.

---

# 10. REMEMBER ME / FORGOT PASSWORD

Keep these controls visually secondary to Login.

Remember me:

- actual checkbox/toggle interaction
- clear checked and unchecked states

Forgot password:

- text action
- clearly interactive
- primary blue interaction color

Do not turn both controls into competing primary buttons.

---

# 11. PRIMARY LOGIN BUTTON

The Login button is the primary action.

It must have:

- strong visual hierarchy
- full-width mobile layout
- clear label
- sufficient touch target
- default
- pressed
- disabled
- loading
- success transition behavior where relevant

Do not add unnecessary iconography to the Login button.

Do not use gradients.

Do not use glow.

Do not use excessive shadow.

---

# 12. SSO

Keep:

"Single sign-on (SSO)"

as the secondary authentication method.

It must clearly look secondary to normal Login.

Do not create another visually dominant primary CTA.

Use an appropriate authentication/building/work icon only if it communicates the function.

Do not use:

- sparkle icon
- AI icon
- robot icon
- generic magic icon
- decorative illustration

---

# 13. FOUR REQUIRED STATES

## STATE 01 — IDLE

Frame name:

Login / Idle

Purpose:

Initial login state before the user enters credentials.

Requirements:

- Email empty
- Password empty
- password masked by default
- Remember me unchecked
- Login action available only according to the product's actual validation rules
- Forgot password visible
- SSO available
- no validation error
- no success message
- no unnecessary helper text

The screen should look calm and ready for input.

Do not add fake placeholder data.

Use:

"Enter your email"

and the project's actual password guidance if already defined.

---

## STATE 02 — FILLED

Frame name:

Login / Filled

Purpose:

User has entered valid-looking credentials but has not submitted yet.

Use realistic but clearly non-production placeholder data.

Example:

email@example.com

Password:

••••••••

Requirements:

- email visibly populated
- password visibly populated but masked
- Login button visually enabled
- Remember me may be checked
- no success state
- no error state
- field focus should be represented intentionally

The visual hierarchy must make it obvious that the form is ready to submit.

Do not invent a real employee identity.

---

## STATE 03 — POSITIVE

Frame name:

Login / Positive

Purpose:

Represent the successful authentication state.

This must communicate that authentication has succeeded.

Do NOT fabricate a dashboard full of content.

Prefer a restrained success transition/state.

Example behavior:

Login CTA enters success/loading transition:

"Signing in..." → "Success"

or a clearly defined successful authentication confirmation before navigation.

If the design tool requires a static frame, show the immediate post-submit success state without inventing additional product content.

Success must use the semantic success treatment defined by `design.md`.

Do not use:

- confetti
- fireworks
- giant checkmark illustration
- gradients
- celebratory animations
- decorative success graphics

Success should feel appropriate for an enterprise employee application.

---

## STATE 04 — NEGATIVE

Frame name:

Login / Negative

Purpose:

Represent failed authentication.

Use a concrete authentication error.

Example:

"Incorrect email or password."

Place the error close to the relevant form context.

Requirements:

- Email remains populated
- Password remains populated or is cleared according to the product's intended security behavior
- Login remains available for retry
- error state is clearly visible
- affected field border/state communicates the error
- supporting error message is readable
- layout does not jump excessively

Do not use vague errors such as:

"Something went wrong."

unless that is genuinely the only known failure state.

Do not blame or shame the user.

Do not use red as a large decorative background.

Red should communicate the actual error state only.

---

# 14. STATE CONSISTENCY

The four frames MUST share the same geometry.

For example:

IDLE
┌──────────────────────┐
│ same header position │
│ same title           │
│ same description     │
│ same email field     │
│ same password field  │
│ same actions         │
│ same login button    │
│ same SSO             │
└──────────────────────┘

FILLED
same geometry

POSITIVE
same geometry where applicable

NEGATIVE
same geometry + localized error treatment

Do not redesign the page for each state.

Do not move components arbitrarily.

Do not create different spacing systems for different states.

---

# 15. MOBILE TOUCH TARGETS

All interactive controls must have comfortable mobile touch areas.

Target approximately 44pt or larger where practical.

This includes:

- back button
- password visibility button
- checkbox
- forgot password
- Login
- SSO
- support/report control

Do not make icons visually large merely to satisfy touch targets.

Use invisible interaction padding where necessary.

---

# 16. SUPPORT / REPORT CONTROL

The screenshot contains a floating purple bug/report control.

Do not automatically preserve it as a decorative floating action button.

Determine its actual function.

If it is a real support/report interaction:

- preserve it as a functional secondary control
- position it so it does not interfere with form interaction
- respect bottom safe area
- use a restrained visual treatment
- do not let it compete with Login

If its behavior is not known:

do not invent functionality.

Use a clearly neutral placeholder treatment or omit it from the redesign rather than fabricating behavior.

---

# 17. ANTI-SLOP RULES

DO NOT use:

- blue-purple gradients
- decorative gradients
- glassmorphism
- excessive blur
- glowing borders
- neon colors
- floating decorative blobs
- abstract background shapes
- excessive pill components
- excessive rounded cards
- giant icons
- decorative AI symbols
- sparkle icons
- robot icons
- fake security badges
- fake trust indicators
- fake statistics
- fake employee information
- decorative charts
- unnecessary illustrations
- excessive shadows
- excessive section cards
- generic SaaS template patterns
- generic "Welcome back" hero treatment
- oversized marketing headlines
- unnecessary animations

Every visual technique must have a product or interaction purpose.

---

# 18. CONTENT RULES

Do not invent:

- employee names
- company statistics
- authentication providers
- security certifications
- account information
- login success metadata
- backend capabilities

Use realistic placeholders only where needed.

Examples:

email@example.com

or:

name@company.com

Do not make placeholder content look like real employee data.

---

# 19. ACCESSIBILITY / INTERACTION

Ensure:

- text remains readable
- error is not communicated by color alone
- focus state is visible
- disabled state is understandable
- touch targets are usable
- labels are associated with their inputs
- icon-only controls have clear semantic meaning
- error message is located near the affected control
- keyboard interaction does not hide the active field
- form remains usable when the iOS keyboard is visible

When the keyboard appears:

- content should scroll/reflow naturally
- Login button must remain reachable
- active field must remain visible
- do not permanently resize the visual hierarchy to accommodate the keyboard

---

# 20. SAFE-AREA COMPOSITION

Use this conceptual structure:

┌──────────────────────────────┐
│      iOS SYSTEM AREA         │
│      Dynamic Island          │
├──────────────────────────────┤
│                              │
│      APP SAFE CONTENT        │
│                              │
│      Back                    │
│      Login                   │
│      Description             │
│      Email                   │
│      Password                │
│      Actions                 │
│      Login                   │
│      SSO                     │
│                              │
├──────────────────────────────┤
│      HOME INDICATOR          │
└──────────────────────────────┘

Do not place app controls in the system areas.

---

# 21. VISUAL HIERARCHY CHECK

The user should understand the page in this order:

1. What screen am I on?
2. What information do I need to provide?
3. Where do I enter my email?
4. Where do I enter my password?
5. How do I submit?
6. What alternative authentication method is available?
7. What went wrong, if authentication failed?

Do not allow secondary actions to compete with Login.

---

# 22. OUTPUT ORGANIZATION

Create exactly four separate frames:

1. `Login — Idle`
2. `Login — Filled`
3. `Login — Positive`
4. `Login — Negative`

All frames:

- 402 × 874
- iPhone 17 Pro
- portrait
- same design system
- same layout geometry
- same safe-area behavior

Do NOT combine the four states into one giant artboard.

Do NOT create additional variants unless required to demonstrate an interaction state.

---

# 23. FINAL ANTI-SLOP DELIVERY GATE

Before considering the design complete, verify:

### PURPOSE
Every visual element serves the login task.

### EVIDENCE
No fabricated product facts, users, statistics, security claims, or capabilities.

### FUNCTION
Every interactive element has an identifiable real purpose.

### RESILIENCE
Idle, filled, positive, negative, keyboard-visible, focus, disabled, and error behavior are considered.

### SPECIFICITY
The design clearly belongs to the Aksa Digital employee/HRIS product and follows `design.md`.

### MOBILE
The design is genuinely composed for 402 × 874 rather than being a desktop layout squeezed into a phone.

### SAFE AREA
Dynamic Island and Home Indicator are treated as iOS system UI, not application components.

### ANTI-SLOP
No generic AI decoration, no unnecessary gradients, no glassmorphism, no fake data, no decorative dashboard patterns.

If any criterion fails, revise the design before final output.

FINAL RULE:

Design the product, not a template.

The four states must look like four moments of the SAME real Login screen.

## Device contract
Target CSS viewport: iPhone 17 Pro — 402 × 873 CSS px — 3×. Use viewport-fit=cover and env(safe-area-inset-*) where appropriate. Do not draw device chrome inside the HTML.