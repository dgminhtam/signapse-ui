# Design System Inspired by OHLC.Dev

## 1. Visual Theme & Atmosphere

OHLC.Dev embodies a clean, professional financial platform aesthetic built on clarity, precision, and trustworthiness. The design emphasizes minimalist elegance with generous whitespace, allowing data and content to breathe. A neutral foundation of blacks and whites creates a sophisticated, enterprise-ready backdrop that prioritizes information hierarchy and usability. The visual language prioritizes accessibility and legibility, reflecting the platform's role as a reliable data provider for developers, traders, and financial professionals. Subtle shadows and refined typography create depth without visual noise, supporting focused workflows and data analysis.

**Key Characteristics**
- Minimalist, light-first aesthetic with strong typographic hierarchy
- Enterprise-focused design language emphasizing data clarity
- Generous whitespace and breathing room between elements
- Neutral color palette centered on black and white
- Subtle, refined shadow treatment for depth
- Clean, modern sans-serif typography throughout
- Rounded interactive elements contrasting with geometric precision

## 2. Color Palette & Roles

### Primary
- **Background** (`#FFFFFF`): Primary application background and container fill
- **Text Default** (`#000000`): Primary heading and body text color

### Neutral Scale
- **White** (`#FFFFFF`): Page backgrounds, light surfaces, card fills
- **Black** (`#000000`): Headlines, body text, primary interface text
- **Mid-Gray** (`#808080`): Secondary text, labels, captions (inferred for visual hierarchy)
- **Light Gray** (`#F5F5F5`): Subtle section backgrounds and dividers (inferred)

### Interactive
- **Button Text** (`#000000`): Text color on all button variants
- **Link Text** (`#8B8B8B`): Primary link color (derived from oklch(0.556 0 0))

### Surface & Borders
- **Card Border** (`#EBEBEB`): Subtle borders and dividing lines (inferred from context)
- **Input Border** (`#D1D5DB`): Form input and field borders (inferred)

## 3. Typography Rules

### Font Family
**Primary:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

**Secondary:** Same as primary (single-family system)

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|---|---|
| Display / H1 | ui-sans-serif | 70.4px | 600 | 70.4px | -0.02em | Hero headline, maximum impact |
| Heading / H2 | ui-sans-serif | 48px | 600 | 48px | -0.01em | Section headers, page titles |
| Subheading / H3 | ui-sans-serif | 24px | 600 | 32px | 0em | Feature titles, card headers |
| Body | ui-sans-serif | 18px | 400 | 32px | 0em | Primary content, descriptions |
| Body Accent | ui-sans-serif | 18px | 600 | 28px | 0em | Emphasized text, strong accents |
| Link / Navigation | ui-sans-serif | 16px | 400 | 24px | 0em | Navigation links, inline links |
| Button / Control | ui-sans-serif | 14px | 500 | 20px | 0em | Button labels, UI controls |
| Caption / Small | ui-sans-serif | 12px | 400 | 18px | 0.02em | Metadata, small labels |

### Principles
- Single-family system: `ui-sans-serif` provides consistency and clarity across all scales
- Weight distribution: 600 for emphasis (headings), 500 for interaction (buttons), 400 for body and navigation
- Generous line heights (1.4–1.8x font size) support readability and reduce visual density
- Tight letter spacing on large display type creates sophistication; standard spacing on body text maintains accessibility
- Clear hierarchy through size, weight, and line height rather than color variation

## 4. Component Stylings

### Buttons

**Primary Button (CTA)**
- Background: `rgba(0, 0, 0, 0.9)` (near-black)
- Text Color: `#000000`
- Font Size: `14px`
- Font Weight: `500`
- Padding: `12px 24px`
- Height: `40px`
- Border Radius: `3.35544e+07px` (pill-shaped)
- Border: `1px solid rgba(146, 146, 146, 0.6)`
- Line Height: `20px`
- Hover: Darken background to `rgba(0, 0, 0, 1)`, soften border
- Active: Scale 0.98, maintain background
- Disabled: Opacity 0.5, cursor not-allowed

