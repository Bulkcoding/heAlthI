export async function GET() {
  return Response.json({
    ok: true,
    service: "planfit-web",
    timestamp: new Date().toISOString()
  });
}
