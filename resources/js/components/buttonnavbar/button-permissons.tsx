'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Permission {
    name: string;
    label: string;
    category: string;
}

export default function ButtonPermission({ availablePermissions }: any) {
    const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
    const [roleFormData, setRoleFormData] = useState({
        id: '',
        name: '',
        description: '',
        permissions: [] as string[],
    });

    const resetRoleForm = () => {
        setRoleFormData({
            id: '',
            name: '',
            description: '',
            permissions: [],
        });
    };

    const openAddRoleDialog = () => {
        resetRoleForm();
        setIsAddRoleDialogOpen(true);
    };

    const handleAddRole = () => {
        // Validate required fields
        if (!roleFormData.name || !roleFormData.description) {
            alert('Mohon lengkapi nama role dan deskripsi');
            return;
        }

        if (roleFormData.permissions.length === 0) {
            alert('Mohon pilih minimal satu permission');
            return;
        }

        const newRole = {
            name: roleFormData.name,
            description: roleFormData.description,
            permissions: roleFormData.permissions,
        };

        router.post(route('roles.store'), newRole, {
            onSuccess() {
                setIsAddRoleDialogOpen(false);
                resetRoleForm();
            },
            onError(e) {
                console.log(e);
            },
        });
    };

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        if (checked) {
            setRoleFormData((prev) => ({
                ...prev,
                permissions: [...prev.permissions, permissionId],
            }));
        } else {
            setRoleFormData((prev) => ({
                ...prev,
                permissions: prev.permissions.filter((p) => p !== permissionId),
            }));
        }
    };

    const groupedPermissions = availablePermissions.reduce(
        (acc: any, permission: Permission) => {
            if (!acc[permission.category]) {
                acc[permission.category] = [];
            }
            acc[permission.category].push(permission);
            return acc;
        },
        {} as Record<string, typeof availablePermissions>,
    );

    return (
        <>
            <Button onClick={openAddRoleDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Role
            </Button>
            {/* Add Role Dialog */}
            <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Role Baru</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role_name">Nama Role</Label>
                                <Input
                                    className="mt-1"
                                    id="role_name"
                                    value={roleFormData.name}
                                    onChange={(e) => setRoleFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Masukkan nama role"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role_description">Deskripsi</Label>
                                <Input
                                    className="mt-1"
                                    id="role_description"
                                    value={roleFormData.description}
                                    onChange={(e) => setRoleFormData((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Deskripsi role"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-1xl">Permissions:</Label>
                            {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                <div key={category} className="mt-2 space-y-2">
                                    <h4 className="text-sm font-medium text-gray-700">{category}</h4>
                                    <div className="grid grid-cols-2 gap-2 pl-4">
                                        {permissions.map((permission: Permission) => (
                                            <div key={permission.name} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={permission.name}
                                                    checked={roleFormData.permissions.includes(permission.name)}
                                                    onCheckedChange={(checked) => handlePermissionChange(permission.name, checked as boolean)}
                                                />
                                                <Label htmlFor={permission.name} className="text-sm">
                                                    {permission.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleAddRole}
                            disabled={!roleFormData.name || !roleFormData.description || roleFormData.permissions.length === 0}
                        >
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
