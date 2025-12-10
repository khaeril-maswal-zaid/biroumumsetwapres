import { CheckCircle2, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useState } from 'react';

type KategoriKerusakan = {
    kode_kerusakan: string;
    name: string;
};

export function KategoriSelector({
    kategoriList,
    selectedValue,
    onSelect,
}: {
    kategoriList: KategoriKerusakan[];
    selectedValue: string;
    onSelect: (kode: string) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const selectedKategori = kategoriList.find((k) => k.kode_kerusakan === selectedValue);

    return (
        <div className="space-y-2">
            {/* Toggle button */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                    selectedKategori
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-dashed border-muted-foreground/30 bg-muted/20 hover:border-blue-400 hover:bg-blue-50/50'
                } `}
            >
                {selectedKategori ? (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-blue-700">{selectedKategori.name}</p>
                            <p className="text-xs text-muted-foreground">Kode kategori: {selectedKategori.kode_kerusakan}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        <span className="text-sm">Pilih kategori kerusakan...</span>
                    </div>
                )}
                {isExpanded ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </button>

            {/* Expandable list */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'} `}
            >
                <div className="max-h-[550px] space-y-2 overflow-y-auto pt-1 pr-1">
                    {kategoriList.map((item) => {
                        const isSelected = selectedValue === item.kode_kerusakan;
                        const hasSubKategori = item.sub_kategori && item.sub_kategori.filter((s) => s).length > 0;

                        return (
                            <div
                                key={item.kode_kerusakan}
                                onClick={() => {
                                    onSelect(item.kode_kerusakan);
                                    setIsExpanded(false);
                                }}
                                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                                    isSelected
                                        ? 'border-blue-400 bg-blue-50 ring-blue-300'
                                        : 'border-border bg-background hover:border-blue-300 hover:bg-blue-50/50'
                                } `}
                            >
                                {/* Selected indicator */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                    </div>
                                )}

                                {/* Category header */}
                                <div className="flex items-start gap-3 pr-8">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100'} `}
                                    >
                                        <Layers className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className={`text-base font-bold ${isSelected ? 'text-blue-700' : 'text-foreground'}`}>{item.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Kode: <span className="font-medium">{item.kode_kerusakan}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Sub categories */}
                                {hasSubKategori && (
                                    <div className="mt-3 pl-15">
                                        <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                            Yang Termasuk:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.sub_kategori
                                                .filter((s) => s)
                                                .map((sub, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`inline-flex items-center rounded-full ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-foreground'} px-2.5 py-1 text-xs font-medium`}
                                                    >
                                                        {sub}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Empty state for no sub categories */}
                                {!hasSubKategori && (
                                    <div className="mt-3 pl-15">
                                        <p className="text-xs text-muted-foreground/70 italic">Tidak ada sub-kategori</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
