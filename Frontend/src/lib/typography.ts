import { cn } from "./utils"

// Typography utility classes for consistent font usage
export const typography = {
  // Headings
  h1: "scroll-m-20 text-4xl font-bold tracking-tight",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
  
  // Body text
  p: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  
  // Lists
  ul: "my-6 ml-6 list-disc [&>li]:mt-2",
  ol: "my-6 ml-6 list-decimal [&>li]:mt-2",
  li: "leading-7",
  
  // Code
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  pre: "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4",
  
  // Blockquotes
  blockquote: "mt-6 border-l-2 pl-6 italic",
  
  // Tables
  table: "w-full overflow-y-auto",
  tr: "m-0 border-t p-0 even:bg-muted",
  th: "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
  td: "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
  
  // Links
  a: "font-medium underline underline-offset-4",
  
  // Form elements
  label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  input: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  textarea: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  
  // Buttons
  button: {
    default: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  
  // Cards
  card: "rounded-lg border bg-card text-card-foreground shadow-sm",
  cardHeader: "flex flex-col space-y-1.5 p-6",
  cardTitle: "text-2xl font-semibold leading-none tracking-tight",
  cardDescription: "text-sm text-muted-foreground",
  cardContent: "p-6 pt-0",
  cardFooter: "flex items-center p-6 pt-0",
  
  // Badges
  badge: {
    default: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  },
  
  // Navigation
  nav: "flex items-center space-x-4 lg:space-x-6",
  navLink: "text-sm font-medium transition-colors hover:text-primary",
  navLinkActive: "text-sm font-medium text-primary",
  
  // Sidebar
  sidebar: "flex h-full w-full flex-col gap-2",
  sidebarHeader: "flex h-14 items-center border-b px-4",
  sidebarTitle: "text-lg font-semibold",
  sidebarContent: "flex-1 overflow-auto",
  sidebarFooter: "flex h-14 items-center border-t px-4",
  
  // Dashboard specific
  dashboardTitle: "text-3xl font-bold tracking-tight",
  dashboardSubtitle: "text-muted-foreground",
  statCard: "rounded-xl border bg-card text-card-foreground shadow",
  statValue: "text-2xl font-bold",
  statLabel: "text-xs font-medium text-muted-foreground",
  
  // Status indicators
  status: {
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50", 
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
    pending: "text-orange-600 bg-orange-50",
  },
}

// Helper function to combine typography classes
export function clsx(...classes: (string | undefined | null | false)[]) {
  return cn(...classes.filter(Boolean))
}

// Font weight utilities
export const fontWeights = {
  thin: "font-thin",
  extralight: "font-extralight", 
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
} as const

// Font size utilities
export const fontSizes = {
  xs: "text-xs",
  sm: "text-sm", 
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
} as const

// Line height utilities
export const lineHeights = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
} as const

// Letter spacing utilities
export const letterSpacing = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
} as const

// Text color utilities
export const textColors = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  accent: "text-accent-foreground",
  destructive: "text-destructive",
  white: "text-white",
  black: "text-black",
} as const

// Text alignment utilities
export const textAlign = {
  left: "text-left",
  center: "text-center", 
  right: "text-right",
  justify: "text-justify",
} as const

// Export all utilities for easy access
export const fonts = {
  typography,
  weights: fontWeights,
  sizes: fontSizes,
  lineHeights,
  letterSpacing,
  colors: textColors,
  align: textAlign,
  clsx,
}
