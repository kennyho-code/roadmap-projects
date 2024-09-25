import { decrypt } from "@/utils/session";
import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

async function getUserId(request: NextRequest) {
  const headers = request.headers;
  const authorization = headers.get("authorization");
  const token = authorization?.split(" ")[1];
  const payload = await decrypt(token);
  const userId = payload?.userId;
  return userId;
}

async function GET(request: NextRequest) {
  const userId = await getUserId(request);

  const tasksQuery = supabase.from("tasks").select().eq("user_id", userId);
  const { data, error } = await tasksQuery;

  if (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data });
}

async function POST(request: NextRequest) {
  const { title, description } = await request.json();
  const userId = await getUserId(request);

  const insertTaskQuery = supabase
    .from("tasks")
    .insert({ user_id: userId, title, description })
    .select();

  const { data, error } = await insertTaskQuery;

  if (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data });
}

async function PUT(request: NextRequest) {
  const { id, title, description } = await request.json();

  const taskUpdateQuery = supabase
    .from("tasks")
    .update({ title, description })
    .eq("id", id)
    .select();

  const { data, error } = await taskUpdateQuery;
  if (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data });
}

async function DELETE() {
  return NextResponse.json({ message: "success" });
}

export { GET, POST, PUT, DELETE };
