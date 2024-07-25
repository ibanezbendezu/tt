"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import useStore from "@/store/clusters";

const Breadcrumbs = () => {
    const clusters = useStore((state) => state.store);
    const pathname = usePathname();
    const pathParts = pathname.split("/").filter(Boolean);

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center">
                {pathParts.map((part, index) => {
                    const href = `/${pathParts.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathParts.length - 1;
                    let label = part.substring(0, 7);

                    if (!/\d+/.test(part) && !isLast) {
                        return null;
                    }

                    return (
                        <li key={index}>
                            <div className="flex items-center">
                                {index > 1 && <span className="mx-1 text-muted-foreground text-sm font-mono">/</span>}
                                {isLast ? (
                                    <span className="text-muted-foreground text-sm font-mono rounded-sm bg-primary/5 px-1">{label}</span>
                                ) : (
                                    <Link
                                        href={href}
                                        className="text-muted-foreground font-mono text-sm hover:text-muted-foreground/70 px-1"
                                    >
                                        {label}
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;