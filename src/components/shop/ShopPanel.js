"use client";
import { useState } from "react";
import Header from "./Header";
import Banner from "./Banner";
import SearchBar from "./SearchBar";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import ProductCart from "./ProductCart";

export default function ShopPanel({ onProductClick, onClose }) {
  const [activeView, setActiveView] = useState("productList"); // productList | productDetail | cart
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleBackToList = () => {
    setSelectedProductId(null);
    setActiveView("productList");
  };

  const handleCartClick = () => {
    setActiveView("cart");
  };

  return (
    <div
      className="overflow-y-auto pl-4 pr-4 pb-4 bg-black-cs text-white rounded-lg shadow-lg hide-scrollbar"
      style={{
        width: "900px",
        height: "95vh",
        margin: "20px auto",
      }}
    >

      <Header onCartClick={handleCartClick} onClose={onClose} />

      <div className="flex justify-between items-center border-b pb-4 mb-4" />

      {activeView === "productList" && (
        <>
          <Banner />
          <SearchBar />
          <div className="mt-5">
            <ProductList onProductClick={onProductClick} />
          </div>
        </>
      )}

      {activeView === "productDetail" && (
        <ProductDetail
          productId={selectedProductId}
          onBack={handleBackToList}
        />
      )}

      {activeView === "cart" && (
        <ProductCart
          onBackToShopping={handleBackToList}
        />
      )}
    </div>
  );
}
