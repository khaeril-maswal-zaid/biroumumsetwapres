// 'use client';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import AppLayout from '@/layouts/app-layout';
// import { BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';
// import { Building, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Mail, Search } from 'lucide-react';
// import { useMemo, useState } from 'react';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//     },
// ];

// export default function UsersAdmin({ users }: any) {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [roleFilter, setRoleFilter] = useState('all');
//     const [selectedUser, setSelectedUser] = useState<any>(null);
//     const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(10);

//     const handleActivateUser = async (userId: string) => {
//         setIsProcessing(true);
//         // Simulasi API call
//         setTimeout(() => {
//             console.log(`User ${userId} activated`);
//             setIsProcessing(false);
//             setIsDetailsOpen(false);
//             // Di aplikasi nyata, ini akan update data dari server
//         }, 1000);
//     };

//     const handleDeactivateUser = async (userId: string) => {
//         setIsProcessing(true);
//         // Simulasi API call
//         setTimeout(() => {
//             console.log(`User ${userId} deactivated`);
//             setIsProcessing(false);
//             setIsDetailsOpen(false);
//             // Di aplikasi nyata, ini akan update data dari server
//         }, 1000);
//     };

//     // Filter users based on search term, status, and nip
//     const filteredUsers = users.data.filter((user) => {
//         const matchesSearch =
//             user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.unit_kerja.toLowerCase().includes(searchTerm.toLowerCase());
//         return matchesSearch;
//     });

//     const handleViewDetails = (user: any) => {
//         setSelectedUser(user);
//         setIsDetailsOpen(true);
//     };

//     //----------- PAGINATE ------------------

//     const totalItems = users.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

//     const paginatedItems = useMemo(() => {
//         return filteredUsers.slice(startIndex, endIndex);
//     }, [filteredUsers, startIndex, endIndex]);

//     const handleItemsPerPageChange = (value: string) => {
//         setItemsPerPage(Number(value));
//         setCurrentPage(1);
//     };

//     const goToFirstPage = () => setCurrentPage(1);
//     const goToLastPage = () => setCurrentPage(totalPages);
//     const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//     const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//     // Generate page numbers to display
//     const getPageNumbers = () => {
//         const pages: (number | string)[] = [];
//         const maxVisiblePages = 5;

