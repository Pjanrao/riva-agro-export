import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/models/Product";
import { getCategories } from "@/lib/models/Category";
// import { writeFile, mkdir } from "fs/promises";
// import { join } from "path";
import cloudinary from "@/lib/cloudinary";
console.log("VERSION: CLOUDINARY ONLY - 30 DEC");


/* ================= GET ALL / BY CATEGORY ================= */
/*
  IMPORTANT:
  - Products store `category` as CATEGORY NAME (string)
  - Import Product sends `categoryId` (_id)
  - So we must map: categoryId → category.name
*/
export const runtime = "nodejs";
export const maxDuration = 300;     

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  let products = await getProducts();

  if (categoryId) {
    const categories = await getCategories();

    // ✅ Correct comparison: Mongo _id ↔ categoryId
    const category = categories.find(
      (c: any) => String(c._id) === String(categoryId)
    );

    if (!category) {
      return NextResponse.json([]);
    }

    // ✅ Filter products by CATEGORY NAME
    products = products.filter(
      (p: any) => p.category === category.name
    );
  }

  return NextResponse.json(products);
}

/* ================= CREATE PRODUCT ================= */
/*
  NOTE:
  - Category is saved as CATEGORY NAME (not id)
  - This matches existing DB structure
*/

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/products HIT");

    const data = await req.formData();

    const name = data.get("name")?.toString().trim();
    const description = data.get("description")?.toString().trim();
    const category = data.get("category")?.toString().trim();
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

    /* ================= IMAGE UPLOAD ================= */

    const imageUrls: string[] = [];

    for (const image of images) {
      if (image.size === 0) continue;

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

      console.log("Uploaded:", uploadRes.secure_url);

      imageUrls.push(uploadRes.secure_url);
    }

    if (!imageUrls.length) {
      return NextResponse.json(
        { message: "Image upload failed" },
        { status: 400 }
      );
    }

    /* ================= CREATE PRODUCT ================= */

    console.log("Saving product to DB");

    const product = await createProduct({
      name,
      description,
      category,
      hsCode,
      minOrderQty,
      discountedPrice,
      sellingPrice,
      images: imageUrls,
      primaryImage: imageUrls[0],
      featured,
      status,
    });

    console.log("Product saved:", product?._id);

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("PRODUCT CREATE ERROR:", err);

    return NextResponse.json(
      { message: "Internal Server Error", error: err?.message },
      { status: 500 }
    );
  }
}
