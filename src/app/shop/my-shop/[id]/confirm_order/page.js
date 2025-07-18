"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ConfirmOrdersPage() {
  const params = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmingOrders, setConfirmingOrders] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const [userNames, setUserNames] = useState({});

  const shopId = params?.id;

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://103.253.145.7:3002/api/orders/shop/${shopId}`, {
          credentials: "include"
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        
        if (data.status === "success") {
          // Filter only pending orders
          const pendingOrders = data.data.filter(order => order.order_status === "pending");
          setOrders(pendingOrders);
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

  // Filter orders by search term
  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getPaymentMethodText = (method) => {
    const methodMap = {
      "credit_card": "Thẻ tín dụng",
      "e_wallet": "Ví điện tử",
      "cod": "Thanh toán khi nhận hàng",
      "bank_transfer": "Chuyển khoản ngân hàng"
    };
    return methodMap[method] || method;
  };

  const confirmOrder = async (order) => {
    try {
      setConfirmingOrders(prev => new Set([...prev, order.order_id]));
      
      const updateData = {
        total_amount: parseFloat(order.total_amount),
        subtotal: parseFloat(order.subtotal),
        tax_amount: parseFloat(order.tax_amount),
        shipping_amount: parseFloat(order.shipping_amount),
        discount_amount: parseFloat(order.discount_amount),
        currency: order.currency,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        shipping_method: order.shipping_method,
        shipping_status: order.shipping_status,
        order_status: "processing",
        tracking_number: order.tracking_number || "",
        notes: order.notes || ""
      };

      const response = await fetch(`http://103.253.145.7:3002/api/orders/${order.order_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to confirm order');
      }

      // Remove the confirmed order from the list
      setOrders(prevOrders => prevOrders.filter(o => o.order_id !== order.order_id));
      
      // Close modal if this order was selected
      if (selectedOrder && selectedOrder.order_id === order.order_id) {
        setSelectedOrder(null);
      }

      alert('Đơn hàng đã được xác nhận thành công!');
    } catch (err) {
      alert('Lỗi khi xác nhận đơn hàng: ' + err.message);
    } finally {
      setConfirmingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(order.order_id);
        return newSet;
      });
    }
  };

  const confirmAllOrders = async () => {
    if (filteredOrders.length === 0) return;
    
    const confirmAll = window.confirm(`Bạn có chắc muốn xác nhận tất cả ${filteredOrders.length} đơn hàng?`);
    if (!confirmAll) return;

    for (const order of filteredOrders) {
      await confirmOrder(order);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-red-400 text-xl">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-yellow-400">⏳</span>
            Xác nhận đơn hàng
          </h1>
          <p className="text-gray-400">Xác nhận các đơn hàng đang chờ xử lý</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-yellow-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className="text-yellow-100">Đơn hàng chờ xác nhận</div>
        </div>
        <div className="bg-blue-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{filteredOrders.length}</div>
          <div className="text-blue-100">Đơn hàng hiển thị</div>
        </div>
        <div className="bg-green-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">
            {formatPrice(filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0))}
          </div>
          <div className="text-green-100">Tổng giá trị</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hoặc ID khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none flex-1"
          />
          {filteredOrders.length > 0 && (
            <button
              onClick={confirmAllOrders}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              ✅ Xác nhận tất cả ({filteredOrders.length})
            </button>
          )}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12 text-center">
          <div className="text-gray-400 text-xl mb-4">🎉</div>
          <div className="text-white text-lg mb-2">Không có đơn hàng nào cần xác nhận</div>
          <div className="text-gray-400">Tất cả đơn hàng đã được xử lý</div>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Đơn hàng chờ xác nhận ({filteredOrders.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left text-white font-medium p-4">Mã đơn</th>
                  <th className="text-left text-white font-medium p-4">Khách hàng</th>
                  <th className="text-left text-white font-medium p-4">Tổng tiền</th>
                  <th className="text-left text-white font-medium p-4">Phương thức thanh toán</th>
                  <th className="text-left text-white font-medium p-4">Ngày đặt</th>
                  <th className="text-left text-white font-medium p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                    <td className="p-4">
                      <div className="text-white font-medium">{order.order_number}</div>
                      <div className="text-gray-400 text-sm">{order.order_id.slice(0, 8)}...</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium">{order.user_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium text-lg">
                        {formatPrice(order.total_amount, order.currency)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Tạm tính: {formatPrice(order.subtotal, order.currency)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{getPaymentMethodText(order.payment_method)}</div>
                      <div className="text-yellow-400 text-sm">● pending</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => confirmOrder(order)}
                          disabled={confirmingOrders.has(order.order_id)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            confirmingOrders.has(order.order_id)
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {confirmingOrders.has(order.order_id) ? '⏳ Processing' : '✅ Confirm'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Chi tiết đơn hàng {selectedOrder.order_number}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Status Alert */}
              <div className="bg-yellow-600/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⏳</span>
                  <span className="text-yellow-400 font-medium">Đơn hàng đang chờ xác nhận</span>
                </div>
                <div className="text-yellow-200 text-sm mt-1">
                  Vui lòng kiểm tra thông tin và xác nhận đơn hàng
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Thông tin đơn hàng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Mã đơn:</span>
                    <span className="text-white ml-2">{selectedOrder.order_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Khách hàng:</span>
                    <span className="text-white ml-2">{selectedOrder.user_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ngày đặt:</span>
                    <span className="text-white ml-2">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Phương thức thanh toán:</span>
                    <span className="text-white ml-2">{getPaymentMethodText(selectedOrder.payment_method)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Phương thức giao hàng:</span>
                    <span className="text-white ml-2">{selectedOrder.shipping_method}</span>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-3">
                    <span className="text-gray-400">Ghi chú:</span>
                    <div className="text-white ml-2 mt-1 p-2 bg-gray-600/30 rounded">{selectedOrder.notes}</div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Tổng kết đơn hàng</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tạm tính:</span>
                    <span className="text-white">{formatPrice(selectedOrder.subtotal, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Thuế:</span>
                    <span className="text-white">{formatPrice(selectedOrder.tax_amount, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phí giao hàng:</span>
                    <span className="text-white">{formatPrice(selectedOrder.shipping_amount, selectedOrder.currency)}</span>
                  </div>
                  {parseFloat(selectedOrder.discount_amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Giảm giá:</span>
                      <span className="text-red-400">-{formatPrice(selectedOrder.discount_amount, selectedOrder.currency)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-600 pt-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold text-lg">Tổng cộng:</span>
                      <span className="text-green-400 font-bold text-lg">{formatPrice(selectedOrder.total_amount, selectedOrder.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Actions */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Xác nhận đơn hàng</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => confirmOrder(selectedOrder)}
                    disabled={confirmingOrders.has(selectedOrder.order_id)}
                    className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                      confirmingOrders.has(selectedOrder.order_id)
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {confirmingOrders.has(selectedOrder.order_id) ? '⏳ Đang xử lý...' : '✅ Xác nhận & Chuyển sang xử lý'}
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Đóng
                  </button>
                </div>
                <div className="text-gray-400 text-sm mt-3">
                  Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái "Đang xử lý"
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}