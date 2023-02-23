import { forwardRef, type ButtonHTMLAttributes } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-navy-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-navy-100",
  {
    variants: {
      variant: {
        default: "bg-navy-900 text-white hover:bg-navy-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "bg-transparent border border-navy-200 hover:bg-navy-100",
        subtle: "bg-navy-100 text-navy-900 hover:bg-navy-200",
        ghost:
          "bg-transparent hover:bg-navy-100 data-[state=open]:bg-transparent",
        link: "bg-transparent underline-offset-4 hover:underline text-navy-900 hover:bg-transparent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={twMerge(clsx(buttonVariants({ variant, size, className })))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
