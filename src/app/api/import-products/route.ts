import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ImportProduct } from '@/lib/models/ImportProduct';
import { getCategories } from '@/lib/models/Category';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';
export const maxDuration = 300;

/* ================= CLOUDINARY CONFIG ================= */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* ================= GET ================= */

export async function GET() {
  await connectDB();
  const data = await ImportProduct.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

/* ================= POST (ADD) ================= */

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const categoryId = String(formData.get('categoryId'));
    const productName = String(formData.get('productName'));

    const totalQuantity = Number(formData.get('totalQuantity'));
    const purchasePrice = Number(formData.get('purchasePrice'));
    const shippingCost = Number(formData.get('shippingCost'));
    const taxAmount = Number(formData.get('taxAmount'));

    if (!categoryId || !productName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const categories = await getCategories();
    const category = categories.find(
      (c: any) => String(c.id) === String(categoryId)
    );

    const files = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      const upload = await cloudinary.uploader.upload(dataUri, {
        folder: 'import-products',
      });

      imageUrls.push(upload.secure_url);
    }

    const saved = await ImportProduct.create({
      categoryId,
      categoryName: category?.name || '—',
      productName,
      totalQuantity,
      purchasePrice,
      shippingCost,
      taxAmount,
      images: imageUrls,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    console.error('IMPORT PRODUCT CREATE ERROR:', err);
    return NextResponse.json(
      { message: 'Internal Server Error', error: err?.message },
      { status: 500 }
    );
  }
}

/* ================= PUT (EDIT) ================= */

export async function PUT(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const id = String(formData.get('id'));
    if (!id) {
      return NextResponse.json(
        { message: 'Valid ID is required' },
        { status: 400 }
      );
    }

    const categoryId = String(formData.get('categoryId'));
    const productName = String(formData.get('productName'));

    const totalQuantity = Number(formData.get('totalQuantity'));
    const purchasePrice = Number(formData.get('purchasePrice'));
    const shippingCost = Number(formData.get('shippingCost'));
    const taxAmount = Number(formData.get('taxAmount'));

    const categories = await getCategories();
    const category = categories.find(
      (c: any) => String(c.id) === String(categoryId)
    );

    /* ===== EXISTING IMAGES ===== */
    let images: string[] = [];
    const existingImagesRaw = formData.get('existingImages');
    if (existingImagesRaw) {
      images = JSON.parse(String(existingImagesRaw));
    }

    /* ===== NEW UPLOADS ===== */
    const files = formData.getAll('images') as File[];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      const upload = await cloudinary.uploader.upload(dataUri, {
        folder: 'import-products',
      });

      images.push(upload.secure_url);
    }

    const updated = await ImportProduct.findByIdAndUpdate(
      id,
      {
        categoryId,
        categoryName: category?.name || '—',
        productName,
        totalQuantity,
        purchasePrice,
        shippingCost,
        taxAmount,
        images,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Import not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('IMPORT PRODUCT UPDATE ERROR:', err);
    return NextResponse.json(
      { message: 'Internal Server Error', error: err?.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { message: 'ID is required' },
      { status: 400 }
    );
  }

  await ImportProduct.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
