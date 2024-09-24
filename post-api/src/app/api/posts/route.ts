import supabase from "@/utils/supabase";
import { NextRequest } from "next/server";

/*
curl -X GET "http://localhost:3000/api/posts?id=1"
*/
async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  const getPostQuery = supabase.from("posts").select().eq("id", id);
  const { data, error } = await getPostQuery;

  // TODO: handle error

  // TODO: return data
  return Response.json({ message: "sucess" });
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

  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, category, tags })
    .select();

  // TODO: do something with data

  // TODO: handle error
  return Response.json({ message: "sucess" });
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
  // only allow to update title for now
  const { id, title: newTitle } = body;

  console.log("newTitle", newTitle);

  const { data, error } = await supabase
    .from("posts")
    .update({ title: newTitle })
    .eq("id", id)
    .select();

  // TODO: do something with error
  console.log("data: ", data);

  // TODO: handle error
  return Response.json({ message: "sucess" });
}

/*
curl -X DELETE "http://localhost:3000/api/posts?id=1"
*/

async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select();

  // TODO: do something with data
  console.log("data: ", data);

  // TODO: handle error;

  return Response.json({ message: "sucess" });
}

export { GET, POST, PUT, DELETE };
