"use client";

import { Content, Group, Item, ItemIndicator, ItemText, Label, Root, Separator, Trigger, Value, Viewport } from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@client/shared/lib/utils";

const Select = Root;

const SelectGroup = Group;

const SelectValue = Value;

const SelectTrigger = forwardRef<React.ElementRef<typeof Trigger>, React.ComponentPropsWithoutRef<typeof Trigger>>(({ className, children, ...props }, ref) => (
  <Trigger
    ref={ref}
    className={cn(
      "border-navy-300 placeholder:text-navy-400 focus:ring-navy-400 flex h-10 w-full items-center justify-between rounded-md border bg-transparent py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </Trigger>
));
SelectTrigger.displayName = Trigger.displayName;

const SelectContent = forwardRef<React.ElementRef<typeof Content>, React.ComponentPropsWithoutRef<typeof Content>>(({ className, children, ...props }, ref) => (
  <Content
    ref={ref}
    className={cn("border-navy-100 text-navy-700 relative z-50 box-border min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md animate-in fade-in-80", className)}
    {...props}
  >
    <Viewport className="p-1">{children}</Viewport>
  </Content>
));
SelectContent.displayName = Content.displayName;

const SelectLabel = forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn("text-navy-900 py-1.5 pr-2 pl-8 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = Label.displayName;

const SelectItem = forwardRef<React.ElementRef<typeof Item>, React.ComponentPropsWithoutRef<typeof Item>>(({ className, children, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      "focus:bg-navy-100 relative box-border flex w-full cursor-default select-none items-center rounded-md py-1.5 pr-8 pl-8 text-sm font-medium outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Check className="h-4 w-4" />
      </ItemIndicator>
    </span>

    <ItemText>{children}</ItemText>
  </Item>
));
SelectItem.displayName = Item.displayName;

const SelectSeparator = forwardRef<React.ElementRef<typeof Separator>, React.ComponentPropsWithoutRef<typeof Separator>>(({ className, ...props }, ref) => (
  <Separator ref={ref} className={cn("bg-navy-100 -mx-1 my-1 h-px", className)} {...props} />
));
SelectSeparator.displayName = Separator.displayName;

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue };
