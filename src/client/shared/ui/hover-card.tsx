"use client";

import { Content, Root, Trigger } from "@radix-ui/react-hover-card";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

import { cn } from "@client/shared/lib/utils";

const HoverCard = Root;

const HoverCardTrigger = Trigger;

const HoverCardContent = forwardRef<ElementRef<typeof Content>, ComponentPropsWithoutRef<typeof Content>>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn("z-50 w-64 rounded-md border border-slate-100 bg-white p-4 shadow-md outline-none animate-in zoom-in-90", className)}
    {...props}
  />
));
HoverCardContent.displayName = Content.displayName;

export { HoverCard, HoverCardContent, HoverCardTrigger };
