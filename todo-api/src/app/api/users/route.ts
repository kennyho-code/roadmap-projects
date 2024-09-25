import supabase from "@/utils/supabase";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const id = params.get("id");
  const userQuery = supabase.from("users").select();
  const { data, error } = await userQuery;
  if (error) {
    return NextResponse.json({ message: "An error occured" }, { status: 500 });
  }
  return NextResponse.json({ message: "Success" });
}

async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const insertUserQuery = supabase
    .from("users")
    .insert({
      username,
      email,
      password_hash: hashedPassword,
    })
    .select("username");

  const { data, error } = await insertUserQuery;
  if (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occured" }, { status: 500 });
  }
  return NextResponse.json({ message: "Success", data });
}

export { GET, POST };
