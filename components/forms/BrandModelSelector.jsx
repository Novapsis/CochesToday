"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBrandModel } from "./useBrandModel";

export default function BrandModelSelector({
  valueBrand = "",
  valueModel = "",
  onBrandChange,
  onModelChange,
  allowManual = true,
  compact = false,
}) {
  const bm = useBrandModel(valueBrand, valueModel);

  useEffect(() => {
    if (valueBrand && valueBrand !== bm.selectedBrand) bm.handleBrandChange(valueBrand);
    if (valueModel && valueModel !== bm.selectedModel) bm.handleModelChange(valueModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueBrand, valueModel]);

  return (
    <div className={`grid ${compact ? "grid-cols-1 gap-3" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
      <div>
        <div className="flex items-center justify-between">
          <Label>Marca</Label>
          {allowManual && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs font-medium text-foreground/70 hover:text-foreground rounded-full border border-accent/30 shadow-sm hover:shadow-md transition"
              onClick={() => bm.setManualBrand((v) => !v)}
            >
              {bm.manualBrand ? "Añadir automáticamente" : "Añadir manualmente"}
            </Button>
          )}
        </div>
        {bm.manualBrand ? (
          <div className="flex items-center gap-2">
            <Input placeholder="Escribe la marca" value={bm.brandName} onChange={(e) => bm.setBrandName(e.target.value)} />
            <Button type="button" variant="outline" onClick={bm.createBrand} disabled={!bm.brandName.trim()}>Crear</Button>
          </div>
        ) : (
          <Select value={bm.selectedBrand} onValueChange={(val) => { bm.handleBrandChange(val); onBrandChange && onBrandChange(val); }}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona marca" />
            </SelectTrigger>
            <SelectContent>
              {bm.brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Modelo</Label>
          {allowManual && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs font-medium text-foreground/70 hover:text-foreground rounded-full border border-accent/30 shadow-sm hover:shadow-md transition"
              onClick={() => bm.setManualModel((v) => !v)}
            >
              {bm.manualModel ? "Añadir automáticamente" : "Añadir manualmente"}
            </Button>
          )}
        </div>
        {bm.manualModel ? (
          <div className="flex items-center gap-2">
            <Input placeholder="Escribe el modelo" value={bm.modelName} onChange={(e) => bm.setModelName(e.target.value)} />
            <Button type="button" variant="outline" onClick={bm.createModel} disabled={!bm.modelName.trim() || !bm.selectedBrand}>Crear</Button>
          </div>
        ) : (
          <Select value={bm.selectedModel} onValueChange={(val) => { bm.handleModelChange(val); onModelChange && onModelChange(val); }} disabled={!bm.selectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder={bm.selectedBrand ? "Selecciona modelo" : "Elige marca primero"} />
            </SelectTrigger>
            <SelectContent>
              {bm.models.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
