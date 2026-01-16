import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import type { User } from "@/lib/types";

interface JwtPayload {
  id: string;
}

function toUser(doc: any): User {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toHexString() };
}

export async function PUT(req: Request) {
  try {
    /* ---------- AUTH ---------- */
  const cookieStore = await cookies();
const token = cookieStore.get("auth_token")?.value;

console.log("TOKEN:", token);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (!ObjectId.isValid(decoded.id)) {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }

    /* ---------- BODY ---------- */
    const body = await req.json();
    const {
      name,
      contactNo,
      country,
      state,
      city,
      address,
      pincode,
      latitude,
      longitude,
      referenceName,
      referenceContact,
    } = body;

    const profileCompleted =
      !!contactNo &&
      !!country &&
      !!state &&
      !!city &&
      !!address &&
      !!pincode;
      

    /* ---------- DB ---------- */
    const client = await clientPromise;
    const db = client.db();

    // ✅ IMPORTANT: no User type here
    const users = db.collection("users");

    await users.updateOne(
      { _id: new ObjectId(decoded.id) },
      {
        $set: {
          name,
          contactNo,
          country,
          state,
          city,
          address,       
          pincode,
          latitude,
          longitude,
          referenceName,
          referenceContact,
          profileCompleted,
          updatedAt: new Date(),
        },
      }
    );

    const updatedUser = await users.findOne({
      _id: new ObjectId(decoded.id),
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: toUser(updatedUser) });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
