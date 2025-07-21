"use client";
import { useEffect, useState } from "react";
import Banner from "@/components/shop/Banner";
import SearchBar from "@/components/shop/SearchBar";
import ProductList from "@/components/shop/ProductList";
import ProductCart from "@/components/shop/ProductCart";
import { fetchProducts } from "@/api_services/product";
import Loading from "@/components/Loading";

export default function ShopPage() {
  const [activeShopView, setActiveShopView] = useState("productList");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // 👉 giữ toàn bộ danh sách
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCartClick = () => {
    setActiveShopView("cart");
  };

  const handleBackToShopping = () => {
    setActiveShopView("productList");
  };

  // ✅ Search local trong allProducts
  const handleSearch = ({ query = "", category = "All"}) => {
  const keyword = query.toLowerCase();
  let filtered = [...allProducts];
    if (category !== "All") {
      filtered = filtered.filter((product) =>
        product.categories?.some((cat) =>
          cat.name.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(keyword)
    );

    setProducts(filtered);
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts();
        setAllProducts(fetchedProducts);
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
console.log("Aaa", products)
  if (loading) {
    return (
      <div className="flex relative justify-center items-center min-h-screen">
        <Loading />
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
      {activeShopView === "productList" && (
        <>
          <Banner />
          <SearchBar onSearch={handleSearch} allProducts={products}/>
          <div className="mt-5">
            <ProductList products={products} />
          </div>
        </>
      )}

      {activeShopView === "cart" && (
        <ProductCart onBackToShopping={handleBackToShopping} />
      )}
    </>
  );
}
