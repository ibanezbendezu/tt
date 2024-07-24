import React from "react";

export const customStyles = {
    control: (provided: any) => ({
        ...provided,
        background: 'hsl(var(--muted))',
        display: 'flex',
        flexWrap: 'nowrap',
        borderColor: 'transparent',
        color: 'hsl(var(--popover-foreground))',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxShadow: 'none',
        '&:hover': {background: 'hsl(var(--primary) / 0.05)'},
        width: '100%',
        height: '36px',
    }),
    menu: (provided: any) => ({
        ...provided,
        background: 'hsl(var(--popover))',
        color: 'hsl(var(--popover-foreground))',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
    }),
    option: (provided: any, state: { isSelected: boolean }) => ({
        ...provided,
        color: 'hsl(var(--popover-foreground))',
        background: state.isSelected ? 'hsl(var(--primary) / 0.05)' : 'transparent',
        '&:hover': {background: 'hsl(var(--primary) / 0.05)'},
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'hsl(var(--popover-foreground))',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: 'hsl(var(--popover-foreground))',
    }),
};

export const onBlurWorkaround = (event: React.FocusEvent<HTMLButtonElement>) => {
    const element = event.relatedTarget;
    if (element && (element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'INPUT')) {
        (element as HTMLElement).focus();
    }
};