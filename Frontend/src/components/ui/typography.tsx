import * as React from "react"
import { cn } from "@/lib/utils"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label" | "small"
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl"
  weight?: "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black"
  color?: "default" | "muted" | "primary" | "secondary" | "accent" | "destructive" | "white" | "black"
  align?: "left" | "center" | "right" | "justify"
  className?: string
  children: React.ReactNode
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ 
    variant = "div", 
    size = "base", 
    weight = "normal", 
    color = "default", 
    align = "left", 
    className, 
    children, 
    ...props 
  }, ref) => {
    const sizeClasses = {
      "xs": "text-xs leading-4",
      "sm": "text-sm leading-5",
      "base": "text-base leading-6",
      "lg": "text-lg leading-7",
      "xl": "text-xl leading-7",
      "2xl": "text-2xl leading-8",
      "3xl": "text-3xl leading-9",
      "4xl": "text-4xl leading-10",
      "5xl": "text-5xl leading-none",
      "6xl": "text-6xl leading-none",
    }

    const weightClasses = {
      "thin": "font-thin",
      "extralight": "font-extralight",
      "light": "font-light",
      "normal": "font-normal",
      "medium": "font-medium",
      "semibold": "font-semibold",
      "bold": "font-bold",
      "extrabold": "font-extrabold",
      "black": "font-black",
    }

    const colorClasses = {
      "default": "text-foreground",
      "muted": "text-muted-foreground",
      "primary": "text-primary",
      "secondary": "text-secondary-foreground",
      "accent": "text-accent-foreground",
      "destructive": "text-destructive",
      "white": "text-white",
      "black": "text-black",
    }

    const alignClasses = {
      "left": "text-left",
      "center": "text-center",
      "right": "text-right",
      "justify": "text-justify",
    }

    const variantClasses = {
      "h1": "text-4xl font-bold tracking-tight",
      "h2": "text-3xl font-semibold tracking-tight",
      "h3": "text-2xl font-semibold tracking-tight",
      "h4": "text-xl font-medium tracking-tight",
      "h5": "text-lg font-medium tracking-tight",
      "h6": "text-base font-medium tracking-tight",
      "p": "text-base leading-7",
      "span": "text-base",
      "div": "text-base",
      "label": "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      "small": "text-sm leading-none",
    }

    const Component = variant as keyof JSX.IntrinsicElements

    return (
      <Component
        ref={ref as any}
        className={cn(
          "font-sans antialiased",
          variantClasses[variant],
          sizeClasses[size],
          weightClasses[weight],
          colorClasses[color],
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Typography.displayName = "Typography"

export { Typography } 