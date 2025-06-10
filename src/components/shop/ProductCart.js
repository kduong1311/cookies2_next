"use client";
import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

// Sample cart data - replace with your actual data source
const sampleCartItems = [
    {
    id: 1,
    name: "Nồi Inox 3 Đáy",
    price: 45.99,
    quantity: 1,
    image: "/CookingImage/xo.png",
    shopName: "Kitchen Pro"
  },
  {
    id: 2,
    name: "Chảo Chống Dính",
    price: 32.50,
    quantity: 2,
    image: "/CookingImage/pan.jpg",
    shopName: "CookSmart"
  },
  {
    id: 3,
    name: "Bộ Dao Nhà Bếp",
    price: 25.00,
    quantity: 1,
    image: "/CookingImage/knifeCollection.jpg",
    shopName: "SharpEdge"
  },
  {
    id: 4,
    name: "Thớt Tre Tự Nhiên",
    price: 12.99,
    quantity: 1,
    image: "",
    shopName: "Eco Kitchen"
  },
  {
    id: 5,
    name: "Máy Xay Sinh Tố Mini",
    price: 59.99,
    quantity: 1,
    image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR8jCEVoz5dTRQqWyTdk-04eGpG4JvvjxBIL3EMDfNJp_cz0n54Rn2BcwIU4fP4GA_f2cWQee7JTF1Gve5gWclsyBlhg5X4CrL2VdcFOYI9-PFLeD5DgNnufMM7nYzxIVeg4dyvrA&usqp=CAc",
    shopName: "BlendIt"
  }
];

export default function ProductCart({ onClose }) {
  const [cartItems, setCartItems] = useState(sampleCartItems);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
  <div className="bg-black-cs text-white rounded-lg shadow-lg p-6 flex flex-col h-[83vh]">
    <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
      <h2 className="text-2xl font-bold">Shopping Cart</h2>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      )}
    </div>

    {cartItems.length === 0 ? (
      <div className="text-center py-10 flex-1 flex flex-col justify-center">
        <p className="text-gray-400 mb-4">Your cart is empty</p>
        <button className="bg-white text-black py-2 px-6 rounded-md hover-orange-bg">
          Continue Shopping
        </button>
      </div>
    ) : (
      <>
        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 hide-scrollbar mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex border-b border-gray-700 pb-4">
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="ml-4 flex-grow">
                <div className="flex justify-between">
                  <h3 className="font-medium">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.shopName}</p>
                <p className="text-gray-400 mt-1">${item.price.toFixed(2)}</p>

                <div className="flex items-center mt-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-md hover-orange-bg"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} className={item.quantity <= 1 ? "text-gray-600" : "text-white"} />
                  </button>
                  <span className="mx-3">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-md hover-orange-bg"
                  >
                    <Plus size={16} />
                  </button>
                  <div className="ml-auto font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Cart Summary at Bottom */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-400">Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button className="w-full bg-white text-black py-3 rounded-md font-medium hover-orange-bg">
            Checkout
          </button>
        </div>
      </>
    )}
  </div>
);
}
