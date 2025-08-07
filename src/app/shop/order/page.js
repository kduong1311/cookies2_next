"use client";
import React, { useState, useEffect } from 'react';
import { Package, MapPin, CreditCard, Truck, ShoppingCart, CheckCircle, AlertCircle, Wallet, Banknote, HandCoins} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";

const OrderPage = () => {
  const {cartItems, buyNowItem, clearBuyNow} = useCart();
  const [orderItems, setOrderItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
  const fetchShippingAddress = async () => {
    try {
      const res = await axios.get('http://103.253.145.7:3000/api/users/shipping-address/', {
        withCredentials: true,
      });
      const address = res.data.data;
      if (address) {
        setShippingAddress({
          fullName: address.recipient_name || '',
          phone_number: address.contact_number || '',
          address: address.address || '',
          city: address.city || '',
          district: address.district || '',
          ward: address.ward || '',
          country: address.country || '',
          postalCode: address.postal_code || ''
        });
      }
    } catch (error) {
      console.error("Failed to fetch shipping address:", error);
    }
  };
  fetchShippingAddress();
}, []);

    useEffect(() => {
    if (buyNowItem) {
      setOrderItems([buyNowItem]);
    } else {
      setOrderItems(cartItems);
    }
  }, [buyNowItem, cartItems]);


  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone_number: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    country: '',
    postalCode: ''
  });
  const [updateShipping, setUpdateShipping] = useState(false);

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 3, time: '3-5 days' },
    { id: 'express', name: 'Express Shipping', price: 5, time: '1-2 days' },
    { id: 'same_day', name: 'Same Day Delivery', price: 8, time: 'Same day' }
  ];

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5 text-orange-500" /> },
    { id: 'e_wallet', name: 'E-Wallet', icon: <Wallet className="w-5 h-5 text-orange-500" /> },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: <Banknote className="w-5 h-5 text-orange-500" /> },
    { id: 'cod', name: 'Cash on Delivery', icon: <HandCoins className="w-5 h-5 text-orange-500" /> }
  ];

  const vouchers = [
    { id: 'DISCOUNT15', name: '15% Off', discount: 0.15, minOrder: 50 },
    { id: 'DISCOUNT20', name: '20% Off', discount: 0.20, minOrder: 100 }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = shippingOptions.find(option => option.id === shippingMethod)?.price || 0;
  const tax = subtotal * 0.08; // 8% tax
  
  const availableVouchers = vouchers.filter(voucher => subtotal >= voucher.minOrder);
  const voucherDiscount = selectedVoucher ? 
    (availableVouchers.find(v => v.id === selectedVoucher)?.discount || 0) * subtotal : 0;
  
  const total = subtotal + shippingFee + tax - voucherDiscount;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: "USD"
    }).format(amount);
  };

  const formatCurrencyVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

const handleSubmit = async () => {
  if (
    !shippingAddress.fullName ||
    !shippingAddress.phone_number ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.district ||
    !shippingAddress.ward
  ) {
    toast.error('Please fill in all shipping address information!');
    return;
  }

  setIsLoading(true);

  try {
    const orderData = {
      items: orderItems.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant?.variant_id,
        quantity: item.quantity,
        shop_id: item.shop_id
      })),
      payment_method: paymentMethod,
      shipping_method: shippingMethod,
      notes: notes,
      subtotal: subtotal,
      discount_amount: voucherDiscount,
      total_amount: total,
      shipping_address: shippingAddress
    };

    await axios.post('http://103.253.145.7:8080/api/orders', orderData, {
      withCredentials: true,
    });

    setOrderSuccess(true);
    clearBuyNow();
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('An error occurred while placing the order. Please try again!');
  } finally {
    setIsLoading(false);
  }

  if (updateShipping) {
    try {
      await axios.put('http://103.253.145.7:3000/api/users/shipping-address/', {
        recipient_name: shippingAddress.fullName,
        contact_number: shippingAddress.phone_number,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country,
        district: shippingAddress.district,
        ward: shippingAddress.ward,
        postal_code: shippingAddress.postalCode
      }, {
        withCredentials: true,
      });
    } catch (err) {
      console.error('Failed to update shipping address:', err);
    }
  }
};


  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order placed successfully!</h2>
          <p className="text-gray-600 mb-6">Your order has been confirmed and will be processed as soon as possible.</p>
          <button 
            onClick={() => router.push('/shop')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Place a new order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-orange mb-8 flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3" />
            Place Order
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-orange mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={shippingAddress.fullName || ''}
                    onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={shippingAddress.phone_number || ''}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone_number: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={shippingAddress.address || ''}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={shippingAddress.country || ''}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={shippingAddress.postalCode || ''}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city || ''}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="District"
                    value={shippingAddress.district || ''}
                    onChange={(e) => setShippingAddress({...shippingAddress, district: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ward"
                    value={shippingAddress.ward || ''}
                    onChange={(e) => setShippingAddress({...shippingAddress, ward: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="update-shipping"
                  checked={updateShipping}
                  onChange={e => setUpdateShipping(e.target.checked)}
                  className="mr-2 w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="update-shipping" className="text-gray-300 text-sm">
                  Update my saved shipping address with this information
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1 mb-2">Check this if you want to update your saved shipping address for future orders.</p>

              <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-orange mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className="flex items-center p-3 border border-gray-200 rounded-md hover-orange-bg cursor-pointer">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={shippingMethod === option.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{option.name}</span>
                          <span className="text-orange font-semibold">{formatCurrency(option.price)}</span>
                        </div>
                        <p className="text-sm text-gray-400">{option.time}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-orange mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-md hover-orange-white-bg cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-xl mr-2">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-orange mb-4">Voucher</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-md hover-orange-bg cursor-pointer">
                    <input
                      type="radio"
                      name="voucher"
                      value=""
                      checked={selectedVoucher === ''}
                      onChange={(e) => setSelectedVoucher(e.target.value)}
                      className="mr-3"
                    />
                    <span>No voucher</span>
                  </label>
                  {availableVouchers.map((voucher) => (
                    <label key={voucher.id} className="flex items-center p-3 border border-gray-200 rounded-md hover-orange-bg cursor-pointer">
                      <input
                        type="radio"
                        name="voucher"
                        value={voucher.id}
                        checked={selectedVoucher === voucher.id}
                        onChange={(e) => setSelectedVoucher(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{voucher.name}</span>
                          <span className="text-green-600 font-semibold">-{formatCurrency(voucher.discount * subtotal)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Minimum order: {formatCurrency(voucher.minOrder)}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-orange mb-4">Notes</h2>
                <textarea
                  placeholder="Notes for the order (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-950 p-6 rounded-lg shadow-sm sticky top-8">
                <h2 className="text-xl font-semibold text-orange mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Your Order
                </h2>

                <div className="space-y-4 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-600">
                        {item.variant
                          ? `${item.variant.color || ''} | ${item.variant.size || ''} | ${item.variant.material || ''}`
                          : ''}
                      </p>
                        <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping Fee:</span>
                    <span>{formatCurrency(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%):</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(voucherDiscount)}</span>
                    </div>
                  )}
                  <div className="flex flex-col border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600"> ${formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-end font-semibold text-base">
                    <span className="text-blue-600">{formatCurrencyVND(total * 25000)}</span>
                  </div>
                </div>

                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;