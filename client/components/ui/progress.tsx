"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import {cn} from "@/lib/utils"
import {scaleLinear} from "d3";

const colorScale = scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]);

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({className, value, ...props}, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
            className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-primary transition-all"
            style={{transform: `translateX(-${100 - (value || 0)}%)`, backgroundColor: colorScale(value || 0)}}
        />
    </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export {Progress}
