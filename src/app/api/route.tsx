// return 500 error

export async function GET(request: Request) {
  return new Response(
    JSON.stringify({
      message: "This is a GET request",
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    },
  );
}
