import React from 'react'
import { Typography } from './typography'
import { fonts } from '@/lib/typography'

export function FontExamples() {
  return (
    <div className="p-8 space-y-8">
      {/* Headings */}
      <section className="space-y-4">
        <Typography variant="h2" className="text-foreground">
          Typography System Examples
        </Typography>
        
        <div className="space-y-2">
          <Typography variant="h1">Heading 1 - Main Title</Typography>
          <Typography variant="h2">Heading 2 - Section Title</Typography>
          <Typography variant="h3">Heading 3 - Subsection</Typography>
          <Typography variant="h4">Heading 4 - Card Title</Typography>
          <Typography variant="h5">Heading 5 - Small Title</Typography>
          <Typography variant="h6">Heading 6 - Tiny Title</Typography>
        </div>
      </section>

      {/* Body Text */}
      <section className="space-y-4">
        <Typography variant="h3">Body Text</Typography>
        
        <div className="space-y-4">
          <Typography variant="p">
            This is a paragraph with normal text. It demonstrates the base font size and line height
            for optimal readability across different screen sizes.
          </Typography>
          
          <Typography variant="p" size="lg">
            This is larger body text for emphasis or important content.
          </Typography>
          
          <Typography variant="p" size="sm">
            This is smaller text for captions, metadata, or secondary information.
          </Typography>
          
          <Typography variant="p" color="muted">
            This is muted text for less important information or descriptions.
          </Typography>
        </div>
      </section>

      {/* Font Weights */}
      <section className="space-y-4">
        <Typography variant="h3">Font Weights</Typography>
        
        <div className="space-y-2">
          <Typography weight="thin">Thin weight (100)</Typography>
          <Typography weight="extralight">Extra Light weight (200)</Typography>
          <Typography weight="light">Light weight (300)</Typography>
          <Typography weight="normal">Normal weight (400)</Typography>
          <Typography weight="medium">Medium weight (500)</Typography>
          <Typography weight="semibold">Semibold weight (600)</Typography>
          <Typography weight="bold">Bold weight (700)</Typography>
          <Typography weight="extrabold">Extra Bold weight (800)</Typography>
          <Typography weight="black">Black weight (900)</Typography>
        </div>
      </section>

      {/* Font Sizes */}
      <section className="space-y-4">
        <Typography variant="h3">Font Sizes</Typography>
        
        <div className="space-y-2">
          <Typography size="xs">Extra Small (xs) - 0.75rem</Typography>
          <Typography size="sm">Small (sm) - 0.875rem</Typography>
          <Typography size="base">Base (base) - 1rem</Typography>
          <Typography size="lg">Large (lg) - 1.125rem</Typography>
          <Typography size="xl">Extra Large (xl) - 1.25rem</Typography>
          <Typography size="2xl">2XL - 1.5rem</Typography>
          <Typography size="3xl">3XL - 1.875rem</Typography>
          <Typography size="4xl">4XL - 2.25rem</Typography>
          <Typography size="5xl">5XL - 3rem</Typography>
          <Typography size="6xl">6XL - 3.75rem</Typography>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-4">
        <Typography variant="h3">Text Colors</Typography>
        
        <div className="space-y-2">
          <Typography color="default">Default text color</Typography>
          <Typography color="muted">Muted text color</Typography>
          <Typography color="primary">Primary text color</Typography>
          <Typography color="secondary">Secondary text color</Typography>
          <Typography color="accent">Accent text color</Typography>
          <Typography color="destructive">Destructive text color</Typography>
          <Typography color="white" className="bg-gray-800 p-2 rounded">White text on dark background</Typography>
          <Typography color="black">Black text color</Typography>
        </div>
      </section>

      {/* Alignment */}
      <section className="space-y-4">
        <Typography variant="h3">Text Alignment</Typography>
        
        <div className="space-y-4">
          <div>
            <Typography variant="h4" align="left">Left Aligned</Typography>
            <Typography align="left">
              This text is left aligned, which is the default alignment for most content.
            </Typography>
          </div>
          
          <div>
            <Typography variant="h4" align="center">Center Aligned</Typography>
            <Typography align="center">
              This text is center aligned, often used for titles and headings.
            </Typography>
          </div>
          
          <div>
            <Typography variant="h4" align="right">Right Aligned</Typography>
            <Typography align="right">
              This text is right aligned, commonly used for numbers and dates.
            </Typography>
          </div>
          
          <div>
            <Typography variant="h4" align="justify">Justified</Typography>
            <Typography align="justify">
              This text is justified, creating even margins on both sides. It works well for longer paragraphs and formal documents.
            </Typography>
          </div>
        </div>
      </section>

      {/* Utility Classes Example */}
      <section className="space-y-4">
        <Typography variant="h3">Using Font Utilities</Typography>
        
        <div className="space-y-2">
          <p className={fonts.clsx(fonts.sizes.lg, fonts.weights.semibold, fonts.colors.primary)}>
            Using utility classes: Large, Semibold, Primary color
          </p>
          
          <p className={fonts.clsx(fonts.sizes.base, fonts.weights.medium, fonts.colors.muted)}>
            Using utility classes: Base, Medium, Muted color
          </p>
          
          <p className={fonts.clsx(fonts.sizes.sm, fonts.weights.normal, fonts.colors.secondary)}>
            Using utility classes: Small, Normal, Secondary color
          </p>
        </div>
      </section>

      {/* Status Examples */}
      <section className="space-y-4">
        <Typography variant="h3">Status Indicators</Typography>
        
        <div className="space-y-2">
          <span className={fonts.typography.status.success + " px-2 py-1 rounded text-xs"}>
            Success Status
          </span>
          <span className={fonts.typography.status.warning + " px-2 py-1 rounded text-xs"}>
            Warning Status
          </span>
          <span className={fonts.typography.status.error + " px-2 py-1 rounded text-xs"}>
            Error Status
          </span>
          <span className={fonts.typography.status.info + " px-2 py-1 rounded text-xs"}>
            Info Status
          </span>
          <span className={fonts.typography.status.pending + " px-2 py-1 rounded text-xs"}>
            Pending Status
          </span>
        </div>
      </section>

      {/* Dashboard Style Examples */}
      <section className="space-y-4">
        <Typography variant="h3">Dashboard Style Examples</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={fonts.typography.statCard + " p-4"}>
            <div className={fonts.typography.statValue}>1,234</div>
            <div className={fonts.typography.statLabel}>Total Candidates</div>
          </div>
          
          <div className={fonts.typography.statCard + " p-4"}>
            <div className={fonts.typography.statValue}>567</div>
            <div className={fonts.typography.statLabel}>Active Interviews</div>
          </div>
          
          <div className={fonts.typography.statCard + " p-4"}>
            <div className={fonts.typography.statValue}>89%</div>
            <div className={fonts.typography.statLabel}>Success Rate</div>
          </div>
        </div>
      </section>
    </div>
  )
}
