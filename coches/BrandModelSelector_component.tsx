
// components/forms/BrandModelSelector.tsx
"use client"
import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase'

interface Brand {
  id: string
  name: string
  sort_order: number
}

interface Model {
  id: string
  name: string
  brand_id: string
}

interface BrandModelSelectorProps {
  onBrandChange?: (brandId: string, brandName: string) => void
  onModelChange?: (modelId: string, modelName: string) => void
  selectedBrand?: string
  selectedModel?: string
}

export default function BrandModelSelector({
  onBrandChange,
  onModelChange,
  selectedBrand = "",
  selectedModel = ""
}: BrandModelSelectorProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Cargar marcas al montar
  useEffect(() => {
    fetchBrands()
  }, [])

  // Cargar modelos cuando cambia la marca
  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand)
    } else {
      setModels([])
    }
  }, [selectedBrand])

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('CarBrand')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setBrands(data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const fetchModels = async (brandId: string) => {
    if (!brandId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('CarModel')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBrandSelect = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId)
    if (brand && onBrandChange) {
      onBrandChange(brandId, brand.name)
    }

    // Reset model selection
    if (onModelChange) {
      onModelChange("", "")
    }
  }

  const handleModelSelect = (modelId: string) => {
    const model = models.find(m => m.id === modelId)
    if (model && onModelChange) {
      onModelChange(modelId, model.name)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Selector de Marca */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Marca del coche
        </label>
        <Select value={selectedBrand} onValueChange={handleBrandSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona marca" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selector de Modelo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Modelo del coche
        </label>
        <Select 
          value={selectedModel} 
          onValueChange={handleModelSelect}
          disabled={!selectedBrand || loading}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                !selectedBrand 
                  ? "Primero selecciona marca" 
                  : loading 
                  ? "Cargando modelos..." 
                  : "Selecciona modelo"
              } 
            />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Hook para uso fácil
export function useBrandModel() {
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [brandName, setBrandName] = useState("")
  const [modelName, setModelName] = useState("")

  const handleBrandChange = (brandId: string, brandName: string) => {
    setSelectedBrand(brandId)
    setBrandName(brandName)
    setSelectedModel("")
    setModelName("")
  }

  const handleModelChange = (modelId: string, modelName: string) => {
    setSelectedModel(modelId)
    setModelName(modelName)
  }

  return {
    selectedBrand,
    selectedModel,
    brandName,
    modelName,
    handleBrandChange,
    handleModelChange
  }
}
