'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface Item {
    id: string;
    name: string;
    kode_atk: string;
    satuan: string;
    category: string;
}

interface ItemComboboxProps {
    items: Item[];
    value: string | null;
    onSelect: (value: string | null) => void;
    kodeAtk: (value: string | null) => void;
}

export function ItemCombobox({ items, value, onSelect, kodeAtk }: ItemComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const selectedItem = items.find((item) => item.id == value);
    const displayLabel = selectedItem ? `${selectedItem.name} (${selectedItem.kode_atk}) • ${selectedItem.satuan}` : 'Pilih Item...';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
                    <span className="truncate text-sm">{displayLabel}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari berdasarkan nama, kode, satuan..." value={query} onValueChange={(v) => setQuery(v)} />
                    <CommandEmpty>Tidak ada item ditemukan.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    onSelect(null);
                                    setOpen(false);
                                    setQuery('');
                                }}
                            >
                                <Check className={cn('mr-2 h-4 w-4', !value ? 'opacity-100' : 'opacity-0')} />
                                Semua Item
                            </CommandItem>
                            {(() => {
                                const q = query.toLowerCase().trim();
                                const filtered = q
                                    ? items.filter(
                                          (item) =>
                                              item.name.toLowerCase().includes(q) ||
                                              item.kode_atk.toLowerCase().includes(q) ||
                                              item.satuan.toLowerCase().includes(q) ||
                                              item.category.toLowerCase().includes(q),
                                      )
                                    : items;

                                return filtered.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        onSelect={() => {
                                            onSelect(String(item.id) == value ? null : String(item.id));
                                            setOpen(false);
                                            kodeAtk(item.kode_atk);
                                            setQuery('');
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', value == item.id ? 'opacity-100' : 'opacity-0')} />
                                        <div className="flex-1">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.kode_atk} • {item.category} • {item.satuan}
                                            </div>
                                        </div>
                                    </CommandItem>
                                ));
                            })()}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
