"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import BrandModelSelector from "@/components/forms/BrandModelSelector";
import { cn } from "@/lib/utils";
import { Info, Image as ImageIcon, Upload, Trash2 } from "lucide-react";

const FUEL_TYPES = ["Gasolina", "Diésel", "Eléctrico", "Híbrido"];
const TRANSMISSIONS = ["Manual", "Automática"];
const BODY_TYPES = [
  "SUV",
  "Sedán",
  "Hatchback",
  "Coupé",
  "Familiar",
  "Pickup",
  "Cabrio",
];

const schema = z
  .object({
    brandId: z.string().optional(),
    modelId: z.string().optional(),
    brandName: z.string().optional(),
    modelName: z.string().optional(),
    title: z.string().min(3, "Título demasiado corto"),
    price: z.coerce.number().positive("Precio inválido"),
    year: z
      .coerce
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 1, "Año inválido"),
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
    (d) =>
      (d.brandId && d.brandId.length > 0) ||
      (d.brandName && d.brandName.trim().length > 0),
    { path: ["brandId"], message: "Selecciona o escribe una marca" }
  )
  .refine(
    (d) =>
      (d.modelId && d.modelId.length > 0) ||
      (d.modelName && d.modelName.trim().length > 0),
    { path: ["modelId"], message: "Selecciona o escribe un modelo" }
  );

