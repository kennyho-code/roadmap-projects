import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const createUserQuery = supabase
    .from("users")
    .insert({ email, password: hashedPassword })
    .select("email");

  const { data, error } = await createUserQuery;
  if (error) {
    throw NextResponse.json({ message: "error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data });
}

export { POST };
