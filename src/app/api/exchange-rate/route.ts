// src/app/api/exchange-rate/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  const data = await res.json(); // JSON with rates
  return NextResponse.json(data);
}
