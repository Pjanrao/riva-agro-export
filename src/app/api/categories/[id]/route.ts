import { NextRequest, NextResponse } from "next/server";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/lib/models/Category";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 300;

/* ================= GET CATEGORY BY ID ================= */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const category = await getCategoryById(params.id);

  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(category);
}

/* ================= UPDATE CATEGORY ================= */

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
    const updateData: any = {};

    /* ---------- fields ---------- */

    const name = formData.get("name");
    if (name) updateData.name = String(name).trim();

    updateData.featured = formData.get("featured") === "true";

    const status = formData.get("status");
    if (status === "active" || status === "inactive") {
      updateData.status = status;
    }

    /* ---------- image (optional, Cloudinary) ---------- */

    const image = formData.get("image") as File | null;

    if (image && image.size > 0) {
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Image too large (max 5MB)" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

      const uploadRes = await cloudinary.uploader.upload(base64, {
        folder: "categories",
      });

      updateData.image = uploadRes.secure_url;
    }

    /* ---------- update ---------- */

    const updated = await updateCategory(params.id, updateData);

    if (!updated) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("CATEGORY UPDATE ERROR:", err);

    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE CATEGORY ================= */

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = await deleteCategory(params.id);

  if (!success) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Category deleted successfully",
  });
}
