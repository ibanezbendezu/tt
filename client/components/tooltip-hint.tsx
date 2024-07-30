import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import type {ReactNode} from "react";

interface Props {
    children: ReactNode;
    text: string;
    side?: "top" | "right" | "bottom" | "left";
    disabled?: boolean;
}

export const TooltipHint = ({ children, text, side, disabled }: Props) => {
    if (!text) return <>{children}</>;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild className="!pointer-events-auto">{children}</TooltipTrigger>
                {disabled ? (
                    <TooltipContent side={side}>Opción deshabilitada</TooltipContent>
                ) : (
                    <TooltipContent side={side}>{text}</TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
};