import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { encrypt } from "@/utils/session";

async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const getUserQuery = supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();

  const { data, error } = await getUserQuery;

  if (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }

  const hashedPassword = data.password;

  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const token = await encrypt({ id: data.id });

  return NextResponse.json({ message: "success", token }, { status: 200 });
}

export { POST };
