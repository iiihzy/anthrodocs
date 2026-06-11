import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border border-black bg-black px-3.5 py-2.5 text-white shadow-sm hover:bg-neutral-800 hover:shadow-md active:scale-[0.98]",
        secondary:
          "border border-black/80 bg-white px-3.5 py-2.5 text-black shadow-sm hover:bg-neutral-50 hover:shadow-md active:scale-[0.98]",
        ghost: "px-2 py-1 text-foreground hover:text-primary-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
