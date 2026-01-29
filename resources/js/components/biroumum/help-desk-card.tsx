import { Card, CardContent } from '@/components/ui/card';
import { Headphones } from 'lucide-react';

export function HelpDeskCard() {
    return (
        <Card className="border-yellow-200 bg-yellow-100 shadow-md">
            <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-200">
                        <Headphones className="h-6 w-6 text-yellow-700" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">Help Desk Biro Umum</h3>
                        <p className="text-sm text-gray-600">+62 852-5078-3626</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
