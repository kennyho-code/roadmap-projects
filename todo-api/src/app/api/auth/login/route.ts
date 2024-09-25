import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { encrypt } from "@/utils/session";

async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  const userQuery = supabase
    .from("users")
    .select(`id, password_hash`)
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
  const userId = data.id;

  const isValid = await bcrypt.compare(password, passwordHash);

  if (isValid) {
    // Create session
    const token = await encrypt({ userId });
    return NextResponse.json({ message: "Correct Password!", token });
  } else {
    return NextResponse.json({ message: "Invalid Password" }, { status: 401 });
  }
}

export { POST };
