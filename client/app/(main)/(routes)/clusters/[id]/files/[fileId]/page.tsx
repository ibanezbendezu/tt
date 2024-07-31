"use client"

import {CodeViewer} from "@/components/code-viewer";
import {Spinner} from "@/components/spinner";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
    SelectGroup,
    SelectSeparator,
    SelectLabel,
    SelectScrollUpButton,
    SelectScrollDownButton,
} from "@/components/ui/select";
import {useEffect, useState} from "react";
import {
    fileContentRequest,
    fileContentRequestBySha,
    pairsByClusterShaDataRequest
} from "@/api/server-data";
import {Box, User} from "lucide-react";
import React from "react";
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {colorScale} from "@/lib/utils";

interface CodeViewerProps {
    code: string;
    file: any;
}

export default function FilePage({params}: { params: any }) {
    const [data, setData] = useState<any | null>(null);
    const [file, setFile] = useState<CodeViewerProps | null>(null);
    const [fileFragments, setFileFragments] = useState<any[]>([]);
    const [similarity, setSimilarity] = useState<number>(0);

    const [pairFile, setPairFile] = useState<CodeViewerProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await pairsByClusterShaDataRequest(params.id, params.fileId);
            const pairs = res.data;
            const f = res.data.file
            const fContent = await fileContentRequestBySha(f.sha);

            setData(pairs);
            setFile({code: fContent.data, file: f});
            setFileFragments(f.fragments)
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleValueChange = async (value: any) => {
        const pairFile = value.file;
        const pairFileContent = await fileContentRequest(pairFile.id);

        setFileFragments(value.sideFragments)
        setPairFile({code: pairFileContent.data, file: pairFile});
        setSimilarity(value.similarity * 100)
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="m-10">
            <div className="py-4 flex items-baseline justify-between">
                <h2 className="text-4xl font-bold font-mono">
                    <kbd> {data.file.filepath.split("/").pop()} </kbd>
                </h2>
                <div className="flex justify-end items-center gap-2">
                    <div className="flex gap-2">
                        <Badge variant="secondary">
                            <Box className="h-4 w-4 shrink-0"></Box>
                            {data.file.repository.name}
                        </Badge>
                        <Badge variant="secondary">
                            <User className="h-4 w-4 shrink-0"></User>
                            {data.file.repository.owner}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="pb-2 flex items-center gap-2">
                <p className="text-sm font-mono text-muted-foreground">
                    {data.file.filepath}
                </p>
            </div>

            <div className="pt-4 pb-2 flex items-center gap-2">
                <p className="text-sm font-normal text-muted-foreground">
                    Revisa las coincidencias de este archivo con otros archivos en un comparación del código fuente lado
                    a lado.
                </p>
            </div>

            <div className="pt-2 pb-4 flex items-center gap-2">
                <Select onValueChange={handleValueChange}>
                    <SelectTrigger aria-label="Pares">
                        <SelectValue placeholder="Selecciona un archivo para comparar…"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectScrollUpButton/>
                        {data?.repositories.map((repository: any, index: number) => (
                            <React.Fragment key={index}>
                                <SelectGroup>
                                    <SelectLabel>{repository.name}</SelectLabel>
                                    {repository.pairs.map((pair: any) => (
                                        <SelectItem key={pair.file.id} value={pair}>
                                            {pair.file.filepath}
                                            <span className="pl-2" style={{color: colorScale((pair.similarity * 100))}}>
                                                ({Math.round(pair.similarity * 100)}%)
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                                {index < data.repositories.length - 1 && <SelectSeparator/>}
                            </React.Fragment>
                        ))}
                        <SelectScrollDownButton/>
                    </SelectContent>
                </Select>
            </div>

            <Progress value={similarity}/>

            <div className="flex justify-between items-center pt-4 pb-2 gap-2">
                <div className="flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-2">
                        <div className="text-xs font-mono text-muted-foreground">Similitud:</div>
                        <div className="flex gap-2">
                            <Badge variant="secondary">
                                {Math.round(similarity)}%
                            </Badge>
                        </div>
                    </div>
                </div>
                {pairFile && (
                    <div className="flex justify-end items-center gap-2">
                        <div className="flex gap-2">
                            <Badge variant="secondary">
                                <Box className="h-4 w-4 shrink-0"></Box>
                                {pairFile.file.repository.name}
                            </Badge>
                            <Badge variant="secondary">
                                <User className="h-4 w-4 shrink-0"></User>
                                {pairFile.file.repository.owner}
                            </Badge>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 h-auto pt-2">
                <CodeViewer code={file?.code ?? ""} language={file?.file.language} highlightRange={fileFragments}
                    color={"#4d4d4d"}/>
                {pairFile ? (
                    <CodeViewer code={pairFile.code} language={pairFile.file.language}
                        highlightRange={pairFile.file.fragments} color="#4d4d4d"/>
                ) : (
                    <CodeViewer.Void/>
                )}
            </div>
        </div>
    );
}
