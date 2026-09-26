import { NextResponse } from 'next/server';
import { getAllSettingsFromDb, getSettingFromDb, saveSettingToDb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key) {
      const data = await getSettingFromDb(key);
      return NextResponse.json({ success: true, key, data });
    }

    const allSettings = await getAllSettingsFromDb();
    return NextResponse.json(
      { success: true, settings: allSettings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key, data, settings } = body;

    if (key && data !== undefined) {
      const ok = await saveSettingToDb(key, data);
      return NextResponse.json({ success: ok });
    }

    if (settings && typeof settings === 'object') {
      const entries = Object.entries(settings);
      await Promise.all(entries.map(([k, v]) => saveSettingToDb(k, v)));
      return NextResponse.json({ success: true, count: entries.length });
    }

    return NextResponse.json(
      { success: false, error: 'Missing key or data in request body' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}
