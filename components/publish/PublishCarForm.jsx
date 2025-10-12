"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FUEL_TYPES = ["Gasolina", "Diésel", "Eléctrico", "Híbrido"];
const TRANSMISSIONS = ["Manual", "Automática"];
const BODY_TYPES = ["SUV", "Sedán", "Hatchback", "Coupé", "Familiar", "Pickup", "Cabrio"]; 

const schema = z
  .object({
    brandId: z.string().optional(),
    modelId: z.string().optional(),
    brandName: z.string().optional(),
    modelName: z.string().optional(),
    title: z.string().min(3, "Título demasiado corto"),
    price: z.coerce.number().positive("Precio inválido"),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    mileage: z.coerce.number().min(0),
    location: z.string().min(2),
    color: z.string().optional().nullable(),
    fuelType: z.string().optional().nullable(),
    transmission: z.string().optional().nullable(),
    bodyType: z.string().optional().nullable(),
    seats: z.coerce.number().min(2).max(9).optional().nullable(),
    description: z.string().min(10, "Describe mejor el coche"),
  })
  .refine(
    (d) => (d.brandId && d.brandId.length > 0) || (d.brandName && d.brandName.trim().length > 0),
    { path: ["brandId"], message: "Selecciona o escribe una marca" }
  )
  .refine(
    (d) => (d.modelId && d.modelId.length > 0) || (d.modelName && d.modelName.trim().length > 0),
    { path: ["modelId"], message: "Selecciona o escribe un modelo" }
  );

export default function PublishCarForm({ brands, models }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [brandId, setBrandId] = useState("");
  const [manualBrand, setManualBrand] = useState(false);
  const [manualModel, setManualModel] = useState(false);
  const [files, setFiles] = useState([]);
  const brandModels = useMemo(() => models.filter(m => m.brandId === brandId), [models, brandId]);

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      brandId: "",
      modelId: "",
      brandName: "",
      modelName: "",
      title: "",
      price: "",
      year: "",
      mileage: "",
      location: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
    },
  });

  const brandName = watch("brandName");

  async function onSubmit(values) {
    if (!files || files.length === 0) {
      setServerError("Debes subir al menos una imagen");
      return;
    }
    setSubmitting(true);
    setServerError("");

    try {
      const data = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") data.append(k, String(v));
      });
      files.forEach((f) => data.append("images", f));

      const res = await fetch("/api/cars", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al crear el coche");
      toast.success("Coche publicado", {
        description: "Haz clic para ver la publicación",
        action: {
          label: "Ver coche",
          onClick: () => router.push(`/cars/${json.id}`),
        },
      });
      router.push(`/cars/${json.id}`);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6 pb-20 md:pb-0">
      {serverError && <div className="rounded-md bg-red-50 text-red-700 p-3 text-sm">{serverError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between">
            <Label>Marca</Label>
            <button type="button" className="text-xs text-foreground/70 hover:text-foreground" onClick={() => { setManualBrand(v => !v); setBrandId(""); setValue("brandId", ""); setValue("brandName", ""); }}>
              {manualBrand ? "Usar listado" : "Añadir manualmente"}
            </button>
          </div>
          {manualBrand ? (
            <Input placeholder="Escribe la marca" {...register("brandName")} />
          ) : (
            <Select value={brandId} onValueChange={(val) => { setBrandId(val); setValue("brandId", val, { shouldValidate: true }); setValue("brandName", ""); setValue("modelId", ""); }}>
              <SelectTrigger><SelectValue placeholder="Selecciona marca" /></SelectTrigger>
              <SelectContent>
                {brands.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.brandId && <p className="text-xs text-red-600 mt-1">{errors.brandId.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Modelo</Label>
            <button type="button" className="text-xs text-foreground/70 hover:text-foreground" onClick={() => { setManualModel(v => !v); setValue("modelId", ""); setValue("modelName", ""); }}>
              {manualModel ? "Usar listado" : "Añadir manualmente"}
            </button>
          </div>
          {manualModel ? (
            <Input placeholder="Escribe el modelo" {...register("modelName")} />
          ) : (
            <Select onValueChange={(val) => setValue("modelId", val, { shouldValidate: true })} disabled={manualBrand ? !brandName : !brandId}>
              <SelectTrigger><SelectValue placeholder={(manualBrand ? brandName : brandId) ? "Selecciona modelo" : "Elige marca primero"} /></SelectTrigger>
              <SelectContent>
                {brandModels.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.modelId && <p className="text-xs text-red-600 mt-1">{errors.modelId.message}</p>}
        </div>
        <div>
          <Label>Título</Label>
          <Input placeholder="Ej. Audi A3 Sportback" {...register("title")} />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label>Precio (€)</Label>
          <Input type="number" min="0" step="100" {...register("price")} />
          {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label>Año</Label>
          <Input type="number" min="1900" max={new Date().getFullYear()+1} {...register("year")} />
          {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year.message}</p>}
        </div>
        <div>
          <Label>Kilometraje</Label>
          <Input type="number" min="0" step="1000" {...register("mileage")} />
          {errors.mileage && <p className="text-xs text-red-600 mt-1">{errors.mileage.message}</p>}
        </div>
        <div>
          <Label>Ubicación</Label>
          <Input placeholder="Madrid, Barcelona..." {...register("location")} />
          {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <Label>Color</Label>
          <Input placeholder="Negro, Blanco..." {...register("color")} />
        </div>
        <div>
          <Label>Combustible</Label>
          <Select onValueChange={(v)=>setValue("fuelType", v)}>
            <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Transmisión</Label>
          <Select onValueChange={(v)=>setValue("transmission", v)}>
            <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
            <SelectContent>
              {TRANSMISSIONS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Carrocería</Label>
          <Select onValueChange={(v)=>setValue("bodyType", v)}>
            <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
            <SelectContent>
              {BODY_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Plazas</Label>
          <Input type="number" min="2" max="9" {...register("seats")} />
        </div>
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea placeholder="Cuenta los detalles más relevantes..." {...register("description")} className="min-h-32" />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <Label>Imágenes (puedes seleccionar varias)</Label>
        <Input type="file" accept="image/*" multiple onChange={(e)=>setFiles(Array.from(e.target.files || []))} />
        <p className="text-xs text-gray-500 mt-1">Formatos: JPG/PNG/WebP. Tamaño máx. 10MB por imagen.</p>
      </div>

      <div className="hidden md:flex gap-3">
        <Button type="submit" disabled={submitting}>{submitting ? "Publicando..." : "Publicar"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>

      {/* Sticky CTA para móviles */}
      <div className="fixed inset-x-0 bottom-0 md:hidden bg-white/90 backdrop-blur border-t p-3 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Publicando..." : "Publicar"}</Button>
      </div>
    </form>
  );
}
