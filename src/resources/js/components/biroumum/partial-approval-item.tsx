'use client';

import { ItemCombobox } from '@/components/biroumum/item-combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

import { X } from 'lucide-react';
import { useState } from 'react';

interface PartialApprovalItemProps {
    item: any;
    approvalIndex: number;
    approvedValue: number;
    onApprovedChange: (value: number) => void;
    onRemove: () => void;
    maxAllowed: number;
    availableItems: any[];
}

export function PartialApprovalItem({
    item,
    approvalIndex,
    approvedValue,
    onApprovedChange,
    onRemove,
    maxAllowed,
    availableItems,
}: PartialApprovalItemProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [adminMessage, setAdminMessage] = useState('');
    const [actionType, setActionType] = useState<'confirmed' | 'reject' | null>(null);
    const [approvedQuantities, setApprovedQuantities] = useState<{ [key: string]: number }>({});
    const [itemReplacements, setItemReplacements] = useState<{ [itemId: string]: string }>({});

    const [partialApprovals, setPartialApprovals] = useState<{
        [itemId: string]: {
            firstApproved: number;
            additionalApprovals: Array<{ approved: number; itemId?: string }>;
            isExpanded: boolean;
        };
    }>({});

    const [newRequestsFromUnavailable, setNewRequestsFromUnavailable] = useState<
        Array<{
            originalItemId: string;
            id: string;
            name: string;
            satuan: string;
            requested: number;
        }>
    >([]);

    const handleSelectAtkForUnavailable = (originalItemId: string, newAtkId: string, originalItem: any) => {
        const selectedAtk = availableItems.find((atk: any) => atk.id == newAtkId);
        if (!selectedAtk) return;

        // Add to new requests
        setNewRequestsFromUnavailable((prev) => {
            const existingIndex = prev.findIndex((req) => req.originalItemId == originalItemId);

            if (existingIndex >= 0) {
                // Replace existing
                const updated = [...prev];
                updated[existingIndex] = {
                    originalItemId,
                    id: selectedAtk.id,
                    name: selectedAtk.name,
                    satuan: originalItem.satuan,
                    requested: originalItem.requested,
                };
                return updated;
            } else {
                // Add new
                return [
                    ...prev,
                    {
                        originalItemId,
                        id: selectedAtk.id,
                        name: selectedAtk.name,
                        satuan: originalItem.satuan,
                        requested: originalItem.requested,
                    },
                ];
            }
        });

        // Set original item approved to 0
        setApprovedQuantities((prev) => ({
            ...prev,
            [originalItemId]: 0,
        }));
    };

    const percentage = item.requested > 0 ? (approvedValue / item.requested) * 100 : 0;
    const isFirstApproval = approvalIndex == 0;

    return (
        <div className={`rounded-lg border p-4 ${isFirstApproval ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                        </div>
                        <div className="text-sm text-gray-600">
                            Diminta: {item.requested} {item.satuan}
                        </div>
                    </div>
                    {!isFirstApproval && (
                        <Button variant="ghost" size="sm" onClick={onRemove} className="h-6 w-6 p-0 text-red-600 hover:bg-red-100 hover:text-red-700">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="my-0">
                    <Label className="text-sm font-medium text-amber-900">⚠️ ATK tidak ditemukan di daftar. Silahkan pilih ATK yang ada:</Label>
                    <div className="mt-2 bg-gray-50">
                        <ItemCombobox
                            items={availableItems.map((i: any) => ({
                                id: String(i.id),
                                name: i.name,
                                category: i.category,
                                kode_atk: i.kode_atk,
                                satuan: i.satuan,
                            }))}
                            value={itemReplacements[item.id] || null}
                            onSelect={(value) => {
                                setItemReplacements((prev) => ({
                                    ...prev,
                                    [item.id]: value || '',
                                }));

                                if (value) {
                                    // panggil helper untuk menambahkan ke newRequestsFromUnavailable & set approved original = 0
                                    handleSelectAtkForUnavailable(item.id, value, item);
                                } else {
                                    // jika clear selection: hapus dari newRequestsFromUnavailable
                                    setNewRequestsFromUnavailable((prev) => prev.filter((r) => r.originalItemId !== item.id));
                                    setApprovedQuantities((prev) => ({
                                        ...prev,
                                        [item.id]: 0,
                                    }));
                                }
                            }}
                            kodeAtk={() => {}}
                        />
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex items-end gap-3">
                    <div className="flex-1">
                        <Label htmlFor={`approval-qty-${approvalIndex}`} className="mb-1 text-sm font-medium">
                            Disetujui:
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id={`approval-qty-${approvalIndex}`}
                                type="number"
                                min="0"
                                max={maxAllowed}
                                value={approvedValue || ''}
                                onChange={(e) => {
                                    const value = Math.max(0, Math.min(Number.parseInt(e.target.value) || 0, maxAllowed));
                                    onApprovedChange(value);
                                }}
                                className="mt-1 w-24"
                            />
                            <span className="text-sm whitespace-nowrap text-gray-500">{item.satuan}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">
                            Maks: {maxAllowed} {item.satuan}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                {approvedValue > 0 && (
                    <div>
                        <Progress value={Math.min(percentage, 100)} className="h-2" />
                        <p className="mt-1 text-xs text-gray-500">{Math.round(percentage)}% dari yang diminta</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface PartialApprovalListProps {
    item: any;
    firstApproved: number;
    onFirstApprovedChange: (value: number) => void;
    availableItems: any[];
}

export function PartialApprovalList({ item, firstApproved, onFirstApprovedChange, availableItems }: PartialApprovalListProps) {
    console.log(item, firstApproved, onFirstApprovedChange, availableItems);

    return (
        <div className="space-y-3">
            {/* First Approval */}
            <PartialApprovalItem
                item={item}
                approvalIndex={0}
                approvedValue={firstApproved}
                onApprovedChange={onFirstApprovedChange}
                onRemove={() => {}}
                maxAllowed={item.requested}
                availableItems={availableItems}
            />
        </div>
    );
}
