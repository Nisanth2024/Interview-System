import * as React from "react"
import { cn } from "@/lib/utils"

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col" | "row-reverse" | "col-reverse"
  align?: "start" | "end" | "center" | "baseline" | "stretch"
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
  wrap?: "wrap" | "nowrap" | "wrap-reverse"
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  className?: string
  children: React.ReactNode
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    direction = "row", 
    align = "start", 
    justify = "start", 
    wrap = "nowrap", 
    gap = 0, 
    className, 
    children, 
    ...props 
  }, ref) => {
    const flexDirection = {
      "row": "flex-row",
      "col": "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    }

    const flexAlign = {
      "start": "items-start",
      "end": "items-end",
      "center": "items-center",
      "baseline": "items-baseline",
      "stretch": "items-stretch",
    }

    const flexJustify = {
      "start": "justify-start",
      "end": "justify-end",
      "center": "justify-center",
      "between": "justify-between",
      "around": "justify-around",
      "evenly": "justify-evenly",
    }

    const flexWrap = {
      "wrap": "flex-wrap",
      "nowrap": "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    }

    const flexGaps = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          flexDirection[direction],
          flexAlign[align],
          flexJustify[justify],
          flexWrap[wrap],
          flexGaps[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Flex.displayName = "Flex"

export { Flex } 