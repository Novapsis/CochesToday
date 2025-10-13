import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PublishCarForm from '@/components/publish/PublishCarForm';

export const dynamic = 'force-dynamic';

export default async function PublishPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?redirect=/publish');

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-5xl">
        <PublishCarForm />
      </div>
    </div>
  );
}
