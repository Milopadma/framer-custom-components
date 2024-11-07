interface Env {
  // we don't need SHOPIFY_STORE_URL in env anymore since it'll be passed in request
}

export default {
  async fetch(request: Request, env: Env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type, X-Shopify-Access-Token",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    try {
      const url = new URL(request.url);
      const storeUrl = url.searchParams.get("store");

      if (!storeUrl) {
        return new Response(
          JSON.stringify({ error: "Missing store URL parameter" }), 
          { 
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            }
          }
        );
      }

      const accessToken = request.headers.get("X-Shopify-Access-Token");

      if (!accessToken) {
        return new Response(
          JSON.stringify({ error: "Missing access token" }), 
          { 
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            }
          }
        );
      }

      const shopifyUrl = `https://${storeUrl}/admin/api/2024-01/products.json`;
      
      console.log("DEBUG Fetching from:", shopifyUrl);

      const shopifyResponse = await fetch(shopifyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      });

      const response = new Response(shopifyResponse.body, {
        status: shopifyResponse.status,
        statusText: shopifyResponse.statusText,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=60", // cache for 60 seconds
        },
      });

      return response;
    } catch (error) {
      console.error("DEBUG Worker error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch products", details: error.message }), 
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
}; 