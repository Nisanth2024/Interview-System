# Font Unification Guide

This guide explains how to use the unified font system in your dashboard project. All fonts are now consistently using the **Inter** font family with proper fallbacks and optimized rendering.

## 🎯 Overview

The font system has been unified to ensure:
- **Consistent typography** across all components
- **Professional appearance** with Inter font
- **Optimal readability** with proper line heights and spacing
- **Responsive design** that works on all screen sizes
- **ShadCN integration** for seamless component usage

## 📝 Font Family

### Primary Font: Inter
- **Inter** is used as the primary font family
- Includes comprehensive fallbacks for cross-platform compatibility
- Optimized for screen readability and modern UI design

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

## 🎨 Using the Typography Component

### Basic Usage
```tsx
import { Typography } from '@/components/ui/typography'

// Headings
<Typography variant="h1">Main Title</Typography>
<Typography variant="h2">Section Title</Typography>
<Typography variant="h3">Subsection</Typography>

// Body text
<Typography variant="p">Regular paragraph text</Typography>
<Typography variant="p" size="lg">Larger text for emphasis</Typography>
<Typography variant="p" color="muted">Muted text for descriptions</Typography>
```

### Available Props

#### Variants
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `p` - Paragraphs
- `span`, `div` - Inline/block elements
- `label` - Form labels
- `small` - Small text

#### Sizes
- `xs` (0.75rem)
- `sm` (0.875rem)
- `base` (1rem) - Default
- `lg` (1.125rem)
- `xl` (1.25rem)
- `2xl` (1.5rem)
- `3xl` (1.875rem)
- `4xl` (2.25rem)
- `5xl` (3rem)
- `6xl` (3.75rem)

#### Weights
- `thin` (100)
- `extralight` (200)
- `light` (300)
- `normal` (400) - Default
- `medium` (500)
- `semibold` (600)
- `bold` (700)
- `extrabold` (800)
- `black` (900)

#### Colors
- `default` - Primary text color
- `muted` - Secondary/muted text
- `primary` - Brand color
- `secondary` - Secondary brand color
- `accent` - Accent color
- `destructive` - Error/danger color
- `white` - White text
- `black` - Black text

#### Alignment
- `left` - Left aligned (default)
- `center` - Center aligned
- `right` - Right aligned
- `justify` - Justified text

## 🛠️ Using Font Utilities

### Import Utilities
```tsx
import { fonts } from '@/lib/typography'
```

### Utility Classes
```tsx
// Font weights
<p className={fonts.weights.bold}>Bold text</p>
<p className={fonts.weights.medium}>Medium text</p>

// Font sizes
<p className={fonts.sizes.lg}>Large text</p>
<p className={fonts.sizes.sm}>Small text</p>

// Colors
<p className={fonts.colors.primary}>Primary colored text</p>
<p className={fonts.colors.muted}>Muted text</p>

// Combining utilities
<p className={fonts.clsx(
  fonts.sizes.lg,
  fonts.weights.semibold,
  fonts.colors.primary
)}>
  Large, semibold, primary text
</p>
```

## 📋 Typography Classes

### Predefined Typography Classes
```tsx
import { fonts } from '@/lib/typography'

// Headings
<h1 className={fonts.typography.h1}>Main Title</h1>
<h2 className={fonts.typography.h2}>Section Title</h2>

// Body text
<p className={fonts.typography.p}>Regular paragraph</p>
<p className={fonts.typography.lead}>Lead paragraph</p>
<p className={fonts.typography.muted}>Muted text</p>

// Cards
<div className={fonts.typography.card}>
  <div className={fonts.typography.cardHeader}>
    <h3 className={fonts.typography.cardTitle}>Card Title</h3>
    <p className={fonts.typography.cardDescription}>Description</p>
  </div>
  <div className={fonts.typography.cardContent}>
    Content here
  </div>
</div>

// Dashboard stats
<div className={fonts.typography.statCard}>
  <div className={fonts.typography.statValue}>1,234</div>
  <div className={fonts.typography.statLabel}>Total Users</div>
</div>
```

## 🎯 Best Practices

