"use client"

import {Badge} from "@/components/ui/badge"

export const Legend = () => {
    return (
        <div className='flex justify-center items-end absolute bottom-0 p-3 gap-2 left-0 right-0'>
            <Badge variant='secondary'>
                <div className='w-3 h-3 bg-[#41413e] rounded-sm'></div>
                <span>Controladores</span>
            </Badge>
            <Badge variant='secondary'>
                <div className='w-3 h-3 bg-[#293540] rounded-sm'></div>
                <span>Servicios</span>
            </Badge>
            <Badge variant='secondary'>
                <div className='w-3 h-3 bg-[#384047] rounded-sm'></div>
                <span>Repositorios</span>
            </Badge>
        </div>
    )
}