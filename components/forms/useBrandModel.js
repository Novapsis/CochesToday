"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export function useBrandModel(initialBrandId = "", initialModelId = "") {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(initialBrandId);
  const [selectedModel, setSelectedModel] = useState(initialModelId);
  const [manualBrand, setManualBrand] = useState(false);
  const [manualModel, setManualModel] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [modelName, setModelName] = useState("");
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const loadBrands = useCallback(async (q = "") => {
    setLoadingBrands(true);
    try {
      const url = q ? `/api/brands?query=${encodeURIComponent(q)}` : "/api/brands";
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok) setBrands(json.data || []);
    } finally {
      setLoadingBrands(false);
    }
  }, []);

  const loadModels = useCallback(async (brandId, q = "") => {
    if (!brandId) {
      setModels([]);
      return;
    }
    setLoadingModels(true);
    try {
      const qs = new URLSearchParams({ brandId });
      if (q) qs.set("query", q);
      const res = await fetch(`/api/models?${qs.toString()}`);
      const json = await res.json();
      if (res.ok) setModels(json.data || []);
    } finally {
      setLoadingModels(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  useEffect(() => {
    loadModels(selectedBrand);
  }, [selectedBrand, loadModels]);

  const brandOptions = useMemo(() => brands, [brands]);
  const modelOptions = useMemo(() => models, [models]);

  const handleBrandChange = useCallback((val) => {
    setSelectedBrand(val);
    setSelectedModel("");
  }, []);

  const handleModelChange = useCallback((val) => {
    setSelectedModel(val);
  }, []);

  const createBrand = useCallback(async () => {
    if (!brandName.trim()) return null;
    const res = await fetch("/api/brands", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: brandName.trim() }) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error creando marca");
    setSelectedBrand(json.data.id);
    setManualBrand(false);
    setBrandName("");
    await loadBrands();
    return json.data;
  }, [brandName, loadBrands]);

  const createModel = useCallback(async () => {
    if (!selectedBrand || !modelName.trim()) return null;
    const res = await fetch("/api/models", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brandId: selectedBrand, name: modelName.trim() }) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error creando modelo");
    setSelectedModel(json.data.id);
    setManualModel(false);
    setModelName("");
    await loadModels(selectedBrand);
    return json.data;
  }, [modelName, selectedBrand, loadModels]);

  return {
    brands: brandOptions,
    models: modelOptions,
    selectedBrand,
    selectedModel,
    manualBrand,
    manualModel,
    brandName,
    modelName,
    loadingBrands,
    loadingModels,
    setManualBrand,
    setManualModel,
    setBrandName,
    setModelName,
    handleBrandChange,
    handleModelChange,
    loadBrands,
    loadModels,
    createBrand,
    createModel,
  };
}
