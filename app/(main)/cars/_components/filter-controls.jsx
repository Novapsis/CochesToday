"use client";

import { Check, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export const CarFilterControls = ({
  filters,
  currentFilters,
  onFilterChange,
  onClearFilter,
}) => {
  const { make, bodyType, fuelType, transmission, priceRange } = currentFilters;

  const filterSections = [
    {
      id: "make",
      title: "Marca",
      options: filters.makes.map((m) => ({ value: m.id, label: m.name })),
      currentValue: make,
      onChange: (value) => onFilterChange("make", value),
    },
    {
      id: "bodyType",
      title: "Carrocería",
      options: filters.bodyTypes.map((type) => ({ value: type, label: type })),
      currentValue: bodyType,
      onChange: (value) => onFilterChange("bodyType", value),
    },
    {
      id: "fuelType",
      title: "Combustible",
      options: filters.fuelTypes.map((type) => ({ value: type, label: type })),
      currentValue: fuelType,
      onChange: (value) => onFilterChange("fuelType", value),
    },
    {
      id: "transmission",
      title: "Transmisión",
      options: filters.transmissions.map((type) => ({
        value: type,
        label: type,
      })),
      currentValue: transmission,
      onChange: (value) => onFilterChange("transmission", value),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Rango de precio</h3>
        <div className="px-2">
          <Slider
            min={filters.priceRange.min}
            max={filters.priceRange.max}
            step={100}
            value={priceRange}
            onValueChange={(value) => onFilterChange("priceRange", value)}
          />
        </div>
        <div className="flex items-center justify-between text-sm font-medium text-foreground/80">
          <div>€ {priceRange[0]}</div>
          <div>€ {priceRange[1]}</div>
        </div>
      </div>

      {/* Filter Categories */}
      {filterSections.map((section) => (
        <div key={section.id} className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex justify-between">
            <span>{section.title}</span>
            {section.currentValue && (
              <button
                className="text-xs text-foreground/60 flex items-center hover:text-foreground"
                onClick={() => onClearFilter(section.id)}
              >
                <X className="mr-1 h-3 w-3" />
                Quitar
              </button>
            )}
          </h4>
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {section.options.map((option) => (
              <Badge
                key={option.value}
                variant={
                  section.currentValue === option.value ? "default" : "outline"
                }
                className={`cursor-pointer px-3 py-1 transition-colors ${
                  section.currentValue === option.value
                    ? "bg-accent/20 text-foreground border-accent/40"
                    : "bg-background border-accent/25 text-foreground/70 hover:border-accent/40"
                }`}
                onClick={() => {
                  section.onChange(
                    section.currentValue === option.value ? "" : option.value
                  );
                }}
              >
                {option.label}
                {section.currentValue === option.value && (
                  <Check className="ml-1 h-3 w-3 inline" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
