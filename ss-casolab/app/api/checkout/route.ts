export async function GET() {
  return Response.json(
    {
      configured: false,
      checkoutUrl: null,
      captureEnabled: false,
      message:
        "El checkout alojado está retirado. Usa el flujo de pedido propio cuando esté autorizado.",
    },
    {
      status: 410,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
