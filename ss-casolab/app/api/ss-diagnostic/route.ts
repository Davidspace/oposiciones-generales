import { readPublicSsDiagnostic } from "@/lib/ss-casolab-source";

export const runtime = "nodejs";

export async function GET() {
  const diagnostic = readPublicSsDiagnostic();
  return Response.json(diagnostic ?? { publicable: false }, {
    status: 200,
    headers: {
      "Cache-Control": diagnostic
        ? "public, max-age=300, stale-while-revalidate=3600"
        : "no-store",
    },
  });
}
