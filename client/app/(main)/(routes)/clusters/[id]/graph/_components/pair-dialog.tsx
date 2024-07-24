import * as React from 'react';
import {useEffect, useState} from 'react';
import {fileContentRequest} from '@/api/server-data';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Badge} from '../../../../../../../components/ui/badge';
import {Label} from '../../../../../../../components/ui/label';
import {Progress} from '../../../../../../../components/ui/progress';
import {CodeViewer} from '../../../../../../../components/code-viewer';
import {Spinner} from '../../../../../../../components/spinner';
import {GitCompareArrows} from 'lucide-react';

export function PairDialog({
                               children,
                               isOpen,
                               setIsOpen,
                               pair,
                           }: {
    children?: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pair?: any;
}) {

    const [file1Content, setFile1Content] = useState<any>(null);
    const [file2Content, setFile2Content] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (pair && pair.file1 && pair.file2) {
                const file1Content = await fileContentRequest(pair.file1.id);
                const f1c = file1Content.data;
                const file2Content = await fileContentRequest(pair.file2.id);
                const f2c = file2Content.data;

                setFile1Content(f1c);
                setFile2Content(f2c);
            }
        };
        fetchData();
    }, [pair]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-7xl">
                <DialogHeader className="border-b pb-3 items-center">
                    {pair &&
                        <React.Fragment>
                            <DialogTitle>
                                {pair.file1?.filepath.split("/").pop()}
                                <GitCompareArrows size={20} className="inline-block mx-2"/>
                                {pair.file2?.filepath.split("/").pop()}
                            </DialogTitle>

                            <DialogDescription>
                                Comparación del código fuente de los archivos seleccionados.
                            </DialogDescription>
                        </React.Fragment>
                    }
                </DialogHeader>
                <div className="grid gap-6">
                    {pair &&
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Similitud</Label>
                                <Label>{Math.round(pair.similarity * 100)}%</Label>
                            </div>
                            {pair.similarity && (
                                <Progress value={pair.similarity * 100}/>
                            )}
                        </div>
                    }
                    {file1Content && file2Content ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center gap-2">
                                    <p className="font-mono text-xs">{pair.file1?.filepath}</p>
                                    <Badge variant='secondary'>
                                        {pair.file1.repository.name}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <CodeViewer code={file1Content} language={pair.file1?.language}
                                                highlightRange={pair.file1?.fragments} color={"#4d4d4d"}
                                                shouldScrollY={true}/>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center gap-2">
                                    <p className="font-mono text-xs">{pair.file2?.filepath}</p>
                                    <Badge variant='secondary'>
                                        {pair.file2.repository.name}
                                    </Badge>
                                </div>
                                {loading ? (
                                    <div className="h-48 flex items-center justify-center">
                                        <Spinner size="lg"/>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <CodeViewer code={file2Content} language={pair.file2?.language}
                                                    highlightRange={pair.file2?.fragments} color={"#4d4d4d"}
                                                    shouldScrollY={true}/>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center">
                            <Spinner size="lg"/>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}