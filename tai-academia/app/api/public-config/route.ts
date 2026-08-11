import { readPublicRuntimeConfig } from "@/lib/public-runtime-config";

export async function GET(request: Request) {
  const experiment = new URL(request.url).searchParams.get("experiment") ?? "";
  const config = readPublicRuntimeConfig(
    process.env as Record<string, unknown>,
    experiment,
  );

  if (!config) {
    return Response.json(
      {
        analyticsEnabled: false,
        captureEnabled: false,
        capturePrivacyUrl: null,
        orderingEnabled: false,
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}
