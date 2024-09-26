import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const getUserQuery = supabase.from("users").select().eq("id", id).single();

  const { data, error } = await getUserQuery;
  if (error) {
    console.log("error: ", error);
    throw NextResponse.json({ message: "error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data });
}

export { GET };
