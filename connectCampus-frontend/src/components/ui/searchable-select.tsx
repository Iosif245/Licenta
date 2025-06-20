import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@app/lib/utils';
import { Button } from '@app/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/ui/popover';

interface SearchableSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: Array<{ id: string; name: string; value?: string }>;
  className?: string;
  disabled?: boolean;
}

export const SearchableSelect = ({
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No option found.',
  options,
  className,
  disabled = false,
}: SearchableSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const selectedOption = options.find(option => (option.value || option.name) === value);

  const filteredOptions = options.filter(option => option.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (option: { id: string; name: string; value?: string }) => {
    const newValue = option.value || option.name;
    onValueChange?.(newValue === value ? '' : newValue);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between h-9 text-sm font-normal', !value && 'text-muted-foreground', className)}
          disabled={disabled}
        >
          <span className="truncate text-left">{selectedOption ? selectedOption.name : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <input
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="max-h-[300px] overflow-auto p-1">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm">{emptyMessage}</div>
          ) : (
            filteredOptions.map(option => (
              <div
                key={option.id}
                onClick={() => handleSelect(option)}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground gap-2"
              >
                <Check className={cn('h-4 w-4 shrink-0', (option.value || option.name) === value ? 'opacity-100' : 'opacity-0')} />
                <span className="truncate flex-1 text-left">{option.name}</span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
