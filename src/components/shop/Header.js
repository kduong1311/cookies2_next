"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Heart, Search, ChevronDown, Home, Menu, User, Router } from "lucide-react";


export default function Header(onCartClick) {
  const router = useRouter();
  return (
  <header className="bg-gray-900 py-3 px-4 sticky top-2 p-3 z-10 rounded-2xl">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Menu size={20} className="mr-4 lg:hidden" />
        <h1 className="text-xl font-bold">COOKIES SHOP</h1>
      </div>
      <div className="flex items-center space-x-4">
        
        <button className="p-2 hover:text-yellow-500 transition-colors relative">
          <User size={20} onClick={() => {router.push("/shop/my_shop")}}/>
        </button>
        
        <button className="p-2 hover:text-yellow-500 transition-colors relative">
          <Heart size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">2</span>
        </button>
        
        <button className="p-2 hover:text-yellow-500 transition-colors relative"
        onClick={onCartClick}>
          <ShoppingCart size={20} />
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-black rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
        </button>
      </div>
    </div>
  </header>
  );
};