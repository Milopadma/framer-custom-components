export default {
  async fetch(request: Request) {
    // handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type, X-Shopify-Access-Token",
        },
      });
    }

    const url = new URL(request.url);
    const shopifyUrl = `https://quickstart-c79c59ef.myshopify.com/admin/api/2024-01/products.json`;

    const shopifyResponse = await fetch(shopifyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": request.headers.get("X-Shopify-Access-Token") || "",
      },
    });

    const response = new Response(shopifyResponse.body, shopifyResponse);
    
    // add CORS headers to response
    response.headers.set("Access-Control-Allow-Origin", "*");
    
    return response;
  },
}; 