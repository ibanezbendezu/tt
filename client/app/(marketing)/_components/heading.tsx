"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Heading = () => {

    return (
        <div className="flex flex-col items-start max-w-3xl space-y-4 w-1/2 px-24">
            <h1 className="text-left text-2xl sm:text-4xl md:text-5xl font-bold">
                Tu aliado en la detección de similitudes entre códigos fuente, {" "}
                <span className="underline text-muted-foreground">Hound.</span>
            </h1>
            <h3 className="text-left text-sm sm:text-lg md:text-xl font-medium">
                Compara fácilmente tus proyectos almacenados en GitHub.
            </h3>
            <div className="pt-4">
                <Button variant="normal" size="sm" asChild>
                    <Link href="/login">
                        Inicia Sesión
                    </Link>
                </Button>
            </div>
        </div>
    );
};
