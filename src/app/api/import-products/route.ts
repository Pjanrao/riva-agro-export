import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ImportProduct } from '@/lib/models/ImportProduct';
import { getCategories } from '@/lib/models/Category';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

/* ================= GET ================= */

export async function GET() {
  await connectDB();
  return NextResponse.json(
    await ImportProduct.find().sort({ createdAt: -1 })
  );
}

/* ================= POST (ADD) ================= */

export async function POST(req: Request) {
  await connectDB();
  const formData = await req.formData();

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

  const files = formData.getAll('images') as File[];

  const imageUrls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary in serverless environment
    try {
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'import-products',
        use_filename: true,
        unique_filename: false,
      });

      imageUrls.push(result.secure_url || result.url);
    } catch (err) {
      // Fallback: attempt to write to disk (dev only)
      const uploadDir = join(process.cwd(), 'public/uploads/import-products');
      await mkdir(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${file.name}`;
      await writeFile(join(uploadDir, filename), buffer);
      imageUrls.push(`/uploads/import-products/${filename}`);
    }
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
}

/* ================= PUT (EDIT) — FIXED ================= */

export async function PUT(req: Request) {
  await connectDB();
  const formData = await req.formData();

  const id = String(formData.get('id'));

  if (!id || id === 'null' || id === 'undefined') {
    return NextResponse.json(
      { message: 'Valid Import ID is required' },
      { status: 400 }
    );
  }

  const categoryId = String(formData.get('categoryId'));
  const productName = String(formData.get('productName'));

  if (!categoryId || !productName) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  const totalQuantity = Number(formData.get('totalQuantity'));
  const purchasePrice = Number(formData.get('purchasePrice'));
  const shippingCost = Number(formData.get('shippingCost'));
  const taxAmount = Number(formData.get('taxAmount'));

  const categories = await getCategories();
  const category = categories.find(
    (c: any) => String(c.id) === String(categoryId)
  );

  /* ===== 🔑 IMAGE FIX START ===== */

  // 1️⃣ Parse existingImages (even empty array)
  let existingImages: string[] = [];

  const existingImagesRaw = formData.get('existingImages');
  if (existingImagesRaw) {
    existingImages = JSON.parse(String(existingImagesRaw));
  }

  // 2️⃣ Handle new uploads
  const files = formData.getAll('images') as File[];

  if (files.length > 0) {
    for (const file of files) {
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      try {
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'import-products',
          use_filename: true,
          unique_filename: false,
        });

        existingImages.push(result.secure_url || result.url);
      } catch (err) {
        const uploadDir = join(process.cwd(), 'public/uploads/import-products');
        await mkdir(uploadDir, { recursive: true });
        const filename = `${Date.now()}-${file.name}`;
        await writeFile(join(uploadDir, filename), buffer);
        existingImages.push(`/uploads/import-products/${filename}`);
      }
    }
  }

  /* ===== 🔑 IMAGE FIX END ===== */

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
      images: existingImages, // ✅ ALWAYS overwrite
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
