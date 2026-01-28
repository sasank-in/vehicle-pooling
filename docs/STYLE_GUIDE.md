# Vehicle Pooling Platform - Style Guide

## Brand Identity

### Mission
To provide a professional, trustworthy, and elegant ride-sharing platform that connects drivers and passengers efficiently while maintaining a classic, timeless aesthetic.

### Visual Principles
1. **Professional** - Clean, organized, business-appropriate
2. **Classic** - Timeless design that won't feel dated
3. **Trustworthy** - Solid colors, clear hierarchy, reliable feel
4. **Modern** - Contemporary touches without being trendy
5. **Accessible** - Easy to use for all users

---

## Color System

### Primary Colors

#### Deep Navy (`#1a2332`)
- **Usage**: Headers, important text, dark backgrounds
- **Psychology**: Trust, professionalism, stability
- **Accessibility**: AAA contrast on white

#### Professional Blue (`#2c5aa0`)
- **Usage**: Primary buttons, links, brand elements
- **Psychology**: Confidence, reliability, corporate
- **Accessibility**: AA contrast on white

#### Secondary Blue (`#4a7bc8`)
- **Usage**: Gradients, hover states, accents
- **Psychology**: Approachable, friendly, modern
- **Accessibility**: AA contrast on white

### Accent Colors

#### Accent Blue (`#6b9bd6`)
- **Usage**: Highlights, decorative elements
- **Contrast**: Use on dark backgrounds only

#### Success Green (`#38a169`)
- **Usage**: Confirmations, success messages, positive actions
- **Psychology**: Growth, success, go-ahead

#### Warning Orange (`#d69e2e`)
- **Usage**: Warnings, pending states
- **Psychology**: Caution, attention needed

#### Error Red (`#e53e3e`)
- **Usage**: Errors, cancellations, destructive actions
- **Psychology**: Stop, danger, important

### Neutral Colors

#### Text Primary (`#1a202c`)
- **Usage**: Body text, headings
- **Contrast**: AAA on white

#### Text Secondary (`#4a5568`)
- **Usage**: Supporting text, labels
- **Contrast**: AA on white

#### Text Muted (`#718096`)
- **Usage**: Placeholder text, disabled text
- **Contrast**: AA on white

#### Slate Dark (`#2d3748`)
- **Usage**: Dark UI elements

#### Slate Medium (`#4a5568`)
- **Usage**: Medium UI elements

#### Slate Light (`#718096`)
- **Usage**: Light UI elements, borders

#### Background (`#f7fafc`)
- **Usage**: Page background, card backgrounds

#### Border Light (`#e2e8f0`)
- **Usage**: Subtle borders, dividers

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Font Weights
- **400** - Regular (body text)
- **500** - Medium (emphasis)
- **600** - Semibold (subheadings)
- **700** - Bold (headings, buttons)
- **800** - Extrabold (hero text, large numbers)

### Type Scale

#### Heading 1
```css
font-size: 2.75rem (44px)
font-weight: 800
line-height: 1.2
letter-spacing: -1px
```
**Usage**: Page titles, hero headings

#### Heading 2
```css
font-size: 2.25rem (36px)
font-weight: 700
line-height: 1.3
letter-spacing: -0.5px
```
**Usage**: Section headings

#### Heading 3
```css
font-size: 1.5rem (24px)
font-weight: 600
line-height: 1.4
letter-spacing: -0.3px
```
**Usage**: Card titles, subsections

#### Body Text
```css
font-size: 1rem (16px)
font-weight: 400
line-height: 1.65
letter-spacing: -0.01em
```
**Usage**: Paragraphs, descriptions

#### Small Text
```css
font-size: 0.875rem (14px)
font-weight: 500
line-height: 1.5
```
**Usage**: Labels, captions, metadata

#### Button Text
```css
font-size: 1.05rem (17px)
font-weight: 700
letter-spacing: 0.3px
```
**Usage**: All buttons

---

## Spacing System

### Base Unit: 4px

#### Spacing Scale
- **0.25rem** (4px) - Minimal spacing
- **0.5rem** (8px) - Tight spacing
- **0.75rem** (12px) - Small spacing
- **1rem** (16px) - Standard spacing
- **1.25rem** (20px) - Medium spacing
- **1.5rem** (24px) - Large spacing
- **2rem** (32px) - Extra large spacing
- **2.5rem** (40px) - Section spacing
- **3rem** (48px) - Major section spacing
- **4rem** (64px) - Hero spacing

### Component Spacing

#### Buttons
- Padding: `0.875rem 2rem` (14px 32px)
- Gap (icon + text): `0.625rem` (10px)

#### Cards
- Padding: `2.5rem` (40px)
- Gap between cards: `2rem` (32px)

#### Forms
- Input padding: `1rem 1.25rem` (16px 20px)
- Field gap: `1.25rem` (20px)
- Label margin: `0.5rem` (8px)

---

## Border Radius

### Scale
- **Small**: `8px` - Small elements, badges
- **Medium**: `10px` - Buttons, inputs
- **Large**: `12px` - Small cards
- **Extra Large**: `14px` - Medium cards
- **XXL**: `16px` - Large cards, containers
- **Hero**: `20px` - Hero sections, major elements
- **Circle**: `50%` - Avatars, circular elements

---

## Shadows

### Elevation System

#### Shadow Small
```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
```
**Usage**: Subtle elevation, hover states