export default function PublishCarForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [files, setFiles] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    watch,
  } = useForm({
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

  const description = watch("description") || "";

  const steps = [
    { title: "Tipo de vehículo", subtitle: "Selecciona marca y modelo" },
    { title: "Datos del anuncio", subtitle: "Título, precio y ubicación" },
    { title: "Especificaciones", subtitle: "Combustible, carrocería, extras" },
    { title: "Descripción", subtitle: "Cuenta todos los detalles relevantes" },
    { title: "Fotografías", subtitle: "Añade imágenes y servicios extra" },
  ];

  const stepFields = [
    ["brandId", "brandName", "modelId", "modelName"],
    ["title", "price", "location"],
    ["year", "mileage", "fuelType", "transmission", "bodyType", "seats"],
    ["description"],
    [],
  ];

  const handleFileSelection = (event) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;
    setFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => f.name + f.lastModified));
      const unique = selected.filter(
        (f) => !existingKeys.has(f.name + f.lastModified)
      );
      return [...prev, ...unique];
    });
    event.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  async function onSubmit(values) {
    if (!files.length) {
      setServerError("Debes subir al menos una imagen antes de publicar.");
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          data.append(key, String(value));
        }
      });
      files.forEach((file) => data.append("images", file));
      if (isFeatured) data.append("featured", "true");

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

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      await handleSubmit(onSubmit)();
      return;
    }

    const fields = stepFields[currentStep];
    const isValid =
      fields.length === 0 || (await trigger(fields, { shouldFocus: true }));
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-accent/25 bg-card/95 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Selecciona tu vehículo
              </h2>
              <p className="text-sm text-foreground/70 mb-5">
                Busca la marca y modelo en nuestro catálogo o introdúcelo manualmente.
              </p>
              <BrandModelSelector
                valueBrand={watch("brandId")}
                valueModel={watch("modelId")}
                onBrandChange={(val) => {
                  setValue("brandId", val, { shouldValidate: true });
                  setValue("brandName", "");
                  setValue("modelId", "");
                  setValue("modelName", "");
                }}
                onModelChange={(val) => {
                  setValue("modelId", val, { shouldValidate: true });
                  setValue("modelName", "");
                }}
                allowManual
              />
              {errors.brandId && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.brandId.message}
                </p>
              )}
              {errors.modelId && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.modelId.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-3xl border border-accent/20 bg-card/80 p-4 text-sm text-foreground/80">
              <Info className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-foreground">
                  ¿No aparece tu combinación?
                </p>
                <p className="text-foreground/70">
                  Escríbela manualmente. Nuestro equipo la estandarizará para mostrarla correctamente en el marketplace.
                </p>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid gap-6">
            <div className="rounded-3xl border border-accent/25 bg-card/95 p-6 shadow-sm space-y-5">
              <h2 className="text-xl font-semibold text-foreground">
                Datos del anuncio
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    placeholder="Ej. Audi A3 Sportback 2.0 TDI"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-600">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Precio (€)</Label>
                  <Input type="number" min="0" step="100" {...register("price")} />
                  {errors.price && (
                    <p className="text-xs text-red-600">{errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <Input placeholder="Madrid, Barcelona..." {...register("location")} />
                  {errors.location && (
                    <p className="text-xs text-red-600">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input placeholder="Negro metalizado" {...register("color")} />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-3xl border border-accent/20 bg-card/80 p-4 text-sm text-foreground/80">
              <Info className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Consejo de experto</p>
                <p className="text-foreground/70">
                  Un título descriptivo y un precio competitivo aumentan la visibilidad del anuncio hasta 4 veces.
                </p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="rounded-3xl border border-accent/25 bg-card/95 p-6 shadow-sm space-y-5">
            <h2 className="text-xl font-semibold text-foreground">
              Especificaciones del vehículo
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Año</Label>
                <Input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  {...register("year")}
                />
                {errors.year && (
                  <p className="text-xs text-red-600">{errors.year.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Kilometraje</Label>
                <Input type="number" min="0" step="1000" {...register("mileage")} />
                {errors.mileage && (
                  <p className="text-xs text-red-600">{errors.mileage.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Combustible</Label>
                <Select
                  value={watch("fuelType") || ""}
                  onValueChange={(value) => setValue("fuelType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_TYPES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transmisión</Label>
                <Select
                  value={watch("transmission") || ""}
                  onValueChange={(value) => setValue("transmission", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISSIONS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Carrocería</Label>
                <Select
                  value={watch("bodyType") || ""}
                  onValueChange={(value) => setValue("bodyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {BODY_TYPES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plazas</Label>
                <Input type="number" min="2" max="9" {...register("seats")} />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-card/80 border border-accent/20 p-4">
              <Checkbox
                id="featured"
                checked={isFeatured}
                onCheckedChange={(value) => setIsFeatured(!!value)}
              />
              <Label htmlFor="featured" className="text-sm text-foreground/80">
                Destacar mi anuncio en portada (opcional)
              </Label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div className="rounded-3xl border border-accent/25 bg-card/95 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Descripción del vehículo
              </h2>
              <Textarea
                placeholder="Habla del historial de mantenimiento, revisiones, extras incluidos, estado de neumáticos..."
                {...register("description")}
                className="min-h-40"
              />
              <div className="mt-2 text-xs text-foreground/60 text-right">
                {description.length}/3000 caracteres
              </div>
              {errors.description && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-accent/20 bg-card/80 p-4 text-sm text-foreground/80 flex items-start gap-3">
              <Info className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Tip profesional</p>
                <p className="text-foreground/70">
                  Explica cómo cuidas el coche, detalla revisiones y menciona posibles defectos. La transparencia aumenta la confianza del comprador.
                </p>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-accent/25 bg-card/95 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Fotografías del vehículo
              </h2>
              <p className="text-sm text-foreground/70 mb-4">
                Recomendamos subir un mínimo de 5 fotos con diferentes ángulos, interior y exterior.
              </p>

              <label
                htmlFor="images"
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-accent/30 bg-background/70 px-6 py-12 text-center transition hover:border-accent hover:bg-accent/10 cursor-pointer"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition">
                  <ImageIcon className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Haz clic para subir fotografías
                  </p>
                  <p className="text-sm text-foreground/60">
                    Formatos aceptados: JPG y PNG. Tamaño máximo 5MB por imagen.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-2 text-sm font-medium">
                  <Upload className="h-4 w-4" />
                  Elegir archivos
                </div>
              </label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelection}
              />

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Fotografías seleccionadas ({files.length})
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-accent/20 bg-background/80 px-4 py-3 text-sm text-foreground/80"
                      >
                        <div className="truncate max-w-[70%]">
                          <span className="font-medium text-foreground">
                            {file.name}
                          </span>
                          <p className="text-xs text-foreground/60">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="rounded-full border border-accent/30 p-2 text-foreground/60 hover:text-red-500 hover:border-red-400 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-accent/20 bg-card/80 p-5 text-sm text-foreground/80 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    Tasación y revisión profesional
                  </p>
                  <p className="text-foreground/70">
                    Solicita una valoración con escaneo completo para aumentar la confianza del comprador y justificar el precio final.
                  </p>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-accent/40 px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition"
              >
                Quiero más información
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl space-y-10 pb-20 md:pb-0">
      {serverError && (
        <div className="rounded-xl bg-red-100 text-red-700 p-4 text-sm border border-red-200">
          {serverError}
        </div>
      )}

      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
          Publicar mi coche
        </h1>
        <p className="text-foreground/70 max-w-2xl">
          Completa estos pasos para crear un anuncio premium. Puedes guardar y volver en cualquier momento: nuestro equipo se encargará de dejarlo perfecto.
        </p>
      </header>

      <nav className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {steps.map((step, index) => {
            const status =
              index === currentStep
                ? "active"
                : index < currentStep
                ? "complete"
                : "upcoming";
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setCurrentStep(index)}
                disabled={index > currentStep}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-2 text-left transition",
                  status === "active" &&
                    "border-accent bg-accent/10 text-foreground shadow-sm",
                  status === "complete" &&
                    "border-accent/40 bg-accent/5 text-foreground",
                  status === "upcoming" &&
                    "border-border text-foreground/50 hover:border-accent/40",
                  index > currentStep && "cursor-not-allowed opacity-60"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                    status === "active" &&
                      "border-accent bg-accent text-accent-foreground",
                    status === "complete" &&
                      "border-accent bg-accent/20 text-foreground",
                    status === "upcoming" &&
                      "border-border bg-background text-foreground/60"
                  )}
                >
                  {index + 1}
                </span>
                <div className="text-sm">
                  <p className="font-semibold leading-none">{step.title}</p>
                  <p className="text-xs text-foreground/60">{step.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {renderStep()}

        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            className="px-6"
            onClick={handlePrevious}
            disabled={currentStep === 0 || submitting}
          >
            Atrás
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground/60">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <Button
              type={currentStep === steps.length - 1 ? "submit" : "button"}
              className="px-6"
              onClick={currentStep === steps.length - 1 ? undefined : handleNext}
              disabled={submitting}
            >
              {submitting
                ? "Publicando..."
                : currentStep === steps.length - 1
                ? "Publicar anuncio"
                : "Continuar"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
