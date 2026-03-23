import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative h-3.5 w-full overflow-hidden rounded-full border border-white/8 bg-white/[0.05]',
        className
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#8d6518,#f1c865,#fff0bc)] transition-all duration-300"
        style={{ width: `${value || 0}%` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }
