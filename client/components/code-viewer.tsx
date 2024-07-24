"use client"

import React, {useEffect, useState} from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {cb} from "react-syntax-highlighter/dist/esm/styles/prism";
import {Skeleton} from "./ui/skeleton";

export const CodeViewer = ({
                               code,
                               highlightRange = [{start: 0, end: Infinity}],
                               language,
                               color = "#4d4d4d",
                               shouldScrollY = false,
                           }: {
    code: string;
    highlightRange?: { start: number; end: number }[];
    columnHighlight?: { start: number; end: number };
    language?: string;
    color?: string;
    shouldScrollY?: boolean;
}) => {

    const [formattedCode, setFormattedCode] = useState("");

    useEffect(() => {
        setFormattedCode(code);
    }, [code]);

    const lineOverlapCount = new Map<number, number>();
    highlightRange.forEach(range => {
        for (let i = range.start; i <= range.end; i++) {
            if (!lineOverlapCount.has(i)) {
                lineOverlapCount.set(i, 1);
            } else {
                lineOverlapCount.set(i, (lineOverlapCount.get(i) || 0) + 0.25);
            }
        }
    });

    const calculateOpacity = (overlapCount: number) => {
        const baseOpacity = 0.05;
        const maxOpacity = 0.75;
        return Math.min(baseOpacity * overlapCount, maxOpacity);
    };

    const getLineProps = (lineNumber: number) => {
        const overlapCount = lineOverlapCount.get(lineNumber) || 0;
        if (overlapCount > 0) {
            const opacity = calculateOpacity(overlapCount);
            return {style: {backgroundColor: `rgba(255, 255, 255, ${opacity})`}};
        }
        return {};
    };

    return (
        <SyntaxHighlighter
            language={language}
            style={
                cb
            }
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
                fontSize: "11px",
                overflowY: shouldScrollY ? 'scroll' : 'hidden',
                //overflowY: 'scroll',
                maxHeight: '400px',
            }}
            lineProps={lineNumber => getLineProps(lineNumber)}
        >
            {formattedCode}
        </SyntaxHighlighter>
    );
}

CodeViewer.Void = function CodeViewerVoid() {
    return <div className="mt-3 w-full h-8 rounded-md text-center" style={{backgroundColor: "#222222"}}></div>;
}
CodeViewer.Skeleton = function CodeViewerSkeleton() {
    return <Skeleton className="w-full h-48"/>;
};