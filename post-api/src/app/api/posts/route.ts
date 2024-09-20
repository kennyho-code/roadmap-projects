// curl -X GET  http://localhost:3000/api/posts
async function GET(request: Request) {
  return Response.json({ message: "sucess" });
}

// curl -X POST "https://api.example.com/users" \
//      -H "Content-Type: application/json" \
//      -d '{"name": "John Doe", "email": "john@example.com"}'
async function POST(request: Request) {
  return Response.json({ message: "sucess" });
}

// curl -X PUT "http://localhost:3000/api/posts" \
//      -H "Content-Type: application/json" \
//      -d '{"name": "John Updated", "email": "john_updated@example.com"}
async function PUT(request: Request) {
  return Response.json({ message: "sucess" });
}

// curl -X DELETE http://localhost:3000/api/posts
async function DELETE(request: Request) {
  return Response.json({ message: "sucess" });
}

export { GET, POST, PUT, DELETE };
