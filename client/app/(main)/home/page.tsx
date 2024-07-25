"use client";

import {Heroes} from "../_components/heroes";
import {ArrowUpLeft, SearchCode, ArrowUp} from "lucide-react";
import React from "react";
import {useAuthStore} from "@/store/auth";

const Home = () => {
    const user = useAuthStore((state) => state.profile);

    return (
        <div className="m-10">
            <div className="py-4 flex items-center justify-start">
                <h2 className="text-4xl font-bold">
                    <kbd className="font-mono"> {"Bienvenido, "} </kbd>
                    <kbd className="text-muted-foreground font-mono">{
                        user?.displayName.split(' ')[0] || "Invitado"}
                    </kbd>
                </h2>
            </div>
            <div className="py-4 flex items-center gap-2">
                <ArrowUpLeft className="h-5 w-5 text-current"/>
                <p className="text-sm font-normal text-muted-foreground">
                    Puedes buscar repositorios haciendo click allí.
                </p>
            </div>
            <div className="py-2 flex items-center gap-2">
                <p className="text-sm font-normal text-muted-foreground">
                    O usa el comando <code className="text-primary">Ctrl+k</code> en el teclado.
                </p>
                <SearchCode className="h-5 w-5 text-current"/>
            </div>
            <div className="py-10 flex items-center gap-2 justify-end">
                <p className="text-sm font-normal text-muted-foreground">
                    Los repositorios seleccionados aparecerán en el carrito.
                </p>
                <ArrowUp className="h-5 w-5 text-current"/>
            </div>
            <div className="py-20 h-full flex flex-col items-center justify-center space-y-4">
                <Heroes/>
            </div>
        </div>
    );
};

export default Home;
