"use client";

import {cn} from "@/lib/utils";
import {
    ChevronsRight,
    SquareSlash,
    Code,
    SquareX
} from "lucide-react";
import {BsSlash} from "react-icons/bs";
import {useRouter} from "next/navigation";
import {ElementRef, useEffect, useRef, useState} from "react";
import {useMediaQuery} from "usehooks-ts";

import {Button} from "@/components/ui/button";
import {ConfirmModal} from "@/components/modals/confirm-modal";
import {clusterCreateRequest} from "@/api/server-data";
import {useLoading} from "@/hooks/use-loading";
import {useAuthStore} from "@/store/auth";
import useStore from "@/store/clusters";
import useCart from '@/store/repos';
import {AddDialog} from "./add-dialog"
import AddForm from "./add-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipHint } from "@/components/tooltip-hint";


export const Cart = () => {
    //CORREGIR LOS NOMBRES DE LAS FUNCIONES
    const user = useAuthStore((state) => state.profile);
    const cartItems = useCart(state => state.cart);
    const {store, addClusterToStore} = useStore(state => state);
    const emptyCart = useCart(state => state.emptyCart);

    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    const loading = useLoading();
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        collapse();
    }, []);


    const handleRepos = async () => {
        loading.onOpen();

        const repos = cartItems.map(repo => ({
            owner: repo.owner.login,
            name: repo.name
        }));

        const username = user.username;

        const data = await clusterCreateRequest(repos, username);

        addClusterToStore({newCluster: data.data});
        emptyCart();

        loading.onClose();
        collapse();

        router.push(`/clusters/${data.data.sha}`);
    }

    const resetWidth = () => {
        if (sidebarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const collapse = () => {
        if (sidebarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    return (
        <>
            <AddDialog
                isOpen={isAddOpen}
                setIsOpen={setIsAddOpen}
                title="Agregar Repositorios"
                description="Puedes añadir los proyectos seleccionados a una comparación que hayas creado anteriormente."
            >
                <AddForm setIsOpen={setIsAddOpen} cartCollapse={collapse}/>
            </AddDialog>

            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}
            >
                <div
                    role="button"
                    onClick={collapse}
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 left-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsRight className="h-6 w-6"/>
                </div>
                <div>
                    <div className="flex justify-end">
                        <div className="text-sm font-medium px-3 py-3 gap-2 flex items-center">
                            <span>Repositorios</span>
                            <SquareSlash className="h-5 w-5"/>
                        </div>

                    </div>

                    <div className="flex justify-center items-center gap-2 px-4 pt-1 pb-4">
                        <ConfirmModal onConfirm={() => handleRepos()}>
                            <div className="flex justify-center w-full"
                                 style={{pointerEvents: cartItems.length <= 1 ? 'none' : 'auto'}}>
                                <TooltipHint text="Comparar" side="bottom" disabled={cartItems.length <= 1}>
                                    <Button disabled={cartItems.length <= 1} className="h-6 w-full">
                                        Comparar
                                    </Button>
                                </TooltipHint>
                            </div>
                        </ConfirmModal>

                        <div className="flex justify-center"
                             style={{pointerEvents: (cartItems.length <= 0 || store.length <= 0) ? 'none' : 'auto'}}>
                            <TooltipHint text="Añadir a comparación" side="bottom" disabled={cartItems.length <= 0 || store.length <= 0}>
                                <Button disabled={cartItems.length <= 0 || store.length <= 0} className="h-6 w-full"
                                        onClick={() => setIsAddOpen(true)}>
                                    +
                                </Button>
                            </TooltipHint>
                        </div>
                    </div>

                    <div className="border-b border-primary/10 mx-4 mb-4"></div>

                    {cartItems.length === 0 ? (
                        <div className="flex h-full justify-center">
                            <p className="text-muted-foreground text-sm whitespace-nowrap">
                                No hay repositorios
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-start">
                            {cartItems.map((item, index) => (
                                <div key={index}
                                     className="mx-3 gap-2 min-h-[27px] text-sm flex items-center text-muted-foreground font-medium">
                                    <Code className="shrink-0 h-[18px] w-[18px]"/>
                                    <span
                                        className="overflow-hidden whitespace-nowrap"> {item.owner.login + "/" + item.name} </span>
                                    <SquareX className="ml-auto shrink-0 h-[18px] w-[18px] items-end cursor-pointer"
                                             onClick={() => {
                                                 useCart.getState().removeItemFromCart({itemIndex: index});
                                             }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            {isCollapsed && (
                <TooltipHint text="Haga clic para abrir el carrito" side="left">
                    <div
                        className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-4 z-[99998] cursor-pointer"
                        onClick={resetWidth}
                    >
                        {cartItems.length > 0 && (
                            <div
                                className='absolute aspect-square pointer-events-none h-5 w-5 sm:h-5 grid place-items-center top-0 bg-red-400 text-white rounded-sm right-0 -translate-x-8 translate-y-0.5'>
                                <p className='text-xs sm:text-xs'>{cartItems.length}</p>
                            </div>
                        )}
                        <BsSlash className="h-6 w-6" style={{strokeWidth: '0.5px'}}/>
                    </div>
                </TooltipHint>
            )}
        </>
    );
};
