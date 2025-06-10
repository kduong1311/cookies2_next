// app/shop/[id]/page.js
"use client"; // Đánh dấu là Client Component nếu ProductDetail có tương tác
import { useRouter } from 'next/navigation'; // Dùng useRouter để quay lại
import ProductDetail from '@/components/shop/ProductDetail';

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const productId = params.id; // Lấy ID sản phẩm từ URL

  // Hàm để quay lại trang danh sách sản phẩm
  const handleBack = () => {
    router.push('/shop'); // Điều hướng về trang /shop
  };

  return (
    <ProductDetail
      productId={productId}
      onBack={handleBack} // Truyền hàm quay lại cho ProductDetail
    />
  );
}