#### Shadow Medium
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
```
**Usage**: Cards, dropdowns, default elevation

#### Shadow Large
```css
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
```
**Usage**: Modals, hover states, important elements

#### Shadow Extra Large
```css
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
```
**Usage**: Hero sections, major components

### Colored Shadows

#### Primary Blue Shadow
```css
box-shadow: 0 4px 12px rgba(44, 90, 160, 0.3);
```
**Usage**: Primary buttons, blue elements

#### Success Shadow
```css
box-shadow: 0 4px 12px rgba(56, 161, 105, 0.3);
```
**Usage**: Success buttons, positive actions

#### Error Shadow
```css
box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
```
**Usage**: Error buttons, destructive actions

---

## Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, #2c5aa0 0%, #4a7bc8 100%);
```
**Usage**: Primary buttons, stat cards

### Dark Gradient
```css
background: linear-gradient(135deg, #1a2332 0%, #2c3e50 50%, #2c5aa0 100%);
```
**Usage**: Hero sections, navigation

### Success Gradient
```css
background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
```
**Usage**: Success buttons, positive indicators

### Error Gradient
```css
background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
```
**Usage**: Error buttons, warnings

### Neutral Gradient
```css
background: linear-gradient(135deg, #4a5568 0%, #718096 100%);
```
**Usage**: Cancel buttons, neutral actions

### Background Gradient
```css
background: linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%);
```
**Usage**: Page backgrounds

---

## Animation & Transitions

### Timing Functions

#### Standard
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```
**Usage**: Most transitions

#### Fast
```css
transition: all 0.15s ease;
```
**Usage**: Quick feedback, small changes

### Common Animations

#### Lift on Hover
```css
transform: translateY(-6px);
box-shadow: [enhanced shadow];
```

#### Scale on Hover
```css
transform: scale(1.02);
```

#### Fade In
```css
opacity: 0 → 1;
transition: opacity 0.3s ease;
```

#### Slide In
```css
transform: translateX(-20px) → translateX(0);
transition: transform 0.3s ease;
```

---

## Component Patterns

### Buttons

#### Primary Button
- Gradient background
- White text
- Colored shadow
- Lift on hover
- Ripple effect

#### Secondary Button
- White background
- Blue border and text
- Fills with gradient on hover

#### Icon Button
- Icon + text with gap
- Consistent padding
- Proper alignment

### Cards

#### Standard Card
- White background
- Border radius: 16px
- Medium shadow
- Top border accent on hover
- Lift effect on hover

#### Stat Card
- Gradient background
- White text
- Decorative radial gradient
- Enhanced shadow
- Scale on hover

### Forms

#### Input Field
- Large padding (1rem)
- Border: 2px solid
- Focus: Blue glow + background change
- Placeholder: Muted color

#### Label
- Bold weight (700)
- Small margin below
- Primary text color

#### Error State
- Red border
- Error message below
- Red text

### Navigation

#### Nav Bar
- Gradient background
- Sticky positioning
- Enhanced shadows
- Animated underlines on links

#### Nav Link
- White text
- Gradient underline on hover
- Smooth transition

---

## Iconography

### Style
- Line icons preferred
- 24px standard size
- 1.5-2px stroke width
- Rounded corners

### Usage
- Always pair with text for clarity
- Use consistent sizing
- Maintain proper spacing
- Ensure proper contrast

### Recommended Icon Sets
- Heroicons
- Feather Icons
- Material Icons (outlined)

---

## Grid System

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1399px
- **Desktop**: 1400px+

### Container
- Max-width: 1400px
- Padding: 2rem (desktop), 1rem (mobile)
- Centered with auto margins

### Grid Patterns

#### Auto-fit Grid
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 2rem;
```

#### Two Column
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 2rem;
```

---

## Best Practices

### Do's
✅ Use consistent spacing from the scale
✅ Maintain proper contrast ratios
✅ Use gradients for primary actions
✅ Add hover states to interactive elements
✅ Use shadows to create depth
✅ Keep animations smooth and purposeful
✅ Test on multiple devices
✅ Ensure keyboard accessibility

### Don'ts
❌ Mix different border radius sizes randomly
❌ Use too many colors in one view
❌ Create animations longer than 0.5s
❌ Forget focus states
❌ Use low contrast text
❌ Overcomplicate layouts
❌ Ignore mobile responsiveness
❌ Use decorative elements excessively

---

## Accessibility Guidelines

### Color Contrast
- Text: Minimum AA (4.5:1)
- Large text: Minimum AA (3:1)
- Interactive elements: Minimum AA

### Focus Indicators
- 3px solid outline
- Primary blue color
- 2px offset
- Visible on all interactive elements

### Touch Targets
- Minimum 44x44px
- Adequate spacing between targets
- Clear visual feedback

### Keyboard Navigation
- Logical tab order
- Visible focus states
- Skip links where appropriate
- Escape key support for modals

---

## File Organization

### CSS Structure
```
App.css
├── Variables
├── Reset/Base
├── Navigation
├── Layout
├── Typography
├── Buttons
├── Forms
├── Cards
├── Components
├── Utilities
└── Responsive
```

### Naming Convention
- Use descriptive class names
- Follow BEM-inspired naming
- Keep specificity low
- Use semantic names

---

## Version History

### v1.0 - Professional Classic Theme
- Initial design system
- Complete color palette
- Typography scale
- Component library
- Animation system
- Responsive design

---

## Resources

### Design Tools
- Figma (for mockups)
- Adobe Color (for palette generation)
- Contrast Checker (for accessibility)

### Development Tools
- Chrome DevTools
- Lighthouse (for performance)
- axe DevTools (for accessibility)

### References
- Material Design Guidelines
- Apple Human Interface Guidelines
- Web Content Accessibility Guidelines (WCAG)

---

**Last Updated**: January 2026
**Maintained By**: Development Team
**Version**: 1.0.0
