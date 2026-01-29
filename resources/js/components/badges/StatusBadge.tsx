import { Badge } from '@/components/ui/badge';

type Status = 'pending' | 'approved' | 'booked' | 'confirmed' | 'partial' | 'process' | 'cancelled' | 'rejected';

interface StatusBadgeProps {
    status: Status | string;
    isRead?: boolean;
}

const STATUS_BADGE_CONFIG: Record<
    Status,
    {
        label: string;
        className: string | ((props: StatusBadgeProps) => string);
    }
> = {
    pending: {
        label: 'Menunggu',
        className: ({ isRead }) =>
            isRead ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-yellow-300 text-yellow-800 hover:bg-yellow-300',
    },
    approved: {
        label: 'Disetujui',
        className: 'bg-green-100 text-green-800 hover:bg-green-200',
    },
    booked: {
        label: 'Dipesan',
        className: 'bg-green-100 text-green-800 hover:bg-green-200',
    },
    confirmed: {
        label: 'Selesai',
        className: 'bg-green-100 text-green-800 hover:bg-green-200',
    },
    partial: {
        label: 'Disetujui Sebagian',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    },
    process: {
        label: 'Diproses',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    },
    cancelled: {
        label: 'Ditolak',
        className: 'bg-red-100 text-red-800 hover:bg-red-200',
    },
    rejected: {
        label: 'Ditolak',
        className: 'bg-red-100 text-red-800 hover:bg-red-200',
    },
};

export function StatusBadge({ status, isRead }: StatusBadgeProps) {
    const config = STATUS_BADGE_CONFIG[status as Status];

    if (!config) {
        return <Badge variant="outline">Unknown</Badge>;
    }

    const className = typeof config.className === 'function' ? config.className({ status, isRead }) : config.className;

    return <Badge className={className}>{config.label}</Badge>;
}
