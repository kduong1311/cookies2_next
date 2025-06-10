// app/shop/page.js
"use client"; // Đánh dấu là Client Component vì có useState và tương tác người dùng
import { useEffect, useState } from "react";
import Banner from "@/components/shop/Banner";
import SearchBar from "@/components/shop/SearchBar";
import ProductList from "@/components/shop/ProductList";
import ProductCart from "@/components/shop/ProductCart";
import { fetchPost } from "@/api_services/test_post";

export default function ShopPage() {

  const [activeShopView, setActiveShopView] = useState("productList");

  const handleCartClick = () => {
    setActiveShopView("cart");
  };

  const handleBackToShopping = () => {
    setActiveShopView("productList");
  };

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPost().then(setPosts);
  }, []);

  return (
    <>
      {/* Banner và SearchBar chỉ hiển thị trên trang danh sách sản phẩm */}
      {activeShopView === "productList" && (
        <>
          <Banner />
          <SearchBar />
          <div className="mt-5">
            {/* ProductList sẽ điều hướng đến shop/[id] */}
            <ProductList posts={posts}/>
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
