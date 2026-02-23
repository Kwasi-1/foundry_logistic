import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Loader2, Search, ChevronDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";

export interface AutoCompleteSelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface AutoCompleteSelectProps {
  options: AutoCompleteSelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  label?: string;
  labelPlacement?: "inside" | "outside";
  placeholder?: string;
  loading?: boolean;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  onCreateOption?: () => void;
  createOptionLabel?: string;
  error?: string;
  emptyMessage?: string;
  className?: string;
  triggerClassName?: string;
  hideChevron?: boolean;
  showHelperText?: boolean;
  doctype?: string;
  reference_doctype?: string;
  query?: string;
  filters?: any;
  disabled?: boolean;
}

export function FoundryAutoCompleteSelect({
  options,
  value,
  defaultValue = null,
  onChange,
  label = "Autocomplete",
  labelPlacement = "inside",
  placeholder = "Start typing...",
  loading = false,
  onSearchChange,
  showSearch = true,
  onCreateOption,
  createOptionLabel = "Create new option",
  error,
  emptyMessage = "No matches found",
  className,
  triggerClassName,
  hideChevron = false,
  showHelperText = true,
  doctype,
  reference_doctype,
  filters,
  query,
  disabled = false,
}: AutoCompleteSelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue,
  );

  const selectedValue = isControlled ? value! : internalValue;
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // const shouldFetch = Boolean(doctype && reference_doctype && open);
  const { data, isPending } = useQuery({
    queryKey: [
      "search-params",
      doctype,
      reference_doctype,
      filters,
      query,
      search,
    ],
    enabled: true,
    queryFn: async () => {
      const { data: Response } = await apiClient({
        url: variables().BUSINESS_API + "/core/misc/search",
        header: {
          Authorization:
           "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA2dzczNW1IdEZGcFNULXBtMTJNeSJ9.eyJ1c2VyX2luZm8iOnsiZW1haWwiOiJyYXNoaWRAYWNjZXNzODkuY29tIiwibmFtZSI6IlJhc2hpZCIsIm9pZCI6IkFDQ0VTUzg5Iiwib25hbWUiOiIiLCJyb2xlX2xpc3QiOltdLCJ1aWQiOiJhdXRoMHw2OTY4ZGNiOGNkYTE2N2M5NzNkZjRmMmYifSwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5mb3VuZHJ5LXBsYXRmb3JtLmFwcC8iLCJzdWIiOiJhdXRoMHw2OTY4ZGNiOGNkYTE2N2M5NzNkZjRmMmYiLCJhdWQiOlsiaHR0cHM6Ly9hcGkuYWNjZXNzODkuY29tIiwiaHR0cHM6Ly9hY2Nlc3M4OS1wcm9kLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3Njk1OTQ0NjUsImV4cCI6MTc2OTY4MDg2NSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF6cCI6IjZlNk9QUkFnamhiUWRJdndDOGc2SWs5UmhhZnBSSFhIIiwicGVybWlzc2lvbnMiOltdfQ.iQ9MqlGUdwGojWb9ZoHHiBVb43X5MOG6NSvi3N1tVj8WUc4U1dU9H2HaBGcB09iGp3K_R4kPLc7KelUJOifr2JDKjxecUuaz5jhquf5lp4MAjsOO0CrDcfWLaXBMp482fjcm7V3vd4XPZOJ6N3mhQEGDk8H0GFTO0Z6Hj_-fWSSsDED8uu_3ri_aPTqWJYQ20LdiVnjaJFiHxrAqBon3gdXF3KuFJz0KZmWBxa-xMDSnwht0iVhc2FIIrdLcYemCKGTBaYgsI_-Aem8O5x_ubLIELezPPggPd8-fdYDGYim_0CIFJGZFhIVQt32o30TyOx186yGN4uTV-CqXLIdl4w",
        },
        params: {
          filters: JSON.stringify(filters),
          doctype,
          reference_doctype,
          txt: String(search).trim(),
          query,
          page_length: 10,
        },
        method: "GET",
      });

      return Response?.data?.message;
    },
    // staleTime: 60_000,
  });

  const apiOptions = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => {
        const valueString = item?.value ? String(item.value) : "";
        return {
          value: valueString,
          label: valueString,
          description: item?.description ? String(item.description) : undefined,
        };
      })
      .filter((item) => item.value.length > 0);
  }, [data]);

  const mergedOptions = apiOptions.length > 0 ? apiOptions : options;
  const isLoading = loading || isPending;
  const selectedOption = mergedOptions.find(
    (opt) => opt.value === selectedValue,
  );
  const selectedLabel = selectedOption?.label ?? selectedValue ?? null;

  const filteredOptions = React.useMemo(() => {
    if (!showSearch || !search) return mergedOptions;
    return mergedOptions;
  }, [mergedOptions, search, showSearch]);

  const handleSelect = (option: AutoCompleteSelectOption) => {
    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    setSearch("");
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearch("");
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <div className={cn("flex w-full flex-col", className)}>
        {labelPlacement === "outside" && label && (
          <p
            className="mb-2 text-sm font-medium text-gray-900"
            style={{ letterSpacing: "-0.8px" }}
          >
            {label}
          </p>
        )}
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex min-h-[2.5rem] w-full items-center justify-between border border-input bg-background px-3 py-2 text-left text-sm focus:outline-none",
              error && "border-destructive",
              disabled && "cursor-not-allowed opacity-50",
              triggerClassName,
            )}
          >
            {labelPlacement !== "outside" ? (
              <div className="flex-1 text-left">
                <p
                  className="text-xs uppercase text-muted-foreground"
                  style={{ letterSpacing: "-0.8px" }}
                >
                  {label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm text-gray-900 truncate",
                    !selectedLabel && "text-muted-foreground",
                  )}
                >
                  {selectedLabel ?? placeholder}
                </p>
              </div>
            ) : (
              <span
                className={cn(
                  "text-sm text-gray-900 truncate",
                  !selectedLabel && "text-muted-foreground",
                )}
              >
                {selectedLabel ?? placeholder}
              </span>
            )}
            {!hideChevron &&
              (isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              ))}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="z-[60] w-[320px] bg-white p-4 shadow-2xl"
          >
            <div className="space-y-3">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      onSearchChange?.(event.target.value);
                    }}
                    className="flex h-10 w-full border border-input bg-background pl-9 pr-9 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                </div>
              )}

              <div className="max-h-64 space-y-1.5 overflow-y-auto custom-scrollbar">
                {isLoading && (
                  <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                )}
                {!isLoading && filteredOptions.length === 0 && (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    {emptyMessage}
                  </p>
                )}
                {!isLoading &&
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex w-full flex-col gap-1.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60",
                        option.value === selectedValue &&
                          "bg-primary/10 text-primary",
                      )}
                    >
                      <span className="font-semibold leading-none truncate">
                        {doctype != "Item" ? option.label : option.description}
                      </span>
                      {option.description && (
                        <span className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {doctype != "Item"
                            ? option.description
                            : option.label}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
              {onCreateOption && (
                <button
                  type="button"
                  onClick={() => {
                    onCreateOption();
                    setSearch("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-2 py-2 text-base font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  {createOptionLabel}
                </button>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
        {showHelperText && (
          <div className="min-h-[1.25rem]">
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
        )}
      </div>
    </Popover.Root>
  );
}