//         if (totalPages <= maxVisiblePages) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pages.push(i);
//             }
//         } else {
//             if (currentPage <= 3) {
//                 for (let i = 1; i <= 4; i++) pages.push(i);
//                 pages.push('...');
//                 pages.push(totalPages);
//             } else if (currentPage >= totalPages - 2) {
//                 pages.push(1);
//                 pages.push('...');
//                 for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
//             } else {
//                 pages.push(1);
//                 pages.push('...');
//                 for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
//                 pages.push('...');
//                 pages.push(totalPages);
//             }
//         }
//         return pages;
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Dashboard" />
//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 <div>
//                     <h1 className="text-lg font-bold tracking-tight">Manajemen PenggunaX</h1>
//                     <p className="text-sm text-gray-500">Kelola semua pengguna sistem Biro Umum.</p>
//                 </div>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Daftar Pengguna</CardTitle>
//                         <CardDescription>Semua pengguna yang terdaftar dalam sistem.</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                             <div className="flex w-full max-w-sm items-center space-x-2">
//                                 <Search className="h-4 w-4 text-gray-400" />
//                                 <Input
//                                     placeholder="Cari nama, email, atau divisi..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full"
//                                 />
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                                     <SelectTrigger className="w-[140px]">
//                                         <SelectValue placeholder="Status" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="all">Semua Status</SelectItem>
//                                         <SelectItem value="active">Aktif</SelectItem>
//                                         <SelectItem value="inactive">Tidak Aktif</SelectItem>
//                                         <SelectItem value="suspended">Suspended</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                                 <Select value={roleFilter} onValueChange={setRoleFilter}>
//                                     <SelectTrigger className="w-[140px]">
//                                         <SelectValue placeholder="Role" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="all">Semua Role</SelectItem>
//                                         <SelectItem value="Manager">Manager</SelectItem>
//                                         <SelectItem value="Supervisor">Supervisor</SelectItem>
//                                         <SelectItem value="Staff">Staff</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         <div className="rounded-md border">
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>Pengguna</TableHead>
//                                         <TableHead className="hidden md:table-cell">Divisi</TableHead>
//                                         <TableHead className="hidden lg:table-cell">Role</TableHead>
//                                         <TableHead className="text-right">Aksi</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {paginatedItems.length === 0 ? (
//                                         <TableRow>
//                                             <TableCell colSpan={6} className="py-4 text-center text-gray-500">
//                                                 Tidak ada pengguna yang ditemukan
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : (
//                                         paginatedItems.map((user) => (
//                                             <TableRow key={user.id}>
//                                                 <TableCell>
//                                                     <div className="flex items-center gap-3">
//                                                         <Avatar className="h-8 w-8">
//                                                             <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
//                                                             <AvatarFallback>
//                                                                 {user.name
//                                                                     .split(' ')
//                                                                     .map((n) => n[0])
//                                                                     .join('')}
//                                                             </AvatarFallback>
//                                                         </Avatar>
//                                                         <div>
//                                                             <div className="font-medium">{user.name}</div>
//                                                             <div className="text-sm text-gray-500">{user.email}</div>
//                                                         </div>
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell className="hidden md:table-cell">{user.unit_kerja}</TableCell>
//                                                 <TableCell className="hidden lg:table-cell">{user.nip}XX</TableCell>
//                                                 <TableCell className="text-right">
//                                                     <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
//                                                         Detail
//                                                     </Button>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </div>

//                         {/* Pagination */}
//                         {totalItems > 0 && (
//                             <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                                 {/* Left: Items per page selector & info */}
//                                 <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-muted-foreground">Tampilkan</span>
//                                         <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
//                                             <SelectTrigger className="h-8 w-[70px]">
//                                                 <SelectValue />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="5">5</SelectItem>
//                                                 <SelectItem value="10">10</SelectItem>
//                                                 <SelectItem value="20">20</SelectItem>
//                                                 <SelectItem value="50">50</SelectItem>
//                                                 <SelectItem value="100">100</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                         <span className="text-sm text-muted-foreground">data</span>
//                                     </div>
//                                     <div className="text-sm text-muted-foreground">
//                                         Menampilkan <span className="font-medium text-foreground">{startIndex + 1}</span> -{' '}
//                                         <span className="font-medium text-foreground">{endIndex}</span> dari{' '}
//                                         <span className="font-medium text-foreground">{totalItems}</span> data
//                                     </div>
//                                 </div>

//                                 {/* Right: Pagination controls */}
//                                 <div className="flex items-center gap-1">
//                                     {/* First Page */}
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         className="h-8 w-8 bg-transparent"
//                                         onClick={goToFirstPage}
//                                         disabled={currentPage === 1}
//                                     >
//                                         <ChevronsLeft className="h-4 w-4" />
//                                         <span className="sr-only">Halaman pertama</span>
//                                     </Button>

//                                     {/* Previous Page */}
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         className="h-8 w-8 bg-transparent"
//                                         onClick={goToPreviousPage}
//                                         disabled={currentPage === 1}
//                                     >
//                                         <ChevronLeft className="h-4 w-4" />
//                                         <span className="sr-only">Halaman sebelumnya</span>
//                                     </Button>

//                                     {/* Page Numbers */}
//                                     <div className="flex items-center gap-1">
//                                         {getPageNumbers().map((page, index) =>
//                                             page === '...' ? (
//                                                 <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
//                                                     ...
//                                                 </span>
//                                             ) : (
//                                                 <Button
//                                                     key={page}
//                                                     variant={currentPage === page ? 'default' : 'outline'}
//                                                     size="icon"
//                                                     className="h-8 w-8"
//                                                     onClick={() => setCurrentPage(page as number)}
//                                                 >
//                                                     {page}
//                                                 </Button>
//                                             ),
//                                         )}
//                                     </div>

//                                     {/* Next Page */}
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         className="h-8 w-8 bg-transparent"
//                                         onClick={goToNextPage}
//                                         disabled={currentPage === totalPages}
//                                     >
//                                         <ChevronRight className="h-4 w-4" />
//                                         <span className="sr-only">Halaman selanjutnya</span>
//                                     </Button>

//                                     {/* Last Page */}
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         className="h-8 w-8 bg-transparent"
//                                         onClick={goToLastPage}
//                                         disabled={currentPage === totalPages}
//                                     >
//                                         <ChevronsRight className="h-4 w-4" />
//                                         <span className="sr-only">Halaman terakhir</span>
//                                     </Button>
//                                 </div>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 {/* User Details Dialog */}
//                 <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
//                     <DialogContent className="sm:max-w-lg">
//                         <DialogHeader>
//                             <DialogTitle>Detail Pengguna</DialogTitle>
//                             <DialogDescription>Informasi lengkap tentang pengguna.</DialogDescription>
//                         </DialogHeader>
//                         {selectedUser && (
//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-4">
//                                     <Avatar className="h-16 w-16">
//                                         <AvatarImage src={selectedUser.avatar || '/placeholder.svg'} alt={selectedUser.name} />
//                                         <AvatarFallback className="text-lg">
//                                             {selectedUser.name
//                                                 .split(' ')
//                                                 .map((n: string) => n[0])
//                                                 .join('')}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                     <div>
//                                         <h3 className="text-lg font-medium">{selectedUser.name}</h3>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-3">
//                                     <div className="flex items-center gap-2">
//                                         <Mail className="h-4 w-4 text-gray-500" />
//                                         <p className="text-sm">{selectedUser.email}</p>
//                                     </div>

//                                     <div className="flex items-center gap-2">
//                                         <Building className="h-4 w-4 text-gray-500" />
//                                         <p className="text-sm">{selectedUser.unit_kerja}</p>
//                                     </div>

//                                     <div className="flex items-center gap-2">
//                                         <p className="text-sm">NIP: {selectedUser.nip}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                         <DialogFooter className="flex justify-between sm:justify-between">
//                             <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
//                                 Tutup
//                             </Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             </div>
//         </AppLayout>
//     );
// }
