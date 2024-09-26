import { decrypt } from "@/utils/session";
import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

async function getUserId(request: NextRequest) {
  const headers = request.headers;
  const token = headers.get("Authorization")?.split(" ")[1];
  const payload = await decrypt(token);
  return payload?.id;
}

async function POST(request: NextRequest) {
  const { amount, description, date } = await request.json();

  const userId = await getUserId(request);

  const dateISO = new Date(date).toISOString();

  const insertExpenseQuery = supabase
    .from("expenses")
    .insert({
      user_id: userId,
      amount,
      description,
      date: dateISO,
    })
    .select();

  const { data, error } = await insertExpenseQuery;

  if (error) {
    return NextResponse.json({ message: "error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data });
}

export { POST };
