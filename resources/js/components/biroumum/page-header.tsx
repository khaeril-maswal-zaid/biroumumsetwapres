'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    backUrl: string;
}

export function PageHeader({ title, backUrl }: PageHeaderProps) {
    return (
        <div className="flex items-center space-x-4">
            <Link href={backUrl}>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <h1 className="text-xl font-bold">{title}</h1>
        </div>
    );
}
