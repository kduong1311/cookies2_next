// app/shop/dashboard/products/page.js
"use client";
import { useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      category: "Điện thoại",
      price: 29990000,
      stock: 25,
      status: "Còn hàng",
      image: "📱",
      description: "iPhone 15 Pro Max 256GB Titan Tự Nhiên"
    },
    {
      id: 2,
      name: "MacBook Pro M3",
      category: "Laptop",
      price: 52990000,
      stock: 12,
      status: "Còn hàng",
      image: "💻",
      description: "MacBook Pro 14 inch M3 Pro 512GB"
    },
    {
      id: 3,
      name: "AirPods Pro 2",
      category: "Phụ kiện",
      price: 6490000,
      stock: 0,
      status: "Hết hàng",
      image: "🎧",
      description: "AirPods Pro thế hệ 2 với USB-C"
    },
    {
      id: 4,
      name: "iPad Air M2",
      category: "Tablet",
      price: 16990000,
      stock: 8,
      status: "Sắp hết",
      image: "📱",
      description: "iPad Air 11 inch M2 WiFi 128GB"
    }
  ]);

  const test = async ()=> {
    try{
      const response = await fetch('http://103.253.145.7:3002/api/products/shop/1bbc5ccf-cef8-4ea1-919f-beb595f9b4e9', {
        credentials: "include"
      });
      const data = await response.json();
      console.log("gaf", data)
      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  test(); 

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Còn hàng": return "bg-green-500";
      case "Sắp hết": return "bg-yellow-500";
      case "Hết hàng": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-blue-400">📦</span>
            Quản lý sản phẩm
          </h1>
          <p className="text-gray-400">Thêm, sửa, xóa và quản lý sản phẩm</p>
        </div>
        <Link
          href="/shop/dashboard" 
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ← Về Dashboard
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{products.length}</div>
          <div className="text-blue-100">Tổng sản phẩm</div>
        </div>
        <div className="bg-green-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{products.filter(p => p.status === "Còn hàng").length}</div>
          <div className="text-green-100">Còn hàng</div>
        </div>
        <div className="bg-yellow-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{products.filter(p => p.status === "Sắp hết").length}</div>
          <div className="text-yellow-100">Sắp hết hàng</div>
        </div>
        <div className="bg-red-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{products.filter(p => p.status === "Hết hàng").length}</div>
          <div className="text-red-100">Hết hàng</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none flex-1"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Điện thoại">Điện thoại</option>
              <option value="Laptop">Laptop</option>
              <option value="Tablet">Tablet</option>
              <option value="Phụ kiện">Phụ kiện</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Danh sách sản phẩm ({filteredProducts.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="text-left text-white font-medium p-4">Sản phẩm</th>
                <th className="text-left text-white font-medium p-4">Danh mục</th>
                <th className="text-left text-white font-medium p-4">Giá</th>
                <th className="text-left text-white font-medium p-4">Tồn kho</th>
                <th className="text-left text-white font-medium p-4">Trạng thái</th>
                <th className="text-left text-white font-medium p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.image}</span>
                      <div>
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-gray-400 text-sm">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{product.category}</td>
                  <td className="p-4 text-white font-medium">{formatPrice(product.price)}</td>
                  <td className="p-4 text-gray-300">{product.stock}</td>
                  <td className="p-4">
                    <span className={`${getStatusColor(product.status)} text-white px-3 py-1 rounded-full text-sm`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddForm || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Tên sản phẩm"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.name || ""}
              />
              <input
                type="text"
                placeholder="Mô tả"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.description || ""}
              />
              <select className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none">
                <option value="Điện thoại">Điện thoại</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
                <option value="Phụ kiện">Phụ kiện</option>
              </select>
              <input
                type="number"
                placeholder="Giá (VND)"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.price || ""}
              />
              <input
                type="number"
                placeholder="Số lượng tồn kho"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.stock || ""}
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingProduct ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}