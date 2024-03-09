import clsx from "clsx";
import { EyeOff, Eye } from "lucide-react";

import { forwardRef, useState } from "react";

import { Input } from "./input";

import type { InputHTMLAttributes, SVGProps } from "react";

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { isError: boolean }>(({ className, isError, ...props }, ref) => {
  const [isPassVisisble, setIsPassVisibility] = useState(false);
  const togglePassVisibility = () => setIsPassVisibility((prevState) => !prevState);
  return (
    <div className="relative block">
      <Input
        type={isPassVisisble ? "text" : "password"}
        ref={ref}
        {...props}
        className={clsx(
          "pr-12",
          className,
          isError ? "border-red-600 focus:border-red-400 focus-visible:ring-red-400" : "border-navy-600 focus:border-navy-400 focus-visible:ring-navy-400"
        )}
      />
      <DynamicIcon
        isVisible={isPassVisisble}
        onClick={togglePassVisibility}
        strokeWidth={1}
        className={clsx("absolute top-2/4 right-3 block h-5 -translate-y-2/4 cursor-pointer", isError ? "text-red-400" : "text-navy-900")}
      />
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

const DynamicIcon = ({ isVisible, ...rest }: { isVisible: boolean } & SVGProps<SVGSVGElement>) => (isVisible ? <EyeOff {...rest} /> : <Eye {...rest} />);
