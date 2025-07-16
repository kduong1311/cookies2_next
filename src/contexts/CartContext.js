"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [buyNowItem, setBuyNowItem] = useState(null);

    const setBuyNow = (product) => {
      setBuyNowItem(product);
    };

    const clearBuyNow = () => {
      setBuyNowItem(null);
    };

  const addToCart = (product) => {
    const { id, product_id, name, price, sale_price, image, quantity = 1, variant, shop_id} = product;

    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) =>
          item.id === id && item.variant?.variant_id === variant?.variant_id
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }

      return [
        ...prev,
        {
          id,
          product_id,
          name,
          price,
          sale_price,
          image,
          quantity,
          variant, // { variant_id, color, size, material, sku, image_url }
          shop_id,
        },
      ];
    });
  };

  const removeFromCart = (productId, variantId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === productId && item.variant?.variant_id === variantId)
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount: cartItems.length,
    buyNowItem,
    setBuyNow,
    clearBuyNow,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
