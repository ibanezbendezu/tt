import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {File} from '@/app/(main)/(routes)/clusters/[id]/graph/_components/file';
import {Badge} from '../../../../../../../components/ui/badge';

interface FileDialogProps {
    children?: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    file?: any;
    graphData?: any;
}

export function FileDialog({isOpen, setIsOpen, file, graphData}: FileDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-7xl">
                {file &&
                    <DialogHeader className="border-b pb-3 items-center">
                        <DialogTitle>{file.filepath}</DialogTitle>
                        <DialogDescription>
                            <div className='flex gap-2 mt-1'>
                                <Badge variant='secondary'>
                                    {file["repository"].name}
                                </Badge>
                                <Badge variant='secondary'>
                                    {file["repository"].owner}
                                </Badge>
                                <Badge variant='secondary'>
                                    {file.type}
                                </Badge>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                }

                {graphData &&
                    <div className="h-[30rem] flex flex-col dark:bg-secondary/10 rounded-md">
                        <File data={graphData}/>
                    </div>
                }

            </DialogContent>
        </Dialog>
    );
}
