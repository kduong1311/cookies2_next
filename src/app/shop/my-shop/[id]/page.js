"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";

export default function DashboardPage() {
  const params = useParams();
  const shopId = params?.id;
  
  const [shopData, setShopData] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shopId) {
      fetchAllData();
    }
  }, [shopId]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch shop data
      const shopResponse = await fetch(`http://103.253.145.7:3002/api/shops/${shopId}`, {
        credentials: 'include'
      });
      
      if (!shopResponse.ok) {
        throw new Error('Failed to fetch shop data');
      }
      
      const shopResult = await shopResponse.json();
      if (shopResult.status === 'success') {
        setShopData(shopResult.data);
      }

      // Fetch products data
      const productsResponse = await fetch(`http://103.253.145.7:3002/api/products/shop/${shopId}`, {
        credentials: 'include'
      });
      
      if (productsResponse.ok) {
        const productsResult = await productsResponse.json();
        if (productsResult.status === 'success' && productsResult.data?.data) {
          setProductsData(productsResult.data.data);
        }
      }

      // Fetch orders data
      const ordersResponse = await fetch(`http://103.253.145.7:3002/api/orders/shop/${shopId}`, {
        credentials: 'include'
      });
      
      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        if (ordersResult.status === 'success' && ordersResult.data) {
          setOrdersData(ordersResult.data);
        }
      }

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalRevenue = ordersData.reduce((sum, order) => {
    return sum + (parseFloat(order.total_amount) || 0);
  }, 0);

  const totalOrders = ordersData.length;
  const totalProducts = productsData.length;
  const pendingOrders = ordersData.filter(order => order.order_status === 'pending').length;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return <Loading/> 
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400 text-lg">Error: {error}</p>
          <button 
            onClick={fetchAllData}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-blue-400">📊</span>
          Dashboard - {shopData?.name || "Shop"}
        </h1>
        <p className="text-gray-400 text-lg">Business overview and statistics</p>
        
        {/* Shop Info */}
        <div className="mt-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Address:</span>
              <p className="text-white">{shopData?.address}, {shopData?.city}, {shopData?.country}</p>
            </div>
            <div>
              <span className="text-gray-400">Email:</span>
              <p className="text-white">{shopData?.contact_email}</p>
            </div>
            <div>
              <span className="text-gray-400">Phone:</span>
              <p className="text-white">{shopData?.contact_phone}</p>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <p className={`font-semibold ${shopData?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                {shopData?.status === 'active' ? '🟢 Active' : '🟡 Inactive'}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Verification:</span>
              <p className={`font-semibold ${shopData?.is_verified ? 'text-green-400' : 'text-red-400'}`}>
                {shopData?.is_verified ? '✅ Verified' : '❌ Not verified'}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Rating:</span>
              <p className="text-white">⭐ {shopData?.rating || '0.00'} ({shopData?.total_reviews || 0} reviews)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
              <p className="text-white text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="text-blue-200 text-3xl">💰</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Orders</p>
              <p className="text-white text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="text-green-200 text-3xl">📑</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Products</p>
              <p className="text-white text-2xl font-bold">{totalProducts}</p>
            </div>
            <div className="text-purple-200 text-3xl">📦</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Orders</p>
              <p className="text-white text-2xl font-bold">{pendingOrders}</p>
            </div>
            <div className="text-orange-200 text-3xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              📈 Monthly Revenue
            </h2>
            <select className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm border border-gray-600">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div className="h-80 bg-gradient-to-t from-gray-900/50 to-gray-800/30 rounded-lg flex items-center justify-center border border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <span className="text-gray-400 text-lg">Revenue Chart</span>
              <p className="text-gray-500 text-sm mt-1">Will display 12 months revenue</p>
            </div>
          </div>
        </div>

        {/* Right side - 2 pie charts */}
        <div className="space-y-6">
          {/* Product Categories Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              🎯 Product Categories
            </h3>
            <div className="h-48 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <div className="text-3xl mb-2">🍰</div>
                <span className="text-gray-400">Pie Chart</span>
                <p className="text-gray-500 text-xs mt-1">Category distribution</p>
              </div>
            </div>
          </div>

          {/* Order Status Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              📋 Order Status
            </h3>
            <div className="h-48 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <span className="text-gray-400">Pie Chart</span>
                <p className="text-gray-500 text-xs mt-1">Status distribution</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            📋 Recent Orders
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {ordersData.slice(0, 5).map((order) => (
              <div key={order.order_id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{order.order_number}</p>
                    <p className="text-gray-400 text-sm">{formatCurrency(order.total_amount)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.order_status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                      order.order_status === 'processing' ? 'bg-blue-600 text-blue-100' :
                      order.order_status === 'completed' ? 'bg-green-600 text-green-100' :
                      'bg-gray-600 text-gray-100'
                    }`}>
                      {order.order_status}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {ordersData.length === 0 && (
              <p className="text-gray-400 text-center py-8">No orders yet</p>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            📦 Recent Products
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {productsData.slice(0, 5).map((product) => (
              <div key={product.product_id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-600 text-green-100' :
                      'bg-gray-600 text-gray-100'
                    }`}>
                      {product.status}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      Stock: {product.stock_quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {productsData.length === 0 && (
              <p className="text-gray-400 text-center py-8">No products yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-xl">
        <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/shop/my-shop/${shopId}/products`}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
              <div>
                <p className="font-semibold">Product Management</p>
                <p className="text-blue-100 text-sm">Add, edit, delete products</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/shop/my-shop/${shopId}/orders`}
            className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">📑</span>
              <div>
                <p className="font-semibold">Orders</p>
                <p className="text-green-100 text-sm">View and process orders</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/shop/my-shop/${shopId}/confirm_order`}
            className="group bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">⏳</span>
              <div>
                <p className="font-semibold">Pending Orders</p>
                <p className="text-yellow-100 text-sm">Review new orders</p>
              </div>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
}