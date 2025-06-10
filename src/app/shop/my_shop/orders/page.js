// app/shop/dashboard/orders/page.js
"use client";
import { useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customer: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0901234567",
      products: [
        { name: "iPhone 15 Pro Max", quantity: 1, price: 29990000 },
        { name: "AirPods Pro 2", quantity: 1, price: 6490000 }
      ],
      total: 36480000,
      status: "Đã giao",
      paymentStatus: "Đã thanh toán",
      orderDate: "2024-06-01",
      deliveryDate: "2024-06-03",
      address: "123 Nguyễn Huệ, Q1, TP.HCM"
    },
    {
      id: "ORD002",
      customer: "Trần Thị Bình",
      email: "binh.tran@email.com",
      phone: "0987654321",
      products: [
        { name: "MacBook Pro M3", quantity: 1, price: 52990000 }
      ],
      total: 52990000,
      status: "Đang giao",
      paymentStatus: "Đã thanh toán",
      orderDate: "2024-06-02",
      deliveryDate: null,
      address: "456 Lê Lợi, Q3, TP.HCM"
    },
    {
      id: "ORD003",
      customer: "Lê Văn Cường",
      email: "cuong.le@email.com",
      phone: "0912345678",
      products: [
        { name: "iPad Air M2", quantity: 2, price: 16990000 }
      ],
      total: 33980000,
      status: "Đang xử lý",
      paymentStatus: "Chờ thanh toán",
      orderDate: "2024-06-04",
      deliveryDate: null,
      address: "789 Võ Văn Tần, Q3, TP.HCM"
    },
    {
      id: "ORD004",
      customer: "Phạm Thị Dung",
      email: "dung.pham@email.com",
      phone: "0923456789",
      products: [
        { name: "iPhone 15 Pro Max", quantity: 1, price: 29990000 },
        { name: "MacBook Pro M3", quantity: 1, price: 52990000 }
      ],
      total: 82980000,
      status: "Đã hủy",
      paymentStatus: "Đã hoàn tiền",
      orderDate: "2024-06-01",
      deliveryDate: null,
      address: "321 Hai Bà Trưng, Q1, TP.HCM"
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao": return "bg-green-500";
      case "Đang giao": return "bg-blue-500";
      case "Đang xử lý": return "bg-yellow-500";
      case "Đã hủy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán": return "bg-green-500";
      case "Chờ thanh toán": return "bg-yellow-500";
      case "Đã hoàn tiền": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === "Đã giao" && !updatedOrder.deliveryDate) {
          updatedOrder.deliveryDate = new Date().toISOString().slice(0, 10); // Set current date as delivery date
        }
        return updatedOrder;
      }
      return order;
    }));
    // Close modal if status changes and it's the selected order
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-green-400">📑</span>
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-400">Xem và xử lý các đơn hàng</p>
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
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className="text-blue-100">Tổng đơn hàng</div>
        </div>
        <div className="bg-green-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{orders.filter(o => o.status === "Đã giao").length}</div>
          <div className="text-green-100">Đã giao</div>
        </div>
        <div className="bg-yellow-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{orders.filter(o => o.status === "Đang xử lý").length}</div>
          <div className="text-yellow-100">Đang xử lý</div>
        </div>
        <div className="bg-purple-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">
            {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
          </div>
          <div className="text-purple-100">Tổng doanh thu</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Danh sách đơn hàng ({filteredOrders.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="text-left text-white font-medium p-4">Mã đơn</th>
                <th className="text-left text-white font-medium p-4">Khách hàng</th>
                <th className="text-left text-white font-medium p-4">Sản phẩm</th>
                <th className="text-left text-white font-medium p-4">Tổng tiền</th>
                <th className="text-left text-white font-medium p-4">Trạng thái</th>
                <th className="text-left text-white font-medium p-4">Thanh toán</th>
                <th className="text-left text-white font-medium p-4">Ngày đặt</th>
                <th className="text-left text-white font-medium p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <div className="text-white font-medium">{order.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{order.customer}</div>
                    <div className="text-gray-400 text-sm">{order.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-300">
                      {order.products.length} sản phẩm
                    </div>
                    <div className="text-gray-400 text-sm">
                      {order.products[0]?.name}
                      {order.products.length > 1 && ` +${order.products.length - 1} khác`}
                    </div>
                  </td>
                  <td className="p-4 text-white font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`${getPaymentStatusColor(order.paymentStatus)} text-white px-3 py-1 rounded-full text-sm`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{formatDate(order.orderDate)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        👁️ Xem
                      </button>
                      {order.status === "Đang xử lý" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "Đang giao")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          ✅ Duyệt
                        </button>
                      )}
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
              <h3 className="text-xl font-semibold text-white">Chi tiết đơn hàng {selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Thông tin khách hàng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Tên:</span>
                    <span className="text-white ml-2">{selectedOrder.customer}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white ml-2">{selectedOrder.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Số điện thoại:</span>
                    <span className="text-white ml-2">{selectedOrder.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ngày đặt:</span>
                    <span className="text-white ml-2">{formatDate(selectedOrder.orderDate)}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-400">Địa chỉ giao hàng:</span>
                  <span className="text-white ml-2">{selectedOrder.address}</span>
                </div>
              </div>

              {/* Products */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Sản phẩm đặt mua</h4>
                <div className="space-y-3">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-600 pb-2 last:border-b-0">
                      <div>
                        <div className="text-white">{product.name}</div>
                        <div className="text-gray-400 text-sm">Số lượng: {product.quantity}</div>
                      </div>
                      <div className="text-white font-medium">{formatPrice(product.price * product.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-600 flex justify-between items-center">
                  <div className="text-white font-semibold text-lg">Tổng cộng:</div>
                  <div className="text-green-400 font-bold text-lg">{formatPrice(selectedOrder.total)}</div>
                </div>
              </div>

              {/* Order Status & Actions */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Trạng thái đơn hàng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Trạng thái:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)} text-white`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Thanh toán:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(selectedOrder.paymentStatus)} text-white`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  {selectedOrder.deliveryDate && (
                    <div>
                      <span className="text-gray-400">Ngày giao hàng:</span>
                      <span className="text-white ml-2">{formatDate(selectedOrder.deliveryDate)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {selectedOrder.status === "Đang xử lý" && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, "Đang giao")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      🚀 Chuyển sang Đang giao
                    </button>
                  )}
                  {selectedOrder.status === "Đang giao" && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, "Đã giao")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      ✅ Đánh dấu Đã giao
                    </button>
                  )}
                  {(selectedOrder.status === "Đang xử lý" || selectedOrder.status === "Đang giao") && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, "Đã hủy")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      ❌ Hủy đơn hàng
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