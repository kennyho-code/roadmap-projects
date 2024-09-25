import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  const userQuery = supabase
    .from("users")
    .select("password_hash")
    .eq("email", email)
    .single();

  const { data, error } = await userQuery;
  if (error) {
    return NextResponse.json(
      { message: "Invalid Email and/or Password" },
      { status: 401 },
    );
  }

  const passwordHash = data.password_hash;

  const isValid = await bcrypt.compare(password, passwordHash);

  if (isValid) {
    return NextResponse.json({ message: "Correct Password!" });
  } else {
    return NextResponse.json({ message: "Invalid Password" }, { status: 401 });
  }

  return NextResponse.json({ message: "success" });
}

export { POST };