### 1. Use Typography Component for Text
```tsx
// ✅ Good
<Typography variant="h1">Dashboard</Typography>
<Typography variant="p" color="muted">Welcome to your dashboard</Typography>

// ❌ Avoid
<h1>Dashboard</h1>
<p className="text-muted-foreground">Welcome to your dashboard</p>
```

### 2. Consistent Heading Hierarchy
```tsx
// ✅ Good - Proper hierarchy
<Typography variant="h1">Main Title</Typography>
<Typography variant="h2">Section</Typography>
<Typography variant="h3">Subsection</Typography>

// ❌ Avoid - Skipping levels
<Typography variant="h1">Main Title</Typography>
<Typography variant="h3">Subsection</Typography> // Skipped h2
```

### 3. Use Appropriate Font Weights
```tsx
// ✅ Good - Semantic usage
<Typography variant="h1" weight="bold">Important Title</Typography>
<Typography variant="p" weight="normal">Body text</Typography>
<Typography variant="label" weight="medium">Form Label</Typography>

// ❌ Avoid - Inconsistent weights
<Typography variant="h1" weight="light">Title</Typography>
<Typography variant="p" weight="bold">Body text</Typography>
```

### 4. Color Usage
```tsx
// ✅ Good - Semantic colors
<Typography color="primary">Primary action</Typography>
<Typography color="muted">Secondary info</Typography>
<Typography color="destructive">Error message</Typography>

// ❌ Avoid - Hard-coded colors
<Typography className="text-blue-500">Primary action</Typography>
```

## 🔧 Customization

### Changing Font Family
To change the primary font, update the CSS variables in `src/index.css`:

```css
:root {
  --font-sans: 'Your Font', -apple-system, BlinkMacSystemFont, ...;
}
```

### Adding Custom Typography Classes
Add new classes to `src/lib/typography.ts`:

```tsx
export const typography = {
  // ... existing classes
  customHeading: "text-2xl font-bold text-primary",
  customBody: "text-base leading-relaxed text-muted-foreground",
}
```

### Creating Custom Typography Variants
Extend the Typography component in `src/components/ui/typography.tsx`:

```tsx
interface TypographyProps {
  variant?: "h1" | "h2" | "custom" // Add your variant
  // ... other props
}
```

## 📱 Responsive Typography

The font system automatically handles responsive design:

```tsx
// Responsive sizing
<Typography variant="h1" className="text-2xl md:text-4xl lg:text-5xl">
  Responsive Title
</Typography>

// Responsive weights
<Typography variant="p" className="font-normal md:font-medium">
  Responsive weight
</Typography>
```

## 🎨 Examples

### Dashboard Header
```tsx
<div className="space-y-2">
  <Typography variant="h1" className="text-3xl md:text-4xl">
    Interview Dashboard
  </Typography>
  <Typography variant="p" color="muted" size="lg">
    Manage your interview process and track candidate progress
  </Typography>
</div>
```

### Card Component
```tsx
<div className={fonts.typography.card}>
  <div className={fonts.typography.cardHeader}>
    <Typography variant="h3" className={fonts.typography.cardTitle}>
      Candidate Profile
    </Typography>
    <Typography variant="p" className={fonts.typography.cardDescription}>
      View and edit candidate information
    </Typography>
  </div>
  <div className={fonts.typography.cardContent}>
    <Typography variant="p">
      Candidate details and information...
    </Typography>
  </div>
</div>
```

### Status Badge
```tsx
<span className={fonts.clsx(
  fonts.typography.status.success,
  "px-2 py-1 rounded text-xs font-medium"
)}>
  Active
</span>
```

## 🔍 Testing

To see all typography examples, import and use the `FontExamples` component:

```tsx
import { FontExamples } from '@/components/ui/font-examples'

// In your component
<FontExamples />
```

This will display all available typography styles and variations for reference.

## 📚 Additional Resources

- [Inter Font Documentation](https://rsms.me/inter/)
- [ShadCN Typography](https://ui.shadcn.com/docs/components/typography)
- [Tailwind CSS Typography](https://tailwindcss.com/docs/typography-plugin)

---

**Note**: This font system ensures consistency across your entire dashboard. Always use the Typography component or font utilities instead of direct HTML elements with custom classes for the best results.
