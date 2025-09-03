import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  className?: string
  children: React.ReactNode
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 1, gap = 4, className, children, ...props }, ref) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
    }

    const gridGaps = {
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
          "grid",
          gridCols[cols],
          gridGaps[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Grid.displayName = "Grid"

export { Grid } 