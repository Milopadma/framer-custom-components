// deno-lint-ignore-file no-explicit-any
import { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
import { motion, AnimatePresence } from "framer-motion";

// types should ideally be in types/ folder
interface ShopifyProductsProps {
  backgroundColor: string;
  fontFamily: string;
  textColor: string;
  accentColor: string;
  itemsPerRow: number;
  storeUrl: string;
  adminApiAccessToken: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  availableForSale: boolean;
}

const getGridColumns = (itemsPerRow: number, width: number): number => {
  if (width < 640) return 1; 
  if (width < 1024) return 2; 
  return itemsPerRow; 
};

const LOADING_MESSAGES: string[] = [
  "Summoning products from the digital realm...",
  "Teaching pixels how to display products...",
  "Convincing servers to share their secrets...",
  "Brewing up some fresh inventory...",
  "Dusting off the digital shelves...",
  "Herding virtual shopping carts...",
  "Polishing product images to perfection...",
  "Negotiating with the API gods...",
  "Calculating best deals in parallel universes...",
  "Untangling the web of products..."
];

const randomLoadingMessage = (): string => {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
};

export default function ShopifyProducts({
  backgroundColor,
  fontFamily,
  textColor,
  accentColor,
  itemsPerRow = 3,
  adminApiAccessToken,
  storeUrl,
}: ShopifyProductsProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [windowWidth, setWindowWidth] = useState<number>(1200); 

  useEffect(() => {
    const handleResize = (): void => {
      setWindowWidth(globalThis.innerWidth);
    };

    handleResize();

    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const encodedStoreUrl = encodeURIComponent(storeUrl);
        const response = await fetch(
          `https://shopify-proxy.milopadma.workers.dev?store=${encodedStoreUrl}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": adminApiAccessToken
            }
          }
        );

        console.log("DEBUG Shopify response status:", response.status);
        console.log("DEBUG Shopify response headers:", Object.fromEntries(response.headers));

        if (!response.ok) {
          const errorText = await response.text(); 
          console.log("DEBUG Shopify error response text:", errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            console.log("DEBUG Shopify error data:", errorData);
          } catch (e) {
            console.log("DEBUG Shopify error parsing failed:", e);
          }
          
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("DEBUG Shopify admin API response:", data);

        const transformedProducts = data.products
          .filter((product: any) => product.status === "active")
          .map((product: any) => ({
            id: product.id,
            title: product.title,
            handle: product.handle,
            description: product.body_html ?? "",
            priceRange: {
              minVariantPrice: {
                amount: product.variants[0]?.price ?? "0",
                currencyCode: "USD"
              }
            },
            images: {
              edges: product.images.map((image: any) => ({
                node: {
                  url: image.src,
                  altText: image.alt ?? product.title
                }
              }))
            },
            availableForSale: product.variants.some((v: any) => 
              v.inventory_quantity > 0 && 
              v.inventory_management === "shopify"
            )
          }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error("DEBUG Shopify admin API fetch error:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [storeUrl, adminApiAccessToken]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      backgroundColor: backgroundColor,
      fontFamily: fontFamily,
      padding: windowWidth < 640 ? '1rem' : '2rem',
      overflowY: 'auto', 
      WebkitOverflowScrolling: 'touch' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        minHeight: '100%'
      }}>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-[16rem] w-full"
          >
            <div className="flex flex-col items-center justify-center w-full max-w-md">
              <motion.div
                style={{
                  width: '100%',
                  height: '4px',
                  background: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: '100%',
                    transition: {
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity
                    }
                  }}
                  style={{
                    height: '100%',
                    background: accentColor,
                    borderRadius: '2px'
                  }}
                />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  color: textColor, 
                  marginTop: '1rem',
                  letterSpacing: '-0.05em',
                  textAlign: 'center'
                }}
              >
                {randomLoadingMessage()}
              </motion.p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: '#FEE2E2',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}
          >
            <p style={{ color: '#EF4444', textAlign: 'center' }}>{error}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${getGridColumns(itemsPerRow, windowWidth)}, 1fr)`,
              gap: windowWidth < 640 ? '1rem' : '1.5rem'
            }}
          >
            <AnimatePresence>
              {products.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1]
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                    {product.images.edges[0] && (
                      <motion.img
                        src={product.images.edges[0].node.url}
                        alt={product.images.edges[0].node.altText ?? product.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
                        }}
                      />
                    )}
                    {!product.availableForSale && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          backgroundColor: '#EF4444',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        Sold Out
                      </motion.div>
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ 
                      color: textColor,
                      marginBottom: '0.5rem',
                      fontSize: windowWidth < 640 ? '0.875rem' : '1rem',
                      fontWeight: 500,
                      letterSpacing: '-0.01em'
                    }}>
                      {product.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: windowWidth < 640 ? 'column' : 'row',
                      alignItems: windowWidth < 640 ? 'stretch' : 'center',
                      justifyContent: 'space-between',
                      gap: windowWidth < 640 ? '0.75rem' : '0'
                    }}>
                      <p style={{ 
                        color: accentColor,
                        fontSize: windowWidth < 640 ? '1rem' : '1.125rem',
                        fontWeight: 'bold',
                        textAlign: windowWidth < 640 ? 'center' : 'left'
                      }}>
                        {`${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          backgroundColor: accentColor,
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          border: 'none',
                          cursor: 'pointer',
                          width: windowWidth < 640 ? '100%' : 'auto'
                        }}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

addPropertyControls(ShopifyProducts, {
  storeUrl: {
    type: ControlType.String,
    title: "Store URL",
    defaultValue: "quickstart-c79c59ef.myshopify.com",
    description: "Enter your Shopify store URL here. For example: quickstart-c79c59ef.myshopify.com",
  },
  adminApiAccessToken: {
    type: ControlType.String,
    title: "Admin API Access Token",
    defaultValue: "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",
    description: "Enter your Shopify admin API access token here. It should start with 'shpat_'.",
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#ffffff",
  },
  fontFamily: {
    type: ControlType.String,
    title: "Font Family",
    defaultValue: "Inter, sans-serif",
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#000000",
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent Color",
    defaultValue: "#4F46E5",
  },
  itemsPerRow: {
    type: ControlType.Number,
    title: "Items Per Row",
    defaultValue: 3,
    min: 1,
    max: 4,
    step: 1,
  },
});
