import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface ComboboxProps {
  options: { id: number; name: string }[];
  selected: number | null;
  onSelect: (value: number | null) => void;
  placeholder?: string;
}

export function Combobox({
  options,
  selected,
  onSelect,
  placeholder = "Select a category",
}: ComboboxProps) {
  const selectedOption = options.find((opt) => opt.id === selected);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded="false"
          className="w-full justify-between text-muted-foreground font-normal"
        >
          {selectedOption ? selectedOption.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.id}
                onSelect={() => {
                  onSelect(opt.id);
                }}
                className="flex items-center"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected === opt.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {opt.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
