"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Car as CarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { toggleSavedCar } from "@/actions/car-listing";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";

export const CarCard = ({ car }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(car.wishlisted);

  // Use the useFetch hook
  const {
    loading: isToggling,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  // Handle toggle result with useEffect
  useEffect(() => {
    if (toggleResult?.success && toggleResult.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isSaved]);

  // Handle errors with useEffect
  useEffect(() => {
    if (toggleError) {
      toast.error("Error al actualizar favoritos");
    }
  }, [toggleError]);

  // Handle save/unsave car
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Inicia sesión para guardar coches");
      router.push("/sign-in");
      return;
    }

    if (isToggling) return;

    // Call the toggleSavedCar function using our useFetch hook
    await toggleSavedCarFn(car.id);
  };

  return (
    <Card className="overflow-hidden border border-accent/35 transition group hover:border-accent/80">
      <div className="relative h-48">
        {car.images && car.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={car.images[0]?.url || car.images[0]}
              alt={`${car.brand?.name || ''} ${car.model?.name || ''}`}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-foreground/50" />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full border border-accent/40 bg-background/90 p-2 ${
            isSaved
              ? "text-red-500 hover:text-red-600"
              : "text-foreground/60 hover:text-foreground"
          }`}
          onClick={handleToggleSave}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={isSaved ? "fill-current" : ""} size={20} />
          )}
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {car.brand?.name || ''} {car.model?.name || ''}
          </h3>
          <span className="text-lg font-semibold text-foreground/90">
            €{car.price?.toLocaleString()}
          </span>
        </div>

        <div className="text-foreground/60 mb-3 flex items-center text-sm">
          <span>{car.year}</span>
          <span className="mx-2">•</span>
          <span>{car.transmission}</span>
          <span className="mx-2">•</span>
          <span>{car.fuelType}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <Badge variant="outline" className="border-accent/30 bg-background/60 text-foreground/70">
            {car.bodyType}
          </Badge>
          <Badge variant="outline" className="border-accent/30 bg-background/60 text-foreground/70">
            {car.mileage?.toLocaleString()} km
          </Badge>
          <Badge variant="outline" className="border-accent/30 bg-background/60 text-foreground/70">
            {car.color}
          </Badge>
        </div>

        <div className="flex justify-between">
          <Button
            className="flex-1"
            onClick={() => {
              router.push(`/cars/${car.id}`);
            }}
          >
            Ver Coche
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
