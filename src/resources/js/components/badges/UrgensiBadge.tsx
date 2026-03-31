import { Badge } from '@/components/ui/badge';

type Urgensi = 'rendah' | 'tinggi';

interface StatusBadgeProps {
    urgensi: Urgensi | string;
    isRead?: boolean;
}

const STATUS_BADGE_CONFIG: Record<
    Urgensi,
    {
        label: string;
        className: string | ((props: StatusBadgeProps) => string);
    }
> = {
    rendah: {
        label: 'Rendah',
        className: 'bg-green-100 text-green-800 hover:bg-green-200',
    },
    tinggi: {
        label: 'Tinggi',
        className: 'bg-red-100 text-red-800 hover:bg-red-200',
    },
};

export function UrgensiBadge({ urgensi, isRead }: StatusBadgeProps) {
    const config = STATUS_BADGE_CONFIG[urgensi as Urgensi];

    if (!config) {
        return <Badge variant="outline">Belum Ditentukan</Badge>;
    }

    const className = typeof config.className === 'function' ? config.className({ urgensi, isRead }) : config.className;

    return <Badge className={className}>{config.label}</Badge>;
}
