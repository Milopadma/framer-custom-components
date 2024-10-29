import React, { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
import { motion, AnimatePresence } from "framer-motion";

// types should ideally be in types/ folder
interface ShopifyProductsProps {
  storefrontAccessToken: string;
  backgroundColor: string;
  fontFamily: string;
  textColor: string;
  accentColor: string;
  itemsPerRow: number;
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

export default function ShopifyProducts({
  storefrontAccessToken,
  backgroundColor,
  fontFamily,
  textColor,
  accentColor,
  itemsPerRow = 3,
}: ShopifyProductsProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const response = await fetch(
          "https://pubkey.myshopify.com/api/2024-01/graphql.json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
            },
            body: JSON.stringify({
              query: `
                                {
                                    products(first: 10) {
                                        edges {
                                            node {
                                                id
                                                title
                                                handle
                                                description
                                                priceRange {
                                                    minVariantPrice {
                                                        amount
                                                        currencyCode
                                                    }
                                                }
                                                images(first: 1) {
                                                    edges {
                                                        node {
                                                            url
                                                            altText
                                                        }
                                                    }
                                                }
                                                availableForSale
                                            }
                                        }
                                    }
                                }
                            `,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.products.edges.map((edge: any) => edge.node));
      } catch (err) {
        console.error("DEBUG Shopify fetch error:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [storefrontAccessToken]);

  return (
    <div style={{ ...containerStyle, backgroundColor, fontFamily }}>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={loadingStyle}
        >
          Loading products...
        </motion.div>
      ) : error ? (
        <div style={{ ...errorStyle, color: textColor }}>{error}</div>
      ) : (
        <div
          style={{
            ...gridStyle,
            gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
          }}
        >
          <AnimatePresence>
            {products.map((product: Product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.05 }}
                style={productCardStyle}
              >
                {product.images.edges[0] && (
                  <img
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText ?? product.title}
                    style={imageStyle}
                  />
                )}
                <h3 style={{ ...titleStyle, color: textColor }}>
                  {product.title}
                </h3>
                <p style={{ ...priceStyle, color: accentColor }}>
                  {`${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`}
                </p>
                {!product.availableForSale && (
                  <span style={soldOutBadgeStyle}>Sold Out</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

addPropertyControls(ShopifyProducts, {
  storefrontAccessToken: {
    type: ControlType.String,
    title: "Storefront Access Token",
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

const containerStyle: React.CSSProperties = {
  padding: "40px",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gap: "32px",
  width: "100%",
};

const productCardStyle: React.CSSProperties = {
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  backgroundColor: "white",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
};

const titleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "12px",
};

const priceStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 12px 12px",
};

const loadingStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "40px",
  fontSize: "18px",
};

const errorStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "40px",
  color: "#EF4444",
  fontSize: "18px",
};

const soldOutBadgeStyle: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "12px",
  backgroundColor: "#EF4444",
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "bold",
};
