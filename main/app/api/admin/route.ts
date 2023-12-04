import { NextRequest, NextResponse } from "next/server";

let adminStatus = false;

export async function GET(req: NextRequest) {
  try {
    // Handle GET request to retrieve admin status
    return NextResponse.json({ isAdmin: adminStatus }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Handle POST request to update admin status
    adminStatus = !adminStatus; // Toggle the admin status
    return NextResponse.json({ ok: true, isAdmin: adminStatus }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
