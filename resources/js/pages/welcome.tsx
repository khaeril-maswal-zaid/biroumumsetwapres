import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';

const RoomScheduleCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterRoom, setFilterRoom] = useState('all');

    // Data dummy jadwal ruangan
    const roomSchedules = [
        {
            id: 1,
            room: 'Meeting A',
            start: '09:00',
            end: '11:00',
            date: '2025-07-31',
            color: 'bg-blue-100 text-blue-800',
        },
        {
            id: 2,
            room: 'Meeting B',
            start: '13:00',
            end: '15:00',
            date: '2025-07-31',
            color: 'bg-green-100 text-green-800',
        },
        {
            id: 3,
            room: 'Training',
            start: '08:00',
            end: '17:00',
            date: '2025-07-31',
            color: 'bg-purple-100 text-purple-800',
        },
        {
            id: 4,
            room: 'Meeting A',
            start: '14:00',
            end: '16:00',
            date: '2025-08-01',
            color: 'bg-blue-100 text-blue-800',
        },
        {
            id: 5,
            room: 'Seminar',
            start: '09:30',
            end: '12:00',
            date: '2025-08-02',
            color: 'bg-orange-100 text-orange-800',
        },
        {
            id: 6,
            room: 'Meeting B',
            start: '10:00',
            end: '11:30',
            date: '2025-08-01',
            color: 'bg-green-100 text-green-800',
        },
        {
            id: 7,
            room: 'Training',
            start: '15:00',
            end: '17:00',
            date: '2025-08-02',
            color: 'bg-purple-100 text-purple-800',
        },
    ];

    const rooms = ['Meeting A', 'Meeting B', 'Training', 'Seminar'];

    // Fungsi untuk mendapatkan nama bulan dalam bahasa Indonesia
    const getMonthName = (date) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[date.getMonth()];
    };

    // Fungsi untuk mendapatkan jadwal berdasarkan tanggal
    const getSchedulesByDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return roomSchedules.filter((schedule) => {
            const matchesDate = schedule.date === dateStr;
            const matchesRoom = filterRoom === 'all' || schedule.room === filterRoom;
            return matchesDate && matchesRoom;
        });
    };

    // Fungsi untuk navigasi bulan
    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    // Fungsi untuk mendapatkan tanggal dalam bulan
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const days = getDaysInMonth();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        Jadwal Penggunaan Ruangan
                    </h1>
                    <p className="mt-2 text-gray-600">Kelola dan pantau penggunaan ruangan dengan mudah</p>
                </div>

                {/* Kalender */}
                <div className="rounded-xl bg-white p-6 shadow-lg">
                    {/* Kontrol Kalender */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigateMonth(-1)} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <h2 className="text-xl font-semibold text-gray-900">
                                {getMonthName(currentDate)} {currentDate.getFullYear()}
                            </h2>

                            <button onClick={() => navigateMonth(1)} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Filter Ruangan */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select
                                value={filterRoom}
                                onChange={(e) => setFilterRoom(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Semua Ruangan</option>
                                {rooms.map((room) => (
                                    <option key={room} value={room}>
                                        {room}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Grid Kalender */}
                    <div className="mb-4 grid grid-cols-7 gap-2">
                        {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
                            <div key={day} className="rounded-lg bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, index) => {
                            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                            const isToday = day.toDateString() === new Date().toDateString();
                            const daySchedules = getSchedulesByDate(day);

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[120px] rounded-lg border p-2 transition-all duration-200 ${isCurrentMonth ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'} ${isToday ? 'bg-blue-50 ring-2 ring-blue-500' : ''} `}
                                >
                                    {/* Tanggal */}
                                    <div
                                        className={`mb-2 text-sm font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'font-bold text-blue-600' : ''} `}
                                    >
                                        {day.getDate()}
                                    </div>

                                    {/* Jadwal Ruangan */}
                                    <div className="space-y-1">
                                        {daySchedules.map((schedule) => (
                                            <div
                                                key={schedule.id}
                                                className={`truncate rounded-md px-2 py-1 text-xs font-medium ${schedule.color} `}
                                                title={`${schedule.room} (${schedule.start}-${schedule.end})`}
                                            >
                                                <div className="truncate">{schedule.room}</div>
                                                <div className="text-xs opacity-75">
                                                    {schedule.start}-{schedule.end}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Keterangan Ruangan</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-blue-100"></div>
                            <span className="text-sm text-gray-700">Meeting A</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-green-100"></div>
                            <span className="text-sm text-gray-700">Meeting B</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-purple-100"></div>
                            <span className="text-sm text-gray-700">Training</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-orange-100"></div>
                            <span className="text-sm text-gray-700">Seminar</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomScheduleCalendar;
