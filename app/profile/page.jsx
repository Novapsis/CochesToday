import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';
import ProfileClient from '@/components/profile/ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?redirect=/profile');
  }

  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      savedCars: {
        include: {
          car: {
            include: {
              images: true,
              brand: true,
              model: true,
            }
          }
        }
      },
      cars: {
        include: {
          images: true,
          brand: true,
          model: true,
        },
        orderBy: { createdAt: 'desc' }
      },
      orders: {
        include: {
          steps: true,
          car: true,
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileClient initialUser={fullUser} />
    </div>
  );
}