**Secondary Button**
- Background: `rgba(0, 0, 0, 0)` (transparent)
- Text Color: `#000000`
- Font Size: `14px`
- Font Weight: `500`
- Padding: `0px`
- Height: `36px`
- Width: `36px`
- Border Radius: `8px`
- Border: `0px solid transparent`
- Box Shadow: `none`
- Line Height: `20px`
- Hover: Background `rgba(0, 0, 0, 0.05)`
- Focus: Box shadow `0 0 0 2px rgba(0, 0, 0, 0.1)`

**Ghost Button**
- Background: `rgba(0, 0, 0, 0)` (transparent)
- Text Color: `#8B8B8B`
- Font Size: `14px`
- Font Weight: `500`
- Padding: `8px 12px`
- Height: `36px`
- Border Radius: `3.35544e+07px` (pill-shaped)
- Border: `0px solid transparent`
- Box Shadow: `none`
- Line Height: `20px`
- Hover: Background `rgba(0, 0, 0, 0.03)`, text color darkens to `#555555`

### Cards & Containers

**Default Card**
- Background: `#FFFFFF`
- Border: `1px solid #EBEBEB`
- Border Radius: `8px`
- Padding: `24px`
- Box Shadow: `rgba(0, 0, 0, 0.18) 0px 18px 60px -44px` (elevation-sm)
- Margin Bottom: `24px`
- Hover: Box Shadow upgrades to `rgba(0, 0, 0, 0.28) 0px 35px 120px -65px` (elevation-lg)

**Section Container**
- Background: `#F5F5F5`
- Padding: `64px 40px`
- Margin: `0px`
- Border: `none`
- Border Radius: `0px`

**Feature Container**
- Background: `#FFFFFF`
- Padding: `48px 32px`
- Border Radius: `8px`
- Border: `1px solid #EBEBEB`
- Box Shadow: `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px` (elevation-md)

### Inputs & Forms

**Text Input**
- Background: `#FFFFFF`
- Border: `1px solid #D1D5DB`
- Border Radius: `6px`
- Padding: `12px 16px`
- Font Size: `16px`
- Font Family: `ui-sans-serif`
- Font Weight: `400`
- Line Height: `24px`
- Color: `#000000`
- Focus: Border color `#000000`, box shadow `0 0 0 3px rgba(0, 0, 0, 0.1)`
- Placeholder: Color `#999999`, font weight `400`
- Disabled: Background `#F5F5F5`, color `#CCCCCC`, cursor not-allowed

**Select / Dropdown**
- Same as text input
- Appearance: `none` to remove browser defaults
- Background Image: Chevron icon on right at `16px` from right edge
- Padding Right: `40px` (accommodate icon)

### Navigation

**Top Navigation Bar**
- Background: `rgba(255, 255, 255, 0.95)` (semi-transparent white)
- Padding: `12px 24px`
- Height: `70px`
- Border Bottom: `1px solid #EBEBEB`
- Display: `flex`
- Align Items: `center`
- Justify Content: `space-between`
- Box Shadow: `rgba(0, 0, 0, 0.1) 0px 1px 2px 0px` (elevation-xs)
- Font Size: `16px`
- Font Weight: `400`

**Navigation Link**
- Text Color: `#000000`
- Font Size: `16px`
- Font Weight: `400`
- Padding: `8px 16px`
- Border Radius: `6px`
- Hover: Background `rgba(0, 0, 0, 0.05)`, text color remains `#000000`
- Active: Border bottom `2px solid #000000`, font weight `600`

**Logo / Brand**
- Font Size: `18px`
- Font Weight: `700`
- Text Color: `#000000`
- Display: `flex`
- Align Items: `center`
- Gap: `8px`

### Links

**Inline Link**
- Color: `#8B8B8B`
- Font Size: `16px`
- Font Weight: `400`
- Text Decoration: `none`
- Hover: Color `#000000`, text decoration `underline`
- Focus: Outline `2px solid rgba(0, 0, 0, 0.2)`, outline offset `2px`

**Footer Link**
- Color: `#808080`
- Font Size: `14px`
- Font Weight: `400`
- Hover: Color `#000000`

