export function createCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-wallet-address, Authorization",
    "Access-Control-Max-Age": "86400",
  }
}

export function handleCorsPreFlight(req: Request): Response | null {
  // Check for CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("OK", {
      status: 200,
      headers: createCorsHeaders(),
    })
  }
  return null
}

export function createResponseWithCors(body: string | BodyInit, init?: ResponseInit): Response {
  const headers = {
    ...createCorsHeaders(),
    ...(init?.headers || {}),
  }

  return new Response(body, {
    ...init,
    headers,
  })
}

