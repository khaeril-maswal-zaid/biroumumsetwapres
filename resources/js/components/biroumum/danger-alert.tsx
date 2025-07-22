import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

type DangerAlertProps = {
    message: string | Errors;
    show: boolean;
};

export function DangerAlert({ message, show }: DangerAlertProps) {
    if (!show) return null;

    return (
        <Alert className="border-red-200 bg-red-50">
            <CheckCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
                {typeof message === 'string' ? (
                    message
                ) : (
                    <ul>
                        {Object.entries(message).map(([field, msg]) => (
                            <li key={field}>{msg}</li>
                        ))}
                    </ul>
                )}
            </AlertDescription>
        </Alert>
    );
}
