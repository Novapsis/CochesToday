import { getCarById } from "@/actions/car-listing";
import { CarDetails } from "./_components/car-details";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "Coche No Encontrado | CochesToday",
      description: "El coche solicitado no se pudo encontrar",
    };
  }

  const car = result.data;

  return {
    title: `${car.year} ${car.brand?.name || ''} ${car.model?.name || ''} | CochesToday`,
    description: car.description?.substring(0, 160) || `Coche ${car.year} en venta`,
    openGraph: {
      images: car.images?.[0] ? [{ url: car.images[0].url }] : [],
    },
  };
}

export default async function CarDetailsPage({ params }) {
  // Fetch car details
  const { id } = await params;
  const result = await getCarById(id);

  // If car not found, show 404
  if (!result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <CarDetails car={result.data} />
    </div>
  );
}
