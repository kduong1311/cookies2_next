// app/shop/dashboard/orders/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const params = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userNames, setUserNames] = useState({});



  // Get shop ID from params or use default
  const shopId = params?.id;



  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://103.253.145.7:3002/api/orders/shop/${shopId}`,{
          credentials: "include"
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        
        if (data.status === "success") {
        const fetchedOrders = data.data;
        setOrders(fetchedOrders);

        const uniqueUserIds = [...new Set(fetchedOrders.map(order => order.user_id))];

        const userResponses = await Promise.all(
          uniqueUserIds.map(id =>
            fetch(`http://103.253.145.7:3000/api/users/${id}`, { credentials: "include" })
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          )
        );

        // Tạo object userId → username
        const nameMap = {};
        userResponses.forEach((res, index) => {
          if (res && res.username) {
            nameMap[uniqueUserIds[index]] = res.username;
          }
        });

        setUserNames(nameMap);
      } else {
        throw new Error('Invalid response format');
      }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [shopId]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.order_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "shipped": return "bg-blue-500";
      case "processing": return "bg-yellow-500";
      case "pending": return "bg-orange-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      case "refunded": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getShippingStatusColor = (status) => {
    switch (status) {
      case "processing": return "bg-yellow-500";
      case "pending": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const formatPrice = (price, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => status;

  const getPaymentStatusText = (status) => status;

  const getPaymentMethodText = (method) => method;

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://103.253.145.7:3003/api/orders/${orderId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(orders.map(order => {
        if (order.order_id === orderId) {
          const updatedOrder = { ...order, order_status: newStatus };
          if (newStatus === "completed" && !updatedOrder.completed_at) {
            updatedOrder.completed_at = new Date().toISOString();
          }
          return updatedOrder;
        }
        return order;
      }));

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.order_id === orderId) {
        setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
      }
      
      toast.success("Profile updated successfully!");

    } catch (err) {
      toast.error("Update status Fail!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-green-400">📑</span>
            Manage Orders
          </h1>
          <p className="text-gray-400">view and Hanle orders</p>
        </div>
        <Link
          href={`/shop/my-shop/${shopId}`}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className="text-blue-100">Total</div>
        </div>
        <div className="bg-green-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{orders.filter(o => o.order_status === "completed").length}</div>
          <div className="text-green-100">Completed</div>
        </div>
        <div className="bg-yellow-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{orders.filter(o => o.order_status === "pending").length}</div>
          <div className="text-yellow-100">Processing</div>
        </div>
        <div className="bg-purple-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">
            {formatPrice(orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0))}
          </div>
          <div className="text-purple-100">Total Revenue</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Peding</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled"</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Oder List({filteredOrders.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="text-left text-white font-medium p-4">Order Number</th>
                <th className="text-left text-white font-medium p-4">Customer</th>
                <th className="text-left text-white font-medium p-4">Total</th>
                <th className="text-left text-white font-medium p-4">Status</th>
                <th className="text-left text-white font-medium p-4">Payment</th>
                <th className="text-left text-white font-medium p-4">Delivery</th>
                <th className="text-left text-white font-medium p-4">Date</th>
                <th className="text-left text-white font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.order_id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <div className="text-white font-medium">{order.order_number}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{userNames[order.user_id] || order.user_id}</div>
                  </td>
                  <td className="p-4 text-white font-medium">
                    {formatPrice(order.total_amount, order.currency)}
                  </td>
                  <td className="p-4">
                    <span className={`${getStatusColor(order.order_status)} text-white px-3 py-1 rounded-full text-sm`}>
                      {getStatusText(order.order_status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`${getPaymentStatusColor(order.payment_status)} text-white px-3 py-1 rounded-full text-sm`}>
                      {getPaymentStatusText(order.payment_status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`${getShippingStatusColor(order.shipping_status)} text-white px-3 py-1 rounded-full text-sm`}>
                      {getStatusText(order.shipping_status)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{formatDate(order.created_at)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                      Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Oder detail {selectedOrder.order_number}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Order info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Order number:</span>
                    <span className="text-white ml-2">{selectedOrder.order_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Customer:</span>
                    <span className="text-white ml-2">{userNames[selectedOrder.user_id] || selectedOrder.user_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white ml-2">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Payment method:</span>
                    <span className="text-white ml-2">{getPaymentMethodText(selectedOrder.payment_method)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Shipping method:</span>
                    <span className="text-white ml-2">{selectedOrder.shipping_method}</span>
                  </div>
                  {selectedOrder.tracking_number && (
                    <div>
                      <span className="text-gray-400">tracking_number:</span>
                      <span className="text-white ml-2">{selectedOrder.tracking_number}</span>
                    </div>
                  )}
                </div>
                {selectedOrder.notes && (
                  <div className="mt-3">
                    <span className="text-gray-400">Note:</span>
                    <span className="text-white ml-2">{selectedOrder.notes}</span>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Total</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sub total:</span>
                    <span className="text-white">{formatPrice(selectedOrder.subtotal, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-white">{formatPrice(selectedOrder.tax_amount, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping fee:</span>
                    <span className="text-white">{formatPrice(selectedOrder.shipping_amount, selectedOrder.currency)}</span>
                  </div>
                  {parseFloat(selectedOrder.discount_amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discount:</span>
                      <span className="text-red-400">-{formatPrice(selectedOrder.discount_amount, selectedOrder.currency)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-600 pt-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold text-lg">Total:</span>
                      <span className="text-green-400 font-bold text-lg">{formatPrice(selectedOrder.total_amount, selectedOrder.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status & Actions */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Status & Action</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-400">Order status:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.order_status)} text-white`}>
                      {getStatusText(selectedOrder.order_status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Payment:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(selectedOrder.payment_status)} text-white`}>
                      {getPaymentStatusText(selectedOrder.payment_status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Shipping:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getShippingStatusColor(selectedOrder.shipping_status)} text-white`}>
                      {getStatusText(selectedOrder.shipping_status)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedOrder.order_status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.order_id, "processing")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      🚀 Confirm order
                    </button>
                  )}
                  {selectedOrder.order_status === "processing" && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.order_id, "completed")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      ✅ Complete
                    </button>
                  )}
                  {(selectedOrder.order_status === "pending" || selectedOrder.order_status === "processing") && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.order_id, "cancelled")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}