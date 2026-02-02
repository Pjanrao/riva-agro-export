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

    // ✅ IMPORTANT:
    // Use $set and DO NOT run validators
    // This allows partial updates (edit form does not send all fields)
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true,   runValidators: false}
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error('UPDATE CUSTOMER ERROR:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/* ================= DELETE CUSTOMER ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deletedCustomer = await CustomerModel.findByIdAndDelete(params.id);

    if (!deletedCustomer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Customer deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE CUSTOMER ERROR:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}