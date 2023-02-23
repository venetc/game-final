import { forwardRef, type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={twMerge(
        clsx(
          "flex h-10 w-full rounded-md border border-navy-300 bg-transparent py-2 px-3 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
