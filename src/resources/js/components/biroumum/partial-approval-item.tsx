'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface PartialApprovalListProps {
    item: any;
    /** called when the "additional" value changes (number) */
    onAdditionalChange?: (value: number) => void;
    currentApproved?: number;
    currentAdditional?: number;
}

export function PartialApprovalList({ item, onAdditionalChange, currentApproved, currentAdditional }: PartialApprovalListProps) {
    const approvedValue = typeof currentApproved === 'number' ? currentApproved : (item.approved ?? 0);
    const additionalValue = typeof currentAdditional === 'number' ? currentAdditional : 0;
    const remaining = Math.max(0, (item.requested ?? 0) - approvedValue);
    const percentage = item.requested > 0 ? ((approvedValue + additionalValue) / item.requested) * 100 : 0;

    return (
        <div className="space-y-3">
            {/* First Approval */}
            <div className={`rounded-lg border border-blue-200 bg-blue-50 p-4`}>
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
                    </div>

                    {/* Input Area */}
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <Label htmlFor={`approval-qty-${0}`} className="mb-1 text-sm font-medium">
                                Tambahan yang akan diberikan:
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id={`approval-qty-${0}`}
                                    type=""
                                    min={0}
                                    max={remaining}
                                    value={additionalValue}
                                    onChange={(e) => {
                                        const parsed = Number.parseInt(e.target.value) || 0;
                                        const value = Math.max(0, Math.min(parsed, remaining));
                                        onAdditionalChange && onAdditionalChange(value);
                                    }}
                                    className="mt-1 w-24"
                                />
                                <span className="text-sm whitespace-nowrap text-gray-500">{item.satuan}</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-600">
                                <strong className="text-sm">Telah disetujui:</strong> {approvedValue} {item.satuan}
                                {' • '}
                                <strong className="text-sm">Maks tambahan:</strong> {remaining} {item.satuan}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {approvedValue + additionalValue > 0 && (
                        <div>
                            <Progress value={Math.min(percentage, 100)} className="h-2" />
                            <p className="mt-1 text-xs text-gray-500">{Math.round(percentage)}% dari yang diminta</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
