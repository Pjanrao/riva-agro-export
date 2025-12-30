import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/models/Product";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 300;

console.log("VERSION: CLOUDINARY ONLY - 30 DEC");

/* ================= GET PRODUCTS ================= */
/*
  - Products store `category` as ObjectId
  - Frontend may pass `categoryId`
*/

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  let products = await getProducts();

  if (categoryId) {
    products = products.filter(
      (p: any) => String(p.category) === String(categoryId)
    );
  }

  return NextResponse.json(products);
}

/* ================= CREATE PRODUCT ================= */

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/products HIT");

    const data = await req.formData();

    const name = data.get("name")?.toString().trim();
    const description = data.get("description")?.toString().trim();
    const category = data.get("category")?.toString().trim(); // ✅ ObjectId string
    const hsCode = data.get("hsCode")?.toString().trim();

    const minOrderQty = data.get("minOrderQty")?.toString().trim();
    const discountedPrice = Number(data.get("discountedPrice"));
    const sellingPrice = Number(data.get("sellingPrice"));

    const featured = data.get("featured") === "true";
    const status =
      data.get("status") === "inactive" ? "inactive" : "active";

    const images = data.getAll("images") as File[];

    console.log("FIELDS:", {
      name,
      category,
      imagesCount: images.length,
    });

    /* ================= VALIDATION ================= */

    if (
      !name ||
      !description ||
      !category ||
      !hsCode ||
      !minOrderQty ||
      isNaN(discountedPrice) ||
      isNaN(sellingPrice) ||
      !images.length
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= IMAGE UPLOAD (CLOUDINARY) ================= */

    const imageUrls: string[] = [];

    for (const image of images) {
      if (!image || image.size === 0) continue;

      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Image too large (max 5MB)" },
          { status: 400 }
        );
      }

      console.log("Uploading:", image.name, image.size);

      const buffer = Buffer.from(await image.arrayBuffer());
      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

      const uploadRes = await cloudinary.uploader.upload(base64, {
        folder: "products",
      });

      imageUrls.push(uploadRes.secure_url);
    }

    if (!imageUrls.length) {
      return NextResponse.json(
        { message: "Image upload failed" },
        { status: 400 }
      );
    }

    /* ================= SAVE PRODUCT ================= */

    console.log("Saving product to DB");

    const product = await createProduct({
      name,
      description,
      category, // ✅ ObjectId string (model converts)
      hsCode,
      minOrderQty,
      discountedPrice,
      sellingPrice,
      images: imageUrls,
      primaryImage: imageUrls[0],
      featured,
      status,
    });

    console.log("Product saved:", product?.id);

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("PRODUCT CREATE ERROR:", err);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
