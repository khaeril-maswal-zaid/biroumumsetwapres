'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';

interface PartialApprovalItemProps {
    item: any;
    approvalIndex: number;
    approvedValue: number;
    onApprovedChange: (value: number) => void;
    onRemove: () => void;
    maxAllowed: number;
    availableItems: any[];
    onItemSelect?: (itemId: string) => void;
}

export function PartialApprovalItem({
    item,
    approvalIndex,
    approvedValue,
    onApprovedChange,
    onRemove,
    maxAllowed,
    availableItems,
    onItemSelect,
}: PartialApprovalItemProps) {
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
                            {/* <Badge
                                className={
                                    isFirstApproval ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                }
                            >
                                {approvalIndex == 0 ? 'Persetujuan 1' : `Persetujuan ${approvalIndex + 1}`}
                            </Badge> */}
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
                                className="w-24"
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
    additionalApprovals: Array<{ approved: number; itemId?: string }>;
    onFirstApprovedChange: (value: number) => void;
    onAdditionalApprovalChange: (index: number, value: number) => void;
    onRemoveAdditionalApproval: (index: number) => void;
    onAddApproval: () => void;
    availableItems: any[];
}

export function PartialApprovalList({
    item,
    firstApproved,
    additionalApprovals,
    onFirstApprovedChange,
    onAdditionalApprovalChange,
    onRemoveAdditionalApproval,
    onAddApproval,
    availableItems,
}: PartialApprovalListProps) {
    const totalApproved = firstApproved + additionalApprovals.reduce((sum, approval) => sum + approval.approved, 0);
    const remainingToApprove = item.requested - totalApproved;
    const canAddMoreApproval = remainingToApprove > 0;

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

            {/* Additional Approvals */}
            {additionalApprovals.map((approval, index) => (
                <PartialApprovalItem
                    key={`additional-${index}`}
                    item={item}
                    approvalIndex={index + 1}
                    approvedValue={approval.approved}
                    onApprovedChange={(value) => onAdditionalApprovalChange(index, value)}
                    onRemove={() => onRemoveAdditionalApproval(index)}
                    maxAllowed={remainingToApprove + approval.approved}
                    availableItems={availableItems}
                />
            ))}

            {/* Add More Approval Button */}
            {/* {canAddMoreApproval && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddApproval}
                    className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Persetujuan Lagi ({remainingToApprove} {item.satuan} tersisa)
                </Button>
            )} */}

            {/* Summary */}
            {additionalApprovals.length > 0 && (
                <div className="rounded-md bg-blue-100 p-3 text-sm text-blue-800">
                    <strong>Total Disetujui:</strong> {totalApproved} dari {item.requested} {item.satuan}
                </div>
            )}
        </div>
    );
}
