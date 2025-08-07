"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch, allProducts = [] }) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://103.253.145.7:3003/api/categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    const keyword = (query || " ").toLowerCase();
    let filtered = allProducts;

    if (activeCategory !== "All") {
      filtered = filtered.filter((product) =>
        product.categories?.some((cat) =>
          cat.name.toLowerCase().includes(activeCategory.toLowerCase())
        )
      );
    }

    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(keyword)
    );

    onSearch({ query, category: activeCategory });
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [query, activeCategory, allProducts, onSearch]);


  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    setQuery("");
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for cookies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-800 rounded-md pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
