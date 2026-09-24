"use client";

import { LoaderCircle, Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isSearching?: boolean;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder,
  isSearching = false,
  className,
}: SearchInputProps) {
  return (
    <InputGroup className={cn("w-full sm:w-72", className)}>
      <InputGroupAddon>
        <Search aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {isSearching && (
        <InputGroupAddon align="inline-end">
          <LoaderCircle className="animate-spin" aria-label="Buscando" />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
