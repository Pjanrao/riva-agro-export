import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { CustomerModel } from '@/lib/models/Customer';

export const runtime = 'nodejs';

/* ================= GET CUSTOMERS ================= */

export async function GET() {
  try {
    await connectDB();

    const customers = await CustomerModel.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(customers);
  } catch (err: any) {
    console.error('GET CUSTOMERS ERROR:', err);

    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: err?.message || 'unknown',
      },
      { status: 500 }
    );
  }
}

/* ================= CREATE CUSTOMER ================= */

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      fullName,
      contactNo,
      email,
      address,
      country,
      state,
      city,
      pin,
      referenceName,
      referenceContact,
    } = body;

    /* ===== VALIDATION ===== */

    if (
      !fullName ||
      !contactNo ||
      !email ||
      !address ||
      !country ||
      !state ||
      !city ||
      !pin
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    /* ===== CREATE CUSTOMER ===== */

    const customer = await CustomerModel.create({
      fullName,
      contactNo,
      email,
      address,
      country,
      state,
      city,
      pin,
      referenceName,
      referenceContact,
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (err: any) {
    console.error('CREATE CUSTOMER ERROR:', err);

    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: err?.message || 'unknown',
      },
      { status: 500 }
    );
  }
}
