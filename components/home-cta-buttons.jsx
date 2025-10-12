'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const HomeCtaButtons = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button size="lg" variant="secondary" asChild>
        <Link href="/cars">View All Cars</Link>
      </Button>
      {!user && (
        <Button size="lg" asChild>
          <Link href="/sign-up">Sign Up Now</Link>
        </Button>
      )}
    </div>
  );
};
