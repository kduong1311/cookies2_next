// app/shop/[id]/page.js
"use client";
import { useRouter } from 'next/navigation';
import ProductDetail from '@/components/shop/ProductDetail';
import { use } from "react";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const { id: productId } = use(params);

  const handleBack = () => {
    router.push('/shop');
  };

  return (
    <ProductDetail
      productId={productId}
      onBack={handleBack}
    />
  );
}