"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";

import React from "react";
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Unwrap params using React.use()
  const actualParams = React.use(params);
  const productId = actualParams?.id;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          setError("Product not found");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }
  if (error || !product) {
    return <div className="container mx-auto px-4 py-8">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  );
}
