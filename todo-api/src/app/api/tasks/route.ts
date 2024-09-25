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
  const params = new URL(request.url).searchParams;
  const page = params.get("page");
  const limit = params.get("limit");

  const userId = await getUserId(request);

  if (page && limit) {
    const offset = (Number(page) - 1) * Number(limit);
    const take = offset + Number(limit) - 1;
    const tasksQuery = supabase
      .from("tasks")
      .select()
      .eq("user_id", userId)
      .range(offset, take);
    const { data: paginatedData, error } = await tasksQuery;

    if (error) {
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }

    return NextResponse.json({
      message: "success",
      data: paginatedData,
      page,
      limit,
      total: paginatedData.length,
    });
  }

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
  const userId = await getUserId(request);

  const tasksQuery = supabase.from("tasks").select().eq("id", id).single();
  const { data: getTaskData, error: getTaskError } = await tasksQuery;
  if (getTaskError) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
  if (getTaskData.user_id !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const taskUpdateQuery = supabase
    .from("tasks")
    .update({ title, description })
    .eq("id", id)
    .select();

  const { data, error } = await taskUpdateQuery;
  if (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data });
}

async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const userId = await getUserId(request);

  const tasksQuery = supabase.from("tasks").select().eq("id", id).single();
  const { data: getTaskData, error: getTaskError } = await tasksQuery;
  if (getTaskError) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
  if (getTaskData.user_id !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const deleteTaskQuery = supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select();
  const { data, error } = await deleteTaskQuery;

  if (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data });
}

export { GET, POST, PUT, DELETE };
