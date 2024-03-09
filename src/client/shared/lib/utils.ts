import { zodResolver } from "@hookform/resolvers/zod";
import { type ClassValue, clsx } from "clsx";

import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import type { UseFormProps } from "react-hook-form";
import type { ZodType } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useZodForm = <Schema extends ZodType>(
  props: Omit<UseFormProps<Schema["_input"]>, "resolver"> & {
    schema: Schema;
  }
) => {
  const form = useForm<Schema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema),
  });

  return form;
};