## 5. Layout Principles

### Spacing System
**Base Unit:** `4px`

**Scale:** `4px → 8px → 12px → 16px → 20px → 24px → 28px → 32px → 40px → 48px → 56px → 64px`

**Usage Context:**
- `4px` – Micro spacing (icon gaps, tight layouts)
- `8px` – Button padding, small gaps
- `12px` – Form input padding, label margins
- `16px` – Card padding, section margins
- `24px` – Component spacing, padding inside containers
- `32px` – Section vertical spacing
- `40px` – Horizontal padding on wide containers
- `48px` – Section padding, vertical rhythm
- `56px` – Large section gaps
- `64px` – Major layout divisions, section blocks

### Grid & Container
- **Max Width:** `1440px` (max container width)
- **Gutter:** `24px` (horizontal padding on sides)
- **Column Strategy:** 12-column responsive grid with flexible column width
- **Section Padding:** `64px 40px` (vertical × horizontal) on full-width sections
- **Container Breakpoint:** Content centers above `1440px` with equal side margins

### Whitespace Philosophy
- Emphasize breathing room over compression; sections feel open and inviting
- Use consistent vertical rhythm (multiples of `8px`) for predictable spacing
- Balance dense content areas (data tables) with whitespace-rich hero sections
- Margin and padding use consistent increments to maintain visual harmony
- Section separators achieved through subtle color shifts, not thick borders

### Border Radius Scale
- `0px` – No radius; structural dividers, navigation bars, full-width sections
- `6px` – Input fields, compact components, accessible touch targets
- `8px` – Cards, buttons, moderate-scale containers
- `3.35544e+07px` – Fully rounded (pill-shaped); primary buttons, badge-style elements

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (None) | `box-shadow: none; background: #FFFFFF` | Body text, inline content, navigation items |
| Elevation XS | `box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | Subtle lift; borders, outlines |
| Elevation SM | `box-shadow: rgba(0, 0, 0, 0.18) 0px 18px 60px -44px` | Cards at rest, floating panels |
| Elevation MD | `box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px` | Form inputs, medium containers, modals |
| Elevation LG | `box-shadow: rgba(0, 0, 0, 0.28) 0px 35px 120px -65px` | Dropdown menus, popovers, emphasis cards on hover |
| Elevation XL | `box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | Toast notifications, tooltips |

**Shadow Philosophy:** Shadows employ subtle, layered values to create perceived depth without visual heaviness. Larger offsets and softer blur simulate distance, while small negative spread values keep shadows contained. This approach maintains a clean, professional appearance while clearly distinguishing interactive and elevated surfaces. Shadows activate primarily on hover and focus states, reserving always-on elevation for cards and panels that require persistent distinction.

## 7. Do's and Don'ts

### Do
- Use the `ui-sans-serif` font stack consistently across all text elements
- Maintain whitespace and breathing room in dense sections—separate blocks by `32px` or `48px`
- Apply pill-shaped buttons (`border-radius: 3.35544e+07px`) exclusively for primary CTAs
- Use `8px` border radius on secondary buttons, inputs, and cards for moderate roundness
- Pair font weights strategically: `600` for headings, `500` for interactive elements, `400` for body
- Leverage the shadow scale incrementally—use `sm` for cards, `md` for forms, `lg` on hover states
- Ensure text color contrast ratios meet WCAG AA standards (black on white = 21:1; gray links should maintain 4.5:1)
- Group related navigation items with `16px` horizontal padding; use `flex` and `gap: 12px` for consistent spacing
- Apply the spacing scale strictly—no arbitrary values like `15px` or `35px`
- Test interactive states (hover, active, focus) on all buttons and links

