import { NextRequest, NextResponse } from "next/server";
import { createCategory, getCategories } from "@/lib/models/Category";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 300;

/* ================= GET (ALL / FILTERED CATEGORIES) ================= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const onlyActive = searchParams.get("onlyActive") === "true";

  const categories = await getCategories();

  // 🔹 For dropdowns: /api/categories?onlyActive=true
  // 🔹 For admin table: /api/categories
  const result = onlyActive
    ? categories.filter((c: any) => c.status === "active")
    : categories;

  return NextResponse.json(result);
}

/* ================= POST (CREATE CATEGORY) ================= */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim();
    const featured = formData.get("featured") === "true";
    const status =
      formData.get("status") === "inactive" ? "inactive" : "active";
    const image = formData.get("image") as File | null;

    /* ---------- validation ---------- */

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    if (!image || image.size === 0) {
      return NextResponse.json(
        { message: "Category image is required" },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image too large (max 5MB)" },
        { status: 400 }
      );
    }

    /* ---------- upload image (Cloudinary) ---------- */

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

    const uploadRes = await cloudinary.uploader.upload(base64, {
      folder: "categories",
    });

    /* ---------- create category ---------- */

    const newCategory = await createCategory({
      name,
      featured,
      status,
      image: uploadRes.secure_url,
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (err: any) {
    console.error("CATEGORY CREATE ERROR:", err);

    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
