"use client";

import {SettingsModal} from "@/components/modals/settings-modal";
import {LoadingModal} from "../modals/loading-modal";
import {useEffect, useState} from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <SettingsModal/>
            <LoadingModal/>
        </>
    );
};
