"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { CarFilterControls } from "./filter-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CarFilters = ({ filters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter values from searchParams
  const currentMake = searchParams.get("make") || "";
  const currentBodyType = searchParams.get("bodyType") || "";
  const currentFuelType = searchParams.get("fuelType") || "";
  const currentTransmission = searchParams.get("transmission") || "";
  const currentMinPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice"))
    : filters.priceRange.min;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice"))
    : filters.priceRange.max;
  const currentSortBy = searchParams.get("sortBy") || "newest";

  // Local state for filters
  const [make, setMake] = useState(currentMake);
  const [bodyType, setBodyType] = useState(currentBodyType);
  const [fuelType, setFuelType] = useState(currentFuelType);
  const [transmission, setTransmission] = useState(currentTransmission);
  const [priceRange, setPriceRange] = useState([
    currentMinPrice,
    currentMaxPrice,
  ]);
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Update local state when URL parameters change
  useEffect(() => {
    setMake(currentMake);
    setBodyType(currentBodyType);
    setFuelType(currentFuelType);
    setTransmission(currentTransmission);
    setPriceRange([currentMinPrice, currentMaxPrice]);
    setSortBy(currentSortBy);
  }, [
    currentMake,
    currentBodyType,
    currentFuelType,
    currentTransmission,
    currentMinPrice,
    currentMaxPrice,
    currentSortBy,
  ]);

  // Count active filters
  const activeFilterCount = [
    make,
    bodyType,
    fuelType,
    transmission,
    currentMinPrice > filters.priceRange.min ||
      currentMaxPrice < filters.priceRange.max,
  ].filter(Boolean).length;

  // Update URL when filters change
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (make) params.set("make", make);
    if (bodyType) params.set("bodyType", bodyType);
    if (fuelType) params.set("fuelType", fuelType);
    if (transmission) params.set("transmission", transmission);
    if (priceRange[0] > filters.priceRange.min)
      params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < filters.priceRange.max)
      params.set("maxPrice", priceRange[1].toString());
    if (sortBy !== "newest") params.set("sortBy", sortBy);

    // Preserve search and page params if they exist
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    if (search) params.set("search", search);
    if (page && page !== "1") params.set("page", page);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
    setIsSheetOpen(false);
  }, [
    make,
    bodyType,
    fuelType,
    transmission,
    priceRange,
    sortBy,
    pathname,
    searchParams,
    filters.priceRange.min,
    filters.priceRange.max,
  ]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case "make":
        setMake(value);
        break;
      case "bodyType":
        setBodyType(value);
        break;
      case "fuelType":
        setFuelType(value);
        break;
      case "transmission":
        setTransmission(value);
        break;
      case "priceRange":
        setPriceRange(value);
        break;
    }
  };

  // Handle clearing specific filter
  const handleClearFilter = (filterName) => {
    handleFilterChange(filterName, "");
  };

  // Clear all filters
  const clearFilters = () => {
    setMake("");
    setBodyType("");
    setFuelType("");
    setTransmission("");
    setPriceRange([filters.priceRange.min, filters.priceRange.max]);
    setSortBy("newest");

    // Keep search term if exists
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
    setIsSheetOpen(false);
  };

  // Current filters object for the controls component
  const currentFilters = {
    make,
    bodyType,
    fuelType,
    transmission,
    priceRange,
    priceRangeMin: filters.priceRange.min,
    priceRangeMax: filters.priceRange.max,
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-accent/25 bg-card/90 shadow-sm p-4 lg:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm font-medium text-foreground">
            <span className="inline-flex items-center gap-2">
              <Sliders className="h-4 w-4 text-accent" />
              Filtros
            </span>
            {activeFilterCount > 0 && (
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-accent/20 text-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setTimeout(() => applyFilters(), 0);
              }}
            >
              <SelectTrigger className="w-[180px] lg:w-48 border-accent/40 bg-background/80 text-foreground">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "newest", label: "Más recientes" },
                  { value: "priceAsc", label: "Precio: menor a mayor" },
                  { value: "priceDesc", label: "Precio: mayor a menor" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={clearFilters}
              >
                <X className="mr-1 h-3 w-3" />
                Limpiar todo
              </Button>
            )}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Ajustar filtros
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[90vh] overflow-y-auto rounded-t-3xl bg-card/95"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-lg">
                    Filtros disponibles
                  </SheetTitle>
                </SheetHeader>

                <div className="py-6">
                  <CarFilterControls
                    filters={filters}
                    currentFilters={currentFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilter={handleClearFilter}
                  />
                </div>

                <SheetFooter className="sm:justify-between flex-row pt-3 border-t border-accent/20 space-x-4 mt-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1"
                  >
                    Restablecer
                  </Button>
                  <Button
                    type="button"
                    onClick={applyFilters}
                    className="flex-1"
                  >
                    Ver resultados
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="hidden lg:block">
          <CarFilterControls
            filters={filters}
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
            onClearFilter={handleClearFilter}
          />
          <div className="flex justify-end gap-3 pt-6 border-t border-accent/20 mt-6">
            <Button variant="outline" onClick={clearFilters}>
              Restablecer
            </Button>
            <Button onClick={applyFilters}>Aplicar filtros</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
