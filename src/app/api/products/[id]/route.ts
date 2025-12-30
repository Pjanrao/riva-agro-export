import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/models/Product";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 300;

/* ================= GET BY ID ================= */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await getProductById(params.id);
  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

/* ================= UPDATE PRODUCT ================= */

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.formData();

    const updates: any = {};
    const images = data.getAll("images") as File[];

    // text fields
    ["name", "description", "category", "hsCode", "minOrderQty"].forEach(
      (f) => {
        const v = data.get(f);
        if (v !== null) updates[f] = v.toString();
      }
    );

    if (data.get("discountedPrice"))
      updates.discountedPrice = Number(data.get("discountedPrice"));

    if (data.get("sellingPrice"))
      updates.sellingPrice = Number(data.get("sellingPrice"));

    if (data.get("status"))
      updates.status =
        data.get("status") === "inactive" ? "inactive" : "active";

    updates.featured = data.get("featured") === "true";

    /* ===== IMAGE UPDATE (CLOUDINARY) ===== */

    if (images.length) {
      const imageUrls: string[] = [];

      for (const image of images) {
        if (!image || image.size === 0) continue;

        const buffer = Buffer.from(await image.arrayBuffer());
        const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

        const uploadRes = await cloudinary.uploader.upload(base64, {
          folder: "products",
        });

        imageUrls.push(uploadRes.secure_url);
      }

      updates.images = imageUrls;
      updates.primaryImage = imageUrls[0];
    }

    const updated = await updateProduct(params.id, updates);

    if (!updated) {
      return NextResponse.json({ message: "Update failed" }, { status: 400 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PRODUCT UPDATE ERROR:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE PRODUCT ================= */

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ok = await deleteProduct(params.id);
  return NextResponse.json({ success: ok });
}
