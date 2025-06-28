// app/shop/page.js
"use client";
import { useEffect, useState } from "react";
import Banner from "@/components/shop/Banner";
import SearchBar from "@/components/shop/SearchBar";
import ProductList from "@/components/shop/ProductList";
import ProductCart from "@/components/shop/ProductCart";
import { fetchProducts } from "@/api_services/product";

export default function ShopPage() {
  const [activeShopView, setActiveShopView] = useState("productList");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCartClick = () => {
    setActiveShopView("cart");
  };

  const handleBackToShopping = () => {
    setActiveShopView("productList");
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Banner và SearchBar chỉ hiển thị trên trang danh sách sản phẩm */}
      {activeShopView === "productList" && (
        <>
          <Banner />
          <SearchBar />
          <div className="mt-5">
            <ProductList products={products} />
          </div>
        </>
      )}

      {/* ProductCart hiển thị khi activeShopView là "cart" */}
      {activeShopView === "cart" && (
        <ProductCart onBackToShopping={handleBackToShopping} />
      )}
    </>
  );
}