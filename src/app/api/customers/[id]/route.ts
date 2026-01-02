import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { CustomerModel } from '@/lib/models/Customer';

export const runtime = 'nodejs';

/* ================= UPDATE CUSTOMER ================= */

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();

    const updated = await CustomerModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('UPDATE CUSTOMER ERROR:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/* ================= DELETE CUSTOMER ================= */

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deleted = await CustomerModel.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE CUSTOMER ERROR:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
