"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Eye,
  Package,
  CreditCard,
  Truck,
  Calendar,
  DollarSign,
  Store,
  ShoppingBag,
  Clock,
  Check,
  X,
  Star
} from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://103.253.145.7:3003/api/orders/user', {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setLoadingDetails(true);
    const details = { products: {}, shops: {} };

    for (const item of order.items) {
      try {
        const productRes = await fetch(`http://103.253.145.7:3003/api/products/${item.product_id}`);
        const productData = await productRes.json();
        if (productData.status === 'success') {
          details.products[item.product_id] = productData.data;
        }

        const shopRes = await fetch(`http://103.253.145.7:3002/api/shops/${item.shop_id}`);
        const shopData = await shopRes.json();
        if (shopData.status === 'success') {
          details.shops[item.shop_id] = shopData.data;
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      }
    }

    setOrderDetails(details);
    setLoadingDetails(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'processing': return <Package className="h-3 w-3" />;
      case 'shipped': return <Truck className="h-3 w-3" />;
      case 'delivered': return <Check className="h-3 w-3" />;
      case 'cancelled': return <X className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-orange-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <p className="mt-6 text-gray-300 text-lg">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ... phần hiển thị đơn hàng tương tự như bạn đã viết ... */}

        {/* Order Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
            <DialogHeader className="border-b border-gray-700 pb-4">
              <DialogTitle className="flex items-center space-x-3 text-2xl">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span>Chi tiết đơn hàng {selectedOrder?.order_number}</span>
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6 pt-6">
                {loadingDetails && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-orange-500"></div>
                    <span className="ml-3 text-gray-300">Đang tải chi tiết...</span>
                  </div>
                )}

                {/* Tóm tắt thanh toán */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Thông tin đơn hàng */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="border-b border-gray-600">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Package className="h-5 w-5 text-orange-500" />
                        <span>Thông tin đơn hàng</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Mã đơn hàng:</span>
                        <span className="font-mono text-orange-400 bg-gray-800 px-3 py-1 rounded">
                          {selectedOrder.order_number}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Ngày đặt:</span>
                        <span className="text-white">{formatDate(selectedOrder.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Trạng thái:</span>
                        <Badge className={`${getStatusColor(selectedOrder.order_status)} flex items-center space-x-1`}>
                          {getStatusIcon(selectedOrder.order_status)}
                          <span className="capitalize">{selectedOrder.order_status}</span>
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Thanh toán:</span>
                        <span className="text-white capitalize">
                          {selectedOrder.payment_method.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Vận chuyển:</span>
                        <span className="text-white capitalize">{selectedOrder.shipping_method}</span>
                      </div>
                      {selectedOrder.tracking_number && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Mã vận đơn:</span>
                          <span className="font-mono text-orange-400 bg-gray-800 px-3 py-1 rounded">
                            {selectedOrder.tracking_number}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tóm tắt thanh toán */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="border-b border-gray-600">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <span>Tóm tắt thanh toán</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Tạm tính:</span>
                        <span className="text-white">{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Thuế:</span>
                        <span className="text-white">{formatCurrency(selectedOrder.tax_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Phí vận chuyển:</span>
                        <span className="text-white">{formatCurrency(selectedOrder.shipping_amount)}</span>
                      </div>
                      {selectedOrder.discount_amount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span>Giảm giá:</span>
                          <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-600 my-2"></div>
                      <div className="flex justify-between font-bold text-xl">
                        <span className="text-white">Tổng cộng:</span>
                        <span className="text-green-400">{formatCurrency(selectedOrder.total_amount)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ... phần sản phẩm và ghi chú không thay đổi ... */}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrdersPage;
