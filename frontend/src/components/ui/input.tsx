import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "h-11 w-full rounded-card border border-border bg-white px-4 text-sm text-ink placeholder:text-muted/60",
          "transition-colors duration-150 focus-visible:border-accent",
          hasError && "border-danger focus-visible:ring-danger",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
