import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleOff, Frown, Meh, Smile } from "lucide-react";

export const CustomAlert = ({ option }: { option: number }) => {
    console.log("alert", option);
    switch (option) {
        case 1:
            return (
                <Alert variant="destructive">
                    <CircleOff className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Por favor, selecciona un grupo antes de confirmar.
                    </AlertDescription>
                </Alert>
            );
        case 2:
            return (
                <Alert variant="destructive">
                    <Frown className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        No se pueden añadir los repositorios seleccionados. Ya están en el grupo.
                        {/* This is a success alert — <strong>check it out!</strong> */}
                    </AlertDescription>
                </Alert>
            );
        case 3:
            return (
                <Alert variant="warning">
                    <Meh className="h-4 w-4" />
                    <AlertTitle>Aviso</AlertTitle>
                    <AlertDescription>
                        Solo se añadirán los repositorios que no están dentro del cluster seleccionado.
                    </AlertDescription>
                </Alert>
            );
        case 4:
            return (
                <Alert variant="success">
                    <Smile className="h-4 w-4" />
                    <AlertTitle>Aviso</AlertTitle>
                    <AlertDescription>
                        Se añadirán todos los repositorios seleccionados.
                    </AlertDescription>
                </Alert>
            );
        default:
            return (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    This is an error alert — <strong>check it out!</strong>
                </Alert>
            );
    }
}
