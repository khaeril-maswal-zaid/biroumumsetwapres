import { Card, CardContent } from '@/components/ui/card';
import { Headphones } from 'lucide-react';

export function HelpDeskCard({ mainServices }: any) {
    return (
        <Card className="border-yellow-200 bg-yellow-100 shadow-md">
            <CardContent className="">
                <div className="flex items-center space-x-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-200">
                        <Headphones className="h-6 w-6 text-yellow-700" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{mainServices?.name}</h3>
                        <p className="text-sm text-gray-600">{mainServices?.contact}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
