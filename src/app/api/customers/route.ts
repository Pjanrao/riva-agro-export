import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { CustomerModel } from '@/lib/models/Customer';

export const runtime = 'nodejs';

/* ================= HELPERS ================= */

const phoneRegex = /^[0-9]{10,15}$/;

/* ================= GET CUSTOMERS ================= */

export async function GET() {
  try {
    await connectDB();

    const customers = await CustomerModel.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(customers);
  } catch (err) {
    console.error('GET CUSTOMERS ERROR:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
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
      latitude,
      longitude,
      referenceName,
      referenceContact,
    } = body;

    /* -------- Required fields validation -------- */
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

    /* -------- Phone validation -------- */
    if (!phoneRegex.test(contactNo)) {
      return NextResponse.json(
        { message: 'Contact number must be 10–15 digits' },
        { status: 400 }
      );
    }

    /* -------- Duplicate check -------- */
    const existingCustomer = await CustomerModel.findOne({
      $or: [{ email }, { contactNo }],
    });

    if (existingCustomer) {
      return NextResponse.json(
        { message: 'Customer with email or contact number already exists' },
        { status: 409 }
      );
    }

    /* -------- Create customer -------- */
    const customer = await CustomerModel.create({
      fullName,
      contactNo,
      email,
      address,
      country,
      state,
      city,
      pin,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      referenceName: referenceName ?? null,
      referenceContact: referenceContact ?? null,
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    console.error('CREATE CUSTOMER ERROR:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}