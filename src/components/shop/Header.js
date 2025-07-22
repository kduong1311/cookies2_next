"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Heart, Search, ChevronDown, Home, Menu, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const {cartCount} = useCart();

  const handleShopClick = async () => {
    if (!user?.user_id) return;

    try {
      const res = await fetch("http://103.253.145.7:3002/api/shops/", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.status === "success") {
        const shops = data.data;
        const myShop = shops.find(shop => shop.user_id === user.user_id);

        if (myShop) {
          router.push(`/shop/my-shop/${myShop.shop_id}`);
        } else {
          router.push("/shop/create");
        }
      }
    } catch (error) {
      console.error("Failed to fetch shop data", error);
    }
  };

  const handleCartClick = () => {
    router.push("/shop/cart")
  }

  return (
    <header className="bg-gray-900 py-3 px-4 sticky top-2 p-3 z-10 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Menu size={20} className="mr-4 lg:hidden" />
          <h1 className="text-xl font-bold">COOKIES SHOP</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="p-2 hover:text-yellow-500 transition-colors relative"
            onClick={handleShopClick}
          >
            <User size={20} />
          </button>

          <button className="p-2 hover:text-yellow-500 transition-colors relative"
            onClick={handleCartClick}>
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black rounded-full w-4 h-4 flex items-center justify-center text-xs">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
