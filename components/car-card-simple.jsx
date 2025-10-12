import NextImage from "next/image";
import { Car, MapPin, Calendar, Fuel, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CarCard = ({ car }) => {
  return (
    <div className="rounded-xl border border-accent/35 bg-background overflow-hidden transition hover:border-accent/80">
      {/* Image Section */}
      <div className="relative h-48 bg-secondary">
        {car.images && car.images.length > 0 ? (
          <NextImage
            src={car.images[0]?.url || car.images[0]}
            alt={`${car.brand?.name || ''} ${car.model?.name || ''}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Car className="h-16 w-16 text-foreground/50" />
          </div>
        )}
        <div className="absolute top-4 right-4 rounded-full border border-accent/60 bg-background/90 px-2 py-1 text-sm font-semibold text-foreground flex items-center gap-1">
          Destacado
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-foreground">
          {car.brand?.name || ''} {car.model?.name || ''}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-semibold text-foreground">
            €{car.price?.toLocaleString()}
          </span>
          <span className="text-sm text-foreground/60">
            {car.mileage?.toLocaleString()} km
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-foreground/60 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {car.year}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {car.location}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="border-accent/30 text-foreground/70">
            {car.bodyType}
          </Badge>
          <Badge variant="outline" className="border-accent/30 text-foreground/70">
            {car.fuelType}
          </Badge>
          <Badge variant="outline" className="border-accent/30 text-foreground/70">
            {car.transmission}
          </Badge>
        </div>

        <p className="text-foreground/70 text-sm line-clamp-2">
          {car.description}
        </p>
      </div>
    </div>
  );
};
