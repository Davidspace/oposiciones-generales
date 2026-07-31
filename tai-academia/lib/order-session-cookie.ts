const COOKIE_NAME = "__Host-ss_order_lookup";
const LOOKUP_TOKEN_PATTERN = /^[a-f0-9]{64}$/;

function boundedMaxAge(expiresAt: string, now: Date): number {
  const seconds = Math.floor((Date.parse(expiresAt) - now.getTime()) / 1_000);
  return Math.max(0, Math.min(seconds, 7 * 24 * 60 * 60));
}

export function createOrderLookupCookie(
  token: string,
  expiresAt: string,
  now = new Date(),
): string {
  if (!LOOKUP_TOKEN_PATTERN.test(token) || Number.isNaN(Date.parse(expiresAt))) {
    throw new TypeError("Credenciales de pedido no válidas.");
  }
  const maxAge = boundedMaxAge(expiresAt, now);
  return [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
  ].join("; ");
}

export function readOrderLookupCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName !== COOKIE_NAME) continue;
    const value = rawValue.join("=");
    return LOOKUP_TOKEN_PATTERN.test(value) ? value : null;
  }
  return null;
}

export function authorizeOrderRequestFromCookie(request: Request): Request {
  const token = readOrderLookupCookie(request.headers.get("cookie"));
  if (!token) return request;
  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return new Request(request, { headers });
}

export async function secureCreateOrderResponse(
  response: Response,
  now = new Date(),
): Promise<Response> {
  if (!response.ok) return response;

  const body = (await response.json()) as Record<string, unknown>;
  const token = body.lookupToken;
  const order = body.order as Record<string, unknown> | undefined;
  if (
    typeof token !== "string" ||
    !LOOKUP_TOKEN_PATTERN.test(token) ||
    typeof order?.expiresAt !== "string"
  ) {
    return Response.json(body, {
      status: response.status,
      headers: response.headers,
    });
  }

  delete body.lookupToken;
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.append(
    "Set-Cookie",
    createOrderLookupCookie(token, order.expiresAt, now),
  );
  return Response.json(body, { status: response.status, headers });
}
