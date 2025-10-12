import { getSavedCars } from "@/actions/car-listing";
import { SavedCarsList } from "./_components/saved-cars-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mis Coches Favoritos | CochesToday",
  description: "Ve tus coches guardados y favoritos",
};

export default async function SavedCarsPage() {
  // Check authentication on server
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/saved-cars");
  }

  // Fetch saved cars on the server
  const savedCarsResult = await getSavedCars(user.id);

  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
          Mis coches favoritos
        </h1>
        <p className="text-foreground/70 mt-3 max-w-2xl">
          Aquí aparecerán todos los vehículos que marques con el corazón para revisarlos más tarde.
        </p>
      </div>
      <SavedCarsList initialData={savedCarsResult} />
    </div>
  );
}
