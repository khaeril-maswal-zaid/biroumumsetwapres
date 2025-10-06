import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PermissionsLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="mt-2 h-4 w-64" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex space-x-1">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <div className="flex flex-wrap gap-1">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-18" />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-8 flex-1" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
