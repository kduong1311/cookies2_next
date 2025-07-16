"use client";
import { useState } from "react";
import { X, Plus, Minus, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function ProductCart({ onClose }) {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    clearBuyNow,
  } = useCart();

  const [items, setItems] = useState(cartItems);

  const totalPrice = items.reduce((total, item) => {
    return total + (Number(item.sale_price) || Number(item.price)) * item.quantity;
  }, 0);

  const increaseQuantity = (id, variantId) => {
    const updatedItems = items.map(item =>
      item.id === id && item.variant?.variant_id === variantId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setItems(updatedItems);
  };

  const decreaseQuantity = (id, variantId) => {
    const updatedItems = items.map(item =>
      item.id === id && item.variant?.variant_id === variantId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setItems(updatedItems);
  };

  const handleRemove = (id, variantId) => {
    const updated = items.filter(item => !(item.id === id && item.variant?.variant_id === variantId));
    setItems(updated);
    removeFromCart(id, variantId); // Remove from context
  };

  const handleCheckout = () => {
    clearBuyNow();
    router.push("/shop/order");
  }

  return (
    <div className="bg-black-cs text-white rounded-lg shadow-lg p-6 flex flex-col h-[83vh]">
      {/* Header with Back */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Empty Cart */}
      {items.length === 0 ? (
        <div className="text-center py-10 flex-1 flex flex-col justify-center">
          <p className="text-gray-400 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-black py-2 px-6 rounded-md hover:bg-orange-500"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 hide-scrollbar mb-6">
            {items.map((item) => (
              <div
                key={item.id + (item.variant?.variant_id || "")}
                className="flex border-b border-gray-700 pb-4"
              >
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <button
                      onClick={() => handleRemove(item.id, item.variant?.variant_id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Variant Info */}
                  {item.variant ? (
                     <div className="text-sm text-gray-500 mt-1">
                      {[item.variant.color, item.variant.size, item.variant.material]
                        .filter(Boolean) // loại bỏ undefined/null
                        .join(" | ")}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">{item.shopName}</p>
                  )}

                  {/* Price */}
                  <p className="text-gray-400 mt-1">
                    ${(Number(item.sale_price) || Number(item.price)).toFixed(2)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id, item.variant?.variant_id)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-md hover:bg-orange-500"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} className={item.quantity <= 1 ? "text-gray-600" : "text-white"} />
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id, item.variant?.variant_id)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-md hover:bg-orange-500"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="ml-auto font-medium">
                      ${((Number(item.sale_price) || Number(item.price)) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button className="w-full bg-white text-black py-3 rounded-md font-medium hover:bg-orange-500"
                    onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
