import { NextResponse } from 'next/server';
import { getBanners, createBanner } from '@/lib/models/banner';

/* ================= GET ALL BANNERS ================= */

export async function GET() {
  try {
    const banners = await getBanners();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('GET /api/banners error:', error);

    return NextResponse.json(
      { message: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

/* ================= CREATE BANNER ================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.heading || !body.image) {
      return NextResponse.json(
        { message: 'Heading and image are required' },
        { status: 400 }
      );
    }

    const banner = await createBanner(body);
    return NextResponse.json(banner, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/banners error:', err);

    return NextResponse.json(
      { message: err.message || 'Create banner failed' },
      { status: 500 }
    );
  }
}