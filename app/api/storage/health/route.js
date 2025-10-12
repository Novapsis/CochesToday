import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Attempt to list root of the bucket; succeeds if bucket exists and read policy permits
    const { data, error } = await supabase.storage.from('car-images').list('', { limit: 1 });

    if (error) {
      return NextResponse.json({ ok: false, bucket: 'car-images', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, bucket: 'car-images', sample: data ?? [] });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
