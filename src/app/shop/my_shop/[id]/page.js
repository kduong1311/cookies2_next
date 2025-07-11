"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";

export default function DashboardPage() {
  const params = useParams();
  const shopId = params?.id;
  
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shopId) {
      fetchShopData();
    }
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://103.253.145.7:3002/api/shops/${shopId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch shop data');
      }
      
      const result = await response.json();
      if (result.status === 'success') {
        setShopData(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching shop data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading/> 
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400 text-lg">Lỗi: {error}</p>
          <button 
            onClick={fetchShopData}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {loading && <Loading />}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-blue-400">📊</span>
          Dashboard - {shopData?.name || "Shop"}
        </h1>
        <p className="text-gray-400 text-lg">Tổng quan kinh doanh và thống kê</p>
        
        {/* Shop Info */}
        <div className="mt-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Địa chỉ:</span>
              <p className="text-white">{shopData?.address}, {shopData?.city}, {shopData?.country}</p>
            </div>
            <div>
              <span className="text-gray-400">Email:</span>
              <p className="text-white">{shopData?.contact_email}</p>
            </div>
            <div>
              <span className="text-gray-400">Điện thoại:</span>
              <p className="text-white">{shopData?.contact_phone}</p>
            </div>
            <div>
              <span className="text-gray-400">Trạng thái:</span>
              <p className={`font-semibold ${shopData?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                {shopData?.status === 'active' ? '🟢 Hoạt động' : '🟡 Tạm dừng'}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Xác minh:</span>
              <p className={`font-semibold ${shopData?.is_verified ? 'text-green-400' : 'text-red-400'}`}>
                {shopData?.is_verified ? '✅ Đã xác minh' : '❌ Chưa xác minh'}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Đánh giá:</span>
              <p className="text-white">⭐ {shopData?.rating || '0.00'} ({shopData?.total_reviews || 0} đánh giá)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Tổng doanh thu</p>
              <p className="text-white text-2xl font-bold">₫0</p>
            </div>
            <div className="text-blue-200 text-3xl">💰</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Đơn hàng</p>
              <p className="text-white text-2xl font-bold">0</p>
            </div>
            <div className="text-green-200 text-3xl">📑</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Sản phẩm</p>
              <p className="text-white text-2xl font-bold">0</p>
            </div>
            <div className="text-purple-200 text-3xl">📦</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Chờ duyệt</p>
              <p className="text-white text-2xl font-bold">0</p>
            </div>
            <div className="text-orange-200 text-3xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Biểu đồ cột - Doanh thu theo tháng */}
        <div className="xl:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              📈 Doanh thu theo tháng
            </h2>
            <select className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm border border-gray-600">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div className="h-80 bg-gradient-to-t from-gray-900/50 to-gray-800/30 rounded-lg flex items-center justify-center border border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <span className="text-gray-400 text-lg">Biểu đồ cột doanh thu</span>
              <p className="text-gray-500 text-sm mt-1">Sẽ hiển thị doanh thu 12 tháng</p>
            </div>
          </div>
        </div>

        {/* Right side - 2 biểu đồ tròn */}
        <div className="space-y-6">
          {/* Biểu đồ tròn 1 - Phân loại sản phẩm */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              🎯 Phân loại sản phẩm
            </h3>
            <div className="h-48 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <div className="text-3xl mb-2">🍰</div>
                <span className="text-gray-400">Biểu đồ tròn</span>
                <p className="text-gray-500 text-xs mt-1">Tỷ lệ danh mục</p>
              </div>
            </div>
          </div>

          {/* Biểu đồ tròn 2 - Trạng thái đơn hàng */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              📋 Trạng thái đơn hàng
            </h3>
            <div className="h-48 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <span className="text-gray-400">Biểu đồ tròn</span>
                <p className="text-gray-500 text-xs mt-1">Tỷ lệ trạng thái</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
        <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/shop/my_shop/${shopId}/products`}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
              <div>
                <p className="font-semibold">Quản lý sản phẩm</p>
                <p className="text-blue-100 text-sm">Thêm, sửa, xóa sản phẩm</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/shop/my_shop/${shopId}/orders`}
            className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">📑</span>
              <div>
                <p className="font-semibold">Đơn hàng</p>
                <p className="text-green-100 text-sm">Xem và xử lý đơn hàng</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/shop/my_shop/${shopId}/pending`}
            className="group bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">⏳</span>
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