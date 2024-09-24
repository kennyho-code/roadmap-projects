import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

/*
curl -X GET "http://localhost:3000/api/posts?id=1"
*/
async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const term = searchParams.get("term");

  const getPostQuery = supabase.from("posts").select();
  const response = await getPostQuery;

  if (response.error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  let posts = response.data;
  if (term) {
    posts = posts.filter((post) => {
      return (
        post.title.includes(term) ||
        post.content.includes(term) ||
        post.tags.some((tag: string) => tag.includes(term))
      );
    });
  }

  return Response.json({ message: "sucess", data: posts });
}

/*
curl -X POST "http://localhost:3000/api/posts" \
-H "Content-Type: application/json" \
-d '{
  "title": "Post 1",
  "content": "Some Random content",
  "category": "cat1",
  "tags": [
    "cat1"
  ]
}'
*/
async function POST(request: Request) {
  const body = await request.json();
  const { title, content, category, tags } = body;

  const response = await supabase
    .from("posts")
    .insert({ title, content, category, tags })
    .select();

  if (response.error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
  return Response.json({ message: "sucess", data: response.data });
}

/*
curl -X PUT "http://localhost:3000/api/posts" \
-H "Content-Type: application/json" \
-d '{
  "title": "Post 1 Updated",
  "id": 1
}'
*/

async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, content, category, tags } = body;

  const response = await supabase
    .from("posts")
    .update({ title, content, category, tags })
    .eq("id", id)
    .select();

  if (response.error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
  return Response.json({ message: "success", data: response.data });
}

/*
curl -X DELETE "http://localhost:3000/api/posts?id=1"
*/

async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  const response = await supabase.from("posts").delete().eq("id", id).select();

  if (response.error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  return Response.json({ message: "sucess", data: response.data });
}

export { GET, POST, PUT, DELETE };
