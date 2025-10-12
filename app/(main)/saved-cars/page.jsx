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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient-title">Mis Coches Favoritos</h1>
      <SavedCarsList initialData={savedCarsResult} />
    </div>
  );
}
