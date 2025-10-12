'use client';

import { useEffect, useState } from 'react';
import { getFeaturedCars } from '@/actions/home';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Star, MapPin, Calendar } from 'lucide-react';

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCars = async () => {
      try {
        const cars = await getFeaturedCars(3);
        setFeaturedCars(cars);
      } catch (error) {
        console.error('Error loading featured cars:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCars();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,hsl(var(--accent)/0.15),transparent),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="mx-auto text-center max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Vende tu coche con una experiencia premium
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-muted-foreground">
              Servicio concierge, fotografía profesional y gestión integral para obtener el mejor precio sin complicaciones.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/publish" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:opacity-90">
                  Solicitar valoración gratuita
                </Button>
              </Link>
              <Link href="/cars" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border text-foreground hover:bg-secondary">
                  Ver coches disponibles
                </Button>
              </Link>
            </div>
            <div className="mt-6 text-xs sm:text-sm text-muted-foreground">
              +500 coches vendidos · 98% satisfacción · Cobertura nacional
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Coches destacados</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredCars.map((car) => (
              <Link key={car.id} href={`/cars/${car.id}`}>
                <div className="bg-card text-card-foreground rounded-xl border border-border hover:border-muted transition-colors cursor-pointer overflow-hidden">
                  <div className="relative h-52 bg-muted">
                    {car.images && car.images.length > 0 ? (
                      <Image
                        src={car.images[0].url}
                        alt={car.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Car className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent))]/90 px-2.5 py-1 text-xs font-semibold text-[hsl(var(--accent-foreground))] shadow-sm">
                      <Star className="h-3.5 w-3.5" /> Destacado
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-1 text-foreground">
                      {car.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {car.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {car.year}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {car.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        €{car.price?.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {car.mileage?.toLocaleString()} km
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Car className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay coches destacados disponibles
            </h3>
            <p className="text-gray-500 mb-8">
              Sé el primero en destacar tu coche en nuestra plataforma
            </p>
            <Link href="/publish">
              <Button>Publicar mi Coche</Button>
            </Link>
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/cars">
            <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary">
              Ver todos los coches
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
