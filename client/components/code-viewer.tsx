"use client"

import React, {useEffect, useState} from "react";
import SyntaxHighlighter, {createElement} from "react-syntax-highlighter";
import {stackoverflowLight, stackoverflowDark} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {Skeleton} from "./ui/skeleton";
import {useTheme} from "next-themes";

interface CodeViewerProps {
    code: string;
    highlightRange?: { start: number; end: number }[];
    columnHighlight?: { start: number; end: number };
    language?: string;
    color?: string;
    shouldScrollY?: boolean;
}

export const CodeViewer = ({
        code,
        highlightRange = [{start: 0, end: Infinity}],
        language,
        color = "#4d4d4d",
        shouldScrollY = false,
    }: CodeViewerProps) => {

    const [formattedCode, setFormattedCode] = useState("");
    const { theme } = useTheme();

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
        const overlapCount = lineOverlapCount.get(lineNumber) ?? 0;
        if (overlapCount > 0) {
            const opacity = calculateOpacity(overlapCount);
            const backgroundColor = theme === "dark" || theme === "system"
                ? `rgba(255, 255, 255, ${opacity})` 
                : `rgba(0, 0, 0, ${opacity})`;
            return {style: {backgroundColor}};
        }
        return {};
    };

    return (
        <SyntaxHighlighter
            language={language}
            style={
                theme === "dark" ? stackoverflowDark : stackoverflowLight
            }
            showLineNumbers={true}
            wrapLongLines={true}
            renderer={({
                rows,
                stylesheet,
                useInlineStyles,
            }) => {
                return rows.map((row, index) => {
                    const children = row.children;
                    const lineNumberElement = children?.shift();
    
                    if (lineNumberElement) {
                        row.children = [
                            lineNumberElement,
                            {
                                children,
                                properties: {
                                    className: [],
                                },
                                tagName: 'span',
                                type: 'element',
                            },
                        ];
                    }
    
                    return createElement({
                        node: row,
                        stylesheet,
                        useInlineStyles,
                        key: index,
                    });
                });
            }}
            customStyle={{
                fontSize: "12px",
                borderRadius: "8px",
                overflowY: shouldScrollY ? 'scroll' : 'auto',
                //overflowY: 'scroll',
                maxHeight: shouldScrollY ? '400px' : 'auto',
            }}
            lineProps={lineNumber => getLineProps(lineNumber)}
        >
            {formattedCode}
        </SyntaxHighlighter>
    );
}

CodeViewer.Void = function CodeViewerVoid() {
    const { theme } = useTheme();
    return <div className="w-full h-8 rounded-md text-center" style={{backgroundColor: theme === "dark" ? "#1c1b1b" : "#F6F6F6"}}></div>;
}
CodeViewer.Skeleton = function CodeViewerSkeleton() {
    return <Skeleton className="w-full h-48"/>;
};