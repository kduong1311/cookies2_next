import React from "react";
import { X, ShoppingCart, Heart, Search, ChevronDown, Home, Menu, User } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for cookies..." 
            className="w-full bg-gray-800 rounded-md pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-2">Popular Categories</h4>
        <div className="flex flex-wrap gap-2">
          {["All", "Pots & Pans", "Knives & Scissors", "Cups & Glasses", "Cooking Utensils", "Electric Appliances "].map(category => (
            <button 
              key={category} 
              className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Featured Collections</h4>
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-md p-3 transition-colors hover:bg-gray-700">
            <h5 className="font-medium mb-1">Summer Specials</h5>
            <p className="text-xs text-gray-400">Limited time summer flavors</p>
          </div>
          <div className="bg-gray-800 rounded-md p-3 transition-colors hover:bg-gray-700">
            <h5 className="font-medium mb-1">Gift Boxes</h5>
            <p className="text-xs text-gray-400">Perfect for any occasion</p>
          </div>
          <div className="bg-gray-800 rounded-md p-3 transition-colors hover:bg-gray-700">
            <h5 className="font-medium mb-1">Best Sellers</h5>
            <p className="text-xs text-gray-400">Our most popular cookies</p>
          </div>
        </div>
      </div>
    </div>
  );
};
