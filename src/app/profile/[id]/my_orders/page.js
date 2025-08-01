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
import {Eye, Package, CreditCard, Truck, Calendar, DollarSign, Store, ShoppingBag, Clock, Check, X, Star
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
    return new Date(dateStr).toLocaleDateString('en-US', {
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
          <p className="mt-6 text-gray-300 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 p-4 overflow-y-auto hide-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-orange-500 rounded-xl">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
              <p className="text-gray-400 text-lg">Manage and track your orders</p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-24"></div>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700 text-center py-16">
            <CardContent className="space-y-6">
              <div className="relative">
                <div className="p-4 bg-gray-700 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 p-2 bg-orange-500 rounded-full">
                  <X className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">No orders yet</h3>
                <p className="text-gray-400">You don't have any orders yet. Start shopping!</p>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg">
                Explore Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <Card key={order.order_id} className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">
                          {order.order_number}
                        </h3>
                        <p className="text-gray-400 flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusColor(order.order_status)} flex items-center space-x-1 px-3 py-1 rounded-full border`}>
                        {getStatusIcon(order.order_status)}
                        <span className="capitalize font-medium">{order.order_status}</span>
                      </Badge>
                      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOrderClick(order)}
                            className="bg-gray-700 border-gray-600 text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-xl">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="font-bold text-xl text-green-400">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-xl">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Payment</p>
                        <p className="font-semibold text-white capitalize">
                          {order.payment_method.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-xl">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Shipping</p>
                        <p className="font-semibold text-white capitalize">
                          {order.shipping_method}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-orange-500" />
                      <span className="text-gray-300">
                        {order.items.length} products
                      </span>
                    </div>
                    {order.order_number && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>Tracking Code:</span>
                        <span className="font-mono text-orange-400 bg-gray-700 px-2 py-1 rounded">
                          {order.order_number}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Processing</span>
                      <span>Completed</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: order.order_status === 'pending' ? '25%' : 
                                order.order_status === 'processing' ? '50%' : 
                                order.order_status === 'shipped' ? '75%' : 
                                order.order_status === 'delivered' ? '100%' : '0%'
                        }}
                      ></div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-orange-300 text-sm">
                        <strong>Notes:</strong> {order.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-gray-800 border-gray-700 text-white p-0">
            <DialogHeader className="border-b border-gray-700 pb-4 px-6 pt-6">
              <DialogTitle className="flex items-center space-x-3 text-2xl">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span>Order Details {selectedOrder?.order_number}</span>
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6 px-6 pb-6">
                {loadingDetails && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-orange-500"></div>
                    <span className="ml-3 text-gray-300">Loading details...</span>
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="border-b border-gray-600">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Package className="h-5 w-5 text-orange-500" />
                        <span>Order Information</span>
                      </CardTitle>
                    </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Order ID:</span>
                          <span className="font-mono text-orange-400 bg-gray-800 px-3 py-1 rounded">
                            {selectedOrder.order_number}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Order Date:</span>
                          <span className="text-white">{formatDate(selectedOrder.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Status:</span>
                          <Badge className={`${getStatusColor(selectedOrder.order_status)} flex items-center space-x-1`}>
                            {getStatusIcon(selectedOrder.order_status)}
                            <span className="capitalize">{selectedOrder.order_status}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Payment:</span>
                          <span className="text-white capitalize">
                            {selectedOrder.payment_method.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Shipping:</span>
                          <span className="text-white capitalize">{selectedOrder.shipping_method}</span>
                        </div>
                                              {selectedOrder.order_number && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Tracking Code:</span>
                            <span className="font-mono text-orange-400 bg-gray-800 px-3 py-1 rounded">
                              {selectedOrder.order_number}
                            </span>
                          </div>
                        )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="border-b border-gray-600">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <span>Payment Summary</span>
                      </CardTitle>
                    </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Subtotal:</span>
                          <span className="text-white">{formatCurrency(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Tax:</span>
                          <span className="text-white">{formatCurrency(selectedOrder.tax_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Shipping Fee:</span>
                          <span className="text-white">{formatCurrency(selectedOrder.shipping_amount)}</span>
                        </div>
                        {selectedOrder.discount_amount > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span>Discount:</span>
                            <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-600 my-2"></div>
                        <div className="flex justify-between font-bold text-xl">
                          <span className="text-white">Total:</span>
                          <span className="text-green-400">{formatCurrency(selectedOrder.total_amount)}</span>
                        </div>
                    </CardContent>
                  </Card>
                </div>

                 <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="border-b border-gray-600">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 text-orange-500" />
                      <span>Ordered Products</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div key={item.order_item_id} className="flex items-center space-x-4 p-4 bg-gray-800 border border-gray-600 rounded-lg hover:border-orange-500 transition-colors">
                          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center overflow-hidden">
                            {orderDetails.products && orderDetails.products[item.product_id] && orderDetails.products[item.product_id].images && orderDetails.products[item.product_id].images.length > 0 ? (
                              <img 
                                src={orderDetails.products[item.product_id].images.find(img => img.is_primary)?.image_url || orderDetails.products[item.product_id].images[0].image_url} 
                                alt={item.product_name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <Package className={`h-10 w-10 text-white ${orderDetails.products && orderDetails.products[item.product_id] && orderDetails.products[item.product_id].images && orderDetails.products[item.product_id].images.length > 0 ? 'hidden' : 'block'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-lg mb-2 truncate">
                              {item.product_name}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-300">
                              <div className="flex items-center space-x-4 flex-wrap">
                                <span className="bg-gray-700 px-2 py-1 rounded">SKU: {item.sku}</span>
                                <span>Color: {item.color}</span>
                                <span>Size: {item.size}</span>
                              </div>
                              <p>Material: {item.material}</p>
                            </div>
                            {orderDetails.shops && orderDetails.shops[item.shop_id] && (
                              <div className="flex items-center mt-3 text-sm">
                                <Store className="h-4 w-4 mr-2 text-orange-500" />
                                <span className="text-orange-300 font-medium">
                                  {orderDetails.shops[item.shop_id].name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-xl text-white mb-1">
                              {formatCurrency(item.price)}
                            </p>
                            <p className="text-gray-400 mb-2">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-lg font-bold text-green-400">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedOrder.notes && (
                  <Card className="bg-orange-500/10 border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="text-orange-300 flex items-center space-x-2">
                        <Star className="h-5 w-5" />
                        <span>Notes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-orange-100 text-lg">{selectedOrder.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrdersPage;