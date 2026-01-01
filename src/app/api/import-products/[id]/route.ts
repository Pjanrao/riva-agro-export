import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ImportProduct } from '@/lib/models/ImportProduct';

export const runtime = 'nodejs';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'ID is required' },
        { status: 400 }
      );
    }

    const deleted = await ImportProduct.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Import product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE IMPORT ERROR:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
