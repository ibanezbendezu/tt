import {cn} from "@/lib/utils"
import React from "react";

function Skeleton({
                      className,
                      ...props
                  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-primary/5", className)}
            {...props}
        />
    )
}

export {Skeleton}
