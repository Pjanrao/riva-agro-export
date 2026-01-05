import { NextResponse } from 'next/server';
import {
  getBannerById,
  updateBanner,
  deleteBanner,
} from '@/lib/models/banner';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const banner = await getBannerById(params.id);

  if (!banner) {
    return NextResponse.json(
      { message: 'Banner not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(banner);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const updated = await updateBanner(params.id, body);

  if (!updated) {
    return NextResponse.json(
      { message: 'Banner not found or no changes' },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const success = await deleteBanner(params.id);

  if (!success) {
    return NextResponse.json(
      { message: 'Banner not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
