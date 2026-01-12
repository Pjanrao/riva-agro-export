import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import clientPromise from "@/lib/mongodb";
import { sendEnquiryMail } from "@/lib/mail/send-enquiry-mail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.email || !data.productName || !data.name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // ✅ Save to DB
    await db.collection("enquiries").insertOne({
      ...data,
      createdAt: new Date(),
    });

    // 📧 SEND EMAIL TO ADMIN
    await sendEnquiryMail({
      productName: data.productName,
      category: data.category,
      name: data.name,
      email: data.email,
      phone: data.phone,
      quantity: data.quantity,
      message: data.message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enquiry error:", error);
    return NextResponse.json(
      { message: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