### Don't
- Mix font families; the system is single-family (`ui-sans-serif` throughout)
- Create custom shadow values; use only the defined `sm`, `md`, `lg`, `xl` levels
- Apply rounded corners to full-width sections or structural dividers
- Use black or white text on colored backgrounds without sufficient contrast verification
- Override line heights from the typography table; they are calibrated for readability
- Add borders to buttons unless explicitly part of the variant design (e.g., secondary buttons)
- Center-align body copy longer than a single line; left-align for scannability
- Use opacity-based disabled states without changing cursor to `not-allowed`
- Introduce new spacing values outside the documented scale (`4px` increments up to `64px`)
- Apply multiple box shadows without good reason; layer only when creating distinct depth levels

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|---|
| Mobile | `320px–639px` | Single column, full-width sections, padding `16px 20px`, font sizes reduce 10–15%, buttons stack vertically |
| Tablet | `640px–1023px` | 2 columns where applicable, padding `24px 32px`, card grids 2 columns, navigation collapses to hamburger |
| Desktop | `1024px–1439px` | 3–4 column layouts, padding `40px 48px`, full navigation visible, max width applied |
| Wide | `1440px+` | 12-column grid, max width `1440px` with centered margins, full feature set visible |

### Touch Targets
- **Minimum Size:** `44px × 44px` for all interactive elements (buttons, links, inputs)
- **Mobile Spacing:** Increase padding inside touch targets to `12px` minimum on mobile
- **Link Hit Areas:** Extend clickable areas using padding rather than resizing text
- **Button Accessibility:** Ensure icon-only buttons display tooltips on hover/focus

### Collapsing Strategy
- **Navigation:** On tablets, collapse secondary menu items into a dropdown; show hamburger icon at `<1024px`
- **Cards:** On mobile, reduce card padding from `24px` to `16px`; stack multi-column grids into single column
- **Headings:** Reduce h1 from `70.4px` to `48px` on tablet; to `32px` on mobile
- **Body Text:** Maintain `18px` on desktop and tablet; reduce to `16px` on mobile for comfort
- **Sections:** Reduce vertical padding from `64px` to `48px` on tablet; to `32px` on mobile
- **Columns:** Two-column layouts collapse to single column below `768px`; grid gaps reduce from `24px` to `16px`

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA Button:** Background `rgba(0, 0, 0, 0.9)`, Text `#000000`, Border `1px solid rgba(146, 146, 146, 0.6)`
- **Secondary Button:** Transparent background, Text `#000000`, Border `0px`
- **Ghost Button:** Transparent background, Text `#8B8B8B`
- **Page Background:** `#FFFFFF`
- **Text Default:** `#000000`
- **Link Text:** `#8B8B8B` (gray), hover to `#000000`
- **Card Background:** `#FFFFFF` with `1px solid #EBEBEB` border
- **Section Background:** `#F5F5F5`
- **Input Border:** `#D1D5DB` (light gray)

### Iteration Guide

1. **Always use `ui-sans-serif` font family** with full system fallback stack; never substitute other fonts.

2. **Apply typography strictly per table:** h1 = `70.4px` / `600` / `70.4px` line height; h2 = `48px` / `600` / `48px`; body = `18px` / `400` / `32px`.

3. **Spacing increments only:** Use `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `28px`, `32px`, `40px`, `48px`, `56px`, `64px`—no arbitrary values.

4. **Button styles are three types:** Pill CTA (border-radius `3.35544e+07px`, near-black fill), Secondary (no fill, `8px` radius), Ghost (transparent, rounded).

5. **Cards and containers:** `#FFFFFF` background, `1px solid #EBEBEB` border, `8px` border radius, `24px` padding, shadow from elevation scale.

6. **Shadows only from predefined levels:** SM, MD, LG, XL; never custom values.

7. **Navigation:** `70px` height, `12px 24px` padding, flex layout, links `16px` weight `400`; hover background `rgba(0, 0, 0, 0.05)`.

8. **Forms:** Input background `#FFFFFF`, border `#D1D5DB`, padding `12px 16px`, focus state adds `0 0 0 3px rgba(0, 0, 0, 0.1)` shadow.

9. **Whitespace is critical:** Section vertical padding `64px` (desktop) / `48px` (tablet) / `32px` (mobile); margins between sections `32px` minimum.

10. **Responsive breakpoints:** Mobile `<640px`, Tablet `640px–1023px`, Desktop `1024px–1439px`, Wide `≥1440px`; collapse grids and reduce font sizes accordingly.