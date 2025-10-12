"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/car-card";
import { Heart } from "lucide-react";

export function SavedCarsList({ initialData }) {
  // No saved cars
  if (!initialData?.data || initialData?.data.length === 0) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-10 border border-accent/25 rounded-2xl bg-card/90">
        <div className="bg-accent/15 p-4 rounded-full mb-4">
          <Heart className="h-8 w-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No tienes coches guardados
        </h3>
        <p className="text-foreground/70 mb-6 max-w-md leading-relaxed">
          Aún no has guardado ningún coche. Explora nuestros anuncios y pulsa el corazón para añadir tus favoritos.
        </p>
        <Button asChild>
          <Link href="/cars">Ver coches disponibles</Link>
        </Button>
      </div>
    );
  }

  // Display saved cars
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialData?.data?.map((car) => (
        <CarCard key={car.id} car={{ ...car, wishlisted: true }} />
      ))}
    </div>
  );
}
