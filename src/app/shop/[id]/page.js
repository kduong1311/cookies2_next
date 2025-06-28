// app/shop/[id]/page.js
"use client";
import { useRouter } from 'next/navigation';
import ProductDetail from '@/components/shop/ProductDetail';

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const productId = params.id;

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