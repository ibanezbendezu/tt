"use client";

import {useParams, usePathname} from "next/navigation";
import {MenuIcon} from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

export const Navbar = ({isCollapsed, onResetWidth}: NavbarProps) => {
    const params = useParams();
    const pathname = usePathname();

    return (
        <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-3 w-full flex items-center gap-x-4">
            {isCollapsed && (
                <MenuIcon
                    role="button"
                    onClick={onResetWidth}
                    className="h-6 w-6 text-muted-foreground"
                />
            )}
            {!pathname.includes("users") && (
                <div className="pl-2">
                    <Breadcrumbs/>
                </div>
            )}
        </nav>
    );
};
