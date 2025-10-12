import { CarFilters } from "./_components/car-filters";
import { getCarFilters } from "@/actions/car-listing";
import { CarListings } from "./_components/cars-listing";

export const metadata = {
  title: "Coches | CochesToday",
  description: "Explora y busca tu coche ideal",
};

export default async function CarsPage() {
  // Fetch filters data on the server
  const filtersData = await getCarFilters();

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
          Explorar coches
        </h1>
        <p className="text-foreground/70 mt-3 max-w-2xl">
          Filtra por marca, carrocería, precio o transmisión y encuentra el coche que se adapta a tu estilo.
        </p>
      </div>

      <CarFilters filters={filtersData.data} />

      <CarListings />
    </div>
  );
}
