import * as React from "react"
import { cn } from "@/lib/utils"
import Spinner from "./spinner"

interface LoadingInputProps extends React.ComponentProps<"input"> {
  loading?: boolean
}

function LoadingInput({ className, loading = false, disabled, ...props }: LoadingInputProps) {
  return (
    <div className="relative">
      <input
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          loading && "pr-10",
          className
        )}
        disabled={disabled || loading}
        {...props}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm" color="gray" />
        </div>
      )}
    </div>
  )
}

export { LoadingInput }
