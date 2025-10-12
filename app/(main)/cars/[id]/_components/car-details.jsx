"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { AlertCircle, Calendar } from "lucide-react";
import {
  Car,
  Fuel,
  Gauge,
  LocateFixed,
  Share2,
  Heart,
  MessageSquare,
  Currency,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toggleSavedCar } from "@/actions/car-listing";
import useFetch from "@/hooks/use-fetch";
import { formatCurrency } from "@/lib/helpers";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmiCalculator from "./emi-calculator";

export function CarDetails({ car }) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);

  const {
    loading: savingCar,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  // Handle toggle result with useEffect
  useEffect(() => {
    if (toggleResult?.success) {
      setIsWishlisted(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult]);

  // Handle errors with useEffect
  useEffect(() => {
    if (toggleError) {
      toast.error("Error al actualizar favoritos");
    }
  }, [toggleError]);

  // Handle save car
  const handleSaveCar = async () => {
    if (!user) {
      toast.error("Inicia sesión para guardar coches");
      router.push("/sign-in");
      return;
    }

    if (savingCar) return;

    // Use the toggleSavedCarFn from useFetch hook
    await toggleSavedCarFn(car.id);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.year} ${car.brand?.name || ''} ${car.model?.name || ''}`,
          text: `¡Mira este ${car.year} ${car.brand?.name || ''} ${car.model?.name || ''} en CochesToday!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado al portapapeles");
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="w-full lg:w-7/12">
          <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
            {car.images && car.images.length > 0 ? (
              <Image
                src={car.images[currentImageIndex]?.url || car.images[currentImageIndex]}
                alt={`${car.year} ${car.brand?.name || ''} ${car.model?.name || ''}`}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <Car className="h-24 w-24 text-foreground/40" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {car.images && car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => (
                <div
                  key={index}
                    className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${
                    index === currentImageIndex
                      ? "border-2 border-accent"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image?.url || image}
                    alt={`${car.year} ${car.brand?.name || ''} ${car.model?.name || ''} - vista ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Secondary Actions */}
          <div className="flex mt-4 gap-4">
            <Button
              variant="outline"
              className={`flex items-center gap-2 flex-1 ${
                isWishlisted ? "text-red-500" : ""
              }`}
              onClick={handleSaveCar}
              disabled={savingCar}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`}
              />
              {isWishlisted ? "Guardado" : "Guardar"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Car Details */}
        <div className="w-full lg:w-5/12">
          <div className="flex items-center justify-between">
            <Badge className="mb-2">{car.bodyType}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-1">
            {car.year} {car.brand?.name || ''} {car.model?.name || ''}
          </h1>

          <div className="text-2xl font-bold text-accent">
            {formatCurrency(car.price)}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="flex items-center gap-2 text-foreground">
              <Gauge className="h-5 w-5 text-accent" />
              <span>{car.mileage?.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Fuel className="h-5 w-5 text-accent" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Car className="h-5 w-5 text-accent" />
              <span>{car.transmission}</span>
            </div>
          </div>

          {/* Financing section disabled for now */}

          {/* Request More Info */}
          <Card className="my-6 bg-card/90 border border-accent/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-lg font-medium mb-2 text-foreground">
                <MessageSquare className="h-5 w-5 text-accent" />
                <h3>¿Tienes preguntas?</h3>
              </div>
              <p className="text-sm text-foreground/70 mb-3">
                Nuestro equipo está listo para resolver cualquier duda sobre este vehículo.
              </p>
              <a href="mailto:hola@cochestoday.com">
                <Button variant="outline" className="w-full">
                  Solicitar información
                </Button>
              </a>
            </CardContent>
          </Card>

          {car.status !== "activo" && (
            <Alert variant="destructive">
              <AlertTitle className="capitalize">
                Este coche está {car.status}
              </AlertTitle>
              <AlertDescription>Vuelve a comprobar más tarde.</AlertDescription>
            </Alert>
          )}

          {/* Book Test Drive Button */}
          {car.status === "activo" && (
            <Button
              className="w-full py-6 text-lg"
              onClick={() => router.push(`/cars/${car.id}`)}
            >
              Reservar prueba de conducción
            </Button>
          )}
        </div>
      </div>

      {/* Details & Features Section */}
      <div className="mt-12 rounded-lg border border-accent/20 bg-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Descripción</h3>
            <p className="whitespace-pre-line text-foreground/80 leading-relaxed">
              {car.description}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Características</h3>
            <ul className="grid grid-cols-1 gap-2 text-foreground/80">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-accent rounded-full"></span>
                {car.transmission}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-accent rounded-full"></span>
                {car.fuelType}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-accent rounded-full"></span>
                {car.bodyType}
              </li>
              {car.seats && (
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-accent rounded-full"></span>
                  {car.seats} plazas
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-accent rounded-full"></span>
                Exterior {car.color}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-8 rounded-lg border border-accent/20 bg-card p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Especificaciones</h2>
        <div className="rounded-lg border border-accent/15 bg-background/80 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-foreground/80">
            <div className="flex justify-between py-2 border-b border-accent/10">
              <span>Marca</span>
              <span className="font-medium">{car.brand?.name || ''}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/10">
              <span>Modelo</span>
              <span className="font-medium">{car.model?.name || ''}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/10">
              <span>Año</span>
              <span className="font-medium">{car.year}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/10">
              <span>Carrocería</span>
              <span className="font-medium">{car.bodyType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/10">
              <span>Combustible</span>
              <span className="font-medium">{car.fuelType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/10">
              <span>Transmisión</span>
              <span className="font-medium">{car.transmission}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/10">
              <span>Kilometraje</span>
              <span className="font-medium">{car.mileage?.toLocaleString()} km</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/10">
              <span>Color</span>
              <span className="font-medium">{car.color}</span>
            </div>
            {car.seats && (
              <div className="flex justify-between py-2 border-b border-accent/10">
                <span>Plazas</span>
                <span className="font-medium">{car.seats}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Location */}
      <div className="mt-8 rounded-lg border border-accent/30 bg-card p-6">
        <div className="flex items-start gap-3">
          <LocateFixed className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Ubicación del vehículo
            </h2>
            <p className="text-foreground/70">
              {car.location || "Ubicación no disponible"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
