"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { id } = useParams(); // Lấy shop_id từ URL
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const res = await fetch(`http://103.253.145.7:3002/api/shops/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Lỗi khi lấy thông tin shop");

        setShop(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopInfo();
  }, [id]);

  if (loading) return <div className="text-white p-6">Đang tải...</div>;
  if (error) return <div className="text-red-500 p-6">Lỗi: {error}</div>;
  if (!shop) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-blue-400">📊</span>
          {shop.name || "Tên shop"}
        </h1>
        <p className="text-gray-400 text-lg">{shop.description || "Mô tả shop"}</p>
        <p className="text-gray-500 mt-1 text-sm">
          {shop.contact_email} | {shop.contact_phone}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg">
          <p className="text-blue-100 text-sm">Tổng doanh thu</p>
          <p className="text-white text-2xl font-bold">₫0</p>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl shadow-lg">
          <p className="text-green-100 text-sm">Đơn hàng</p>
          <p className="text-white text-2xl font-bold">0</p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg">
          <p className="text-purple-100 text-sm">Sản phẩm</p>
          <p className="text-white text-2xl font-bold">0</p>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-xl shadow-lg">
          <p className="text-orange-100 text-sm">Chờ duyệt</p>
          <p className="text-white text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
        <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/shop/my_shop/${id}/products`}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold">Quản lý sản phẩm</p>
                <p className="text-blue-100 text-sm">Thêm, sửa, xóa sản phẩm</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/shop/my_shop/${id}/orders`}
            className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📑</span>
              <div>
                <p className="font-semibold">Đơn hàng</p>
                <p className="text-green-100 text-sm">Xem và xử lý đơn hàng</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/shop/my_shop/${id}/pending`}
            className="group bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-semibold">Đơn chờ duyệt</p>
                <p className="text-yellow-100 text-sm">Xét duyệt đơn hàng mới</p>
              </div>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
}
