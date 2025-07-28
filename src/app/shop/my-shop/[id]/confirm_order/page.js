"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://103.253.145.7:8080/api/orders/shop/${shopId}`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.status === "success") {
          const pendingOrders = data.data.filter(order => order.order_status === "pending");
          setOrders(pendingOrders);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [shopId]);


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
      "credit_card": "Credit Card",
      "e_wallet": "E-Wallet",
      "cod": "Cash on Delivery",
      "bank_transfer": "Bank Transfer"
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

    await axios.put(`http://103.253.145.7:3002/api/orders/${order.order_id}`, updateData, {
      withCredentials: true,
    });

    setOrders(prevOrders => prevOrders.filter(o => o.order_id !== order.order_id));

    if (selectedOrder && selectedOrder.order_id === order.order_id) {
      setSelectedOrder(null);
    }

    toast.success("Order confirmed successfully!");
  } catch (err) {
    toast.error("Error confirming order");
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
    
    const confirmAll = window.confirm(`Are you sure you want to confirm all ${filteredOrders.length} orders?`);
    if (!confirmAll) return;

    for (const order of filteredOrders) {
      await confirmOrder(order);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-yellow-400">⏳</span>
            Confirm Orders
          </h1>
          <p className="text-gray-400">Confirm pending orders</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-yellow-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className="text-yellow-100">Pending Orders</div>
        </div>
        <div className="bg-blue-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{filteredOrders.length}</div>
          <div className="text-blue-100">Displayed Orders</div>
        </div>
        <div className="bg-green-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">
            {formatPrice(filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0))}
          </div>
          <div className="text-green-100">Total Value</div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by order number or customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none flex-1"
          />
          {filteredOrders.length > 0 && (
            <button
              onClick={confirmAllOrders}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              ✅ Confirm All ({filteredOrders.length})
            </button>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12 text-center">
          <div className="text-gray-400 text-xl mb-4">🎉</div>
          <div className="text-white text-lg mb-2">No orders need confirmation</div>
          <div className="text-gray-400">All orders have been processed</div>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Pending Orders ({filteredOrders.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left text-white font-medium p-4">Order Number</th>
                  <th className="text-left text-white font-medium p-4">Customer</th>
                  <th className="text-left text-white font-medium p-4">Total</th>
                  <th className="text-left text-white font-medium p-4">Payment Method</th>
                  <th className="text-left text-white font-medium p-4">Order Date</th>
                  <th className="text-left text-white font-medium p-4">Actions</th>
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
                        Subtotal: {formatPrice(order.subtotal, order.currency)}
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Order Details {selectedOrder.order_number}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-600/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⏳</span>
                  <span className="text-yellow-400 font-medium">Order pending confirmation</span>
                </div>
                <div className="text-yellow-200 text-sm mt-1">
                  Please check the information and confirm the order
                </div>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Order Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Order Number:</span>
                    <span className="text-white ml-2">{selectedOrder.order_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Customer:</span>
                    <span className="text-white ml-2">{selectedOrder.user_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Order Date:</span>
                    <span className="text-white ml-2">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="text-white ml-2">{getPaymentMethodText(selectedOrder.payment_method)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Shipping Method:</span>
                    <span className="text-white ml-2">{selectedOrder.shipping_method}</span>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-3">
                    <span className="text-gray-400">Notes:</span>
                    <div className="text-white ml-2 mt-1 p-2 bg-gray-600/30 rounded">{selectedOrder.notes}</div>
                  </div>
                )}
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">{formatPrice(selectedOrder.subtotal, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-white">{formatPrice(selectedOrder.tax_amount, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping Fee:</span>
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

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Order Confirmation</h4>
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
                    {confirmingOrders.has(selectedOrder.order_id) ? '⏳ Processing...' : '✅ Confirm & Move to Processing'}
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
                <div className="text-gray-400 text-sm mt-3">
                  After confirmation, the order will move to "Processing" status
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}