import * as React from "react"
import { cn } from "@/lib/utils"

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  direction?: "vertical" | "horizontal"
  align?: "start" | "end" | "center" | "baseline" | "stretch"
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
  className?: string
  children: React.ReactNode
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    spacing = 4, 
    direction = "vertical", 
    align = "start", 
    justify = "start", 
    className, 
    children, 
    ...props 
  }, ref) => {
    const stackDirection = {
      "vertical": "flex-col",
      "horizontal": "flex-row",
    }

    const stackAlign = {
      "start": "items-start",
      "end": "items-end",
      "center": "items-center",
      "baseline": "items-baseline",
      "stretch": "items-stretch",
    }

    const stackJustify = {
      "start": "justify-start",
      "end": "justify-end",
      "center": "justify-center",
      "between": "justify-between",
      "around": "justify-around",
      "evenly": "justify-evenly",
    }

    const stackSpacing = {
      0: "space-y-0",
      1: "space-y-1",
      2: "space-y-2",
      3: "space-y-3",
      4: "space-y-4",
      5: "space-y-5",
      6: "space-y-6",
      8: "space-y-8",
      10: "space-y-10",
      12: "space-y-12",
      16: "space-y-16",
    }

    const horizontalSpacing = {
      0: "space-x-0",
      1: "space-x-1",
      2: "space-x-2",
      3: "space-x-3",
      4: "space-x-4",
      5: "space-x-5",
      6: "space-x-6",
      8: "space-x-8",
      10: "space-x-10",
      12: "space-x-12",
      16: "space-x-16",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          stackDirection[direction],
          stackAlign[align],
          stackJustify[justify],
          direction === "vertical" ? stackSpacing[spacing] : horizontalSpacing[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Stack.displayName = "Stack"

export { Stack } 