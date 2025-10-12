import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';
import PublishCarForm from '@/components/publish/PublishCarForm';

export const dynamic = 'force-dynamic';

export default async function PublishPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?redirect=/publish');

  // Load brands and models to feed the form
  const brands = await db.carBrand.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });
  const models = await db.carModel.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, brandId: true }
  });

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center text-foreground">
          Publicar coche
        </h1>
        <PublishCarForm brands={brands} models={models} />
      </div>
    </div>
  );
}
