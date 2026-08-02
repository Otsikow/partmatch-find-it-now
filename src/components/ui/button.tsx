import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium tracking-[-0.01em] ring-offset-background transition-[transform,background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.97] touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_20px_rgba(0,122,255,0.16)] hover:shadow-[0_10px_24px_rgba(0,122,255,0.22)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
        outline:
          "border border-border/80 bg-card/80 backdrop-blur-xl hover:bg-secondary/80 hover:text-foreground shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2 text-sm",
        sm: "h-9 px-3 py-2 text-xs rounded-md",
        lg: "h-12 px-6 py-3 text-base rounded-lg",
        icon: "h-11 w-11",
        // Mobile-optimized sizes
        "mobile-sm": "h-10 px-2 py-2 text-xs rounded-md min-w-[44px]",
        "mobile-default": "h-12 px-4 py-3 text-sm rounded-lg min-w-[44px]",
        "mobile-lg": "h-14 px-6 py-4 text-base rounded-xl min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
