import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
    userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between bg-white p-4">
            <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userName} />
                    <AvatarFallback>
                        {userName
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm text-gray-600">Selamat datang</p>
                    <p className="font-semibold">{userName}</p>
                </div>
            </div>
            {/* <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-600" />
            </div> */}
        </div>
    );
}
