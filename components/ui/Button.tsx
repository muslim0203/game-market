import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "link";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/30",
  secondary:
    "bg-white/20 backdrop-blur-md border border-white/30 text-foreground hover:bg-white/30",
  ghost: "hover:bg-white/10 hover:backdrop-blur-sm",
  danger:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/40",
  link: "text-primary underline-offset-4 hover:underline"
};

const sizes = {
  sm: "h-8 rounded-xl px-3 text-xs",
  md: "h-9 rounded-xl px-4 text-sm",
  lg: "h-10 rounded-xl px-8 text-sm"
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
