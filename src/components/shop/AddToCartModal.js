"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function AddToCartModal({ open, onClose, product, onAddToCart, onBuyNow}) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open && product) {
      if (product.variants && product.variants.length > 0) {
        const availableVariant = product.variants.find(v => v.stock_quantity > 0);
        setSelectedVariant(availableVariant || product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setQuantity(1);
    }
  }, [open, product]);

  if (!product) return null;

  const handleQuantityChange = (type) => {
    const maxStock = selectedVariant?.stock_quantity || product.stock_quantity || 0;
    if (type === "increase" && quantity < maxStock) {
      setQuantity(q => q + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

const getItemPayload = () => {
  const base = {
    id: product.id + (selectedVariant ? `-${selectedVariant.variant_id}` : ""),
    product_id: product.id,
    shop_id: product.shop_id,
    name: product.name,
    price: selectedVariant?.price || product.price,
    sale_price: selectedVariant?.sale_price || product.sale_price,
    image: selectedVariant?.image_url || product.images?.[0]?.image_url || product.images?.[0],
    quantity,
    variant: selectedVariant
      ? {
          variant_id: selectedVariant.variant_id,
          color: selectedVariant.color,
          size: selectedVariant.size,
          material: selectedVariant.material,
          sku: selectedVariant.sku,
          image_url: selectedVariant.image_url,
        }
      : null,
  };

  console.log("base", base)
  return base;

};

const handleAddToCart = () => {
  if (!canAddToCart) return;
  const item = getItemPayload();
  onAddToCart(item);
  onClose();
};

const handleBuyNow = () => {
  if (!canAddToCart) return;
  const item = getItemPayload();
  onBuyNow(item);
  onClose();
};

  const maxStock = selectedVariant?.stock_quantity || product.stock_quantity || 0;
  const canAddToCart = maxStock > 0 && quantity >= 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black-cs text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Cart</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-4 p-4 bg-gray-800 rounded-lg">
            <img
              src={selectedVariant?.image_url || product.images?.[0]?.image_url || product.images?.[0] || "https://res.cloudinary.com/da9rooi9r/image/upload/v1751130040/Logo_lt0d2t.png"}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium">{product.name}</h3>
              <div className="text-sm text-gray-400 mt-1">
                {selectedVariant ? (
                  <div>
                    {selectedVariant.color && <span>Color: {selectedVariant.color}</span>}
                    {selectedVariant.size && <span className="ml-2">Size: {selectedVariant.size}</span>}
                    {selectedVariant.material && <span className="ml-2">Material: {selectedVariant.material}</span>}
                  </div>
                ) : (
                  <span>Standard version</span>
                )}
              </div>
              <div className="text-sm font-medium mt-1">
                {selectedVariant ? (
                  selectedVariant.sale_price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400">${parseFloat(selectedVariant.sale_price).toFixed(2)}</span>
                      <span className="text-gray-400 line-through text-xs">${parseFloat(selectedVariant.price).toFixed(2)}</span>
                    </div>
                  ) : (
                    <span>${parseFloat(selectedVariant.price).toFixed(2)}</span>
                  )
                ) : (
                  product.sale_price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400">${parseFloat(product.sale_price).toFixed(2)}</span>
                      <span className="text-gray-400 line-through text-xs">${parseFloat(product.price).toFixed(2)}</span>
                    </div>
                  ) : (
                    <span>${parseFloat(product.price).toFixed(2)}</span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Variant selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Select Variant</h4>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto hide-scrollbar">
                {product.variants.map((variant) => (
                  <div
                    key={variant.variant_id}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                      selectedVariant?.variant_id === variant.variant_id
                        ? "border-orange-500 bg-orange-500 bg-opacity-10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    } ${variant.stock_quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => variant.stock_quantity > 0 && setSelectedVariant(variant)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-1">
                          {variant.color && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {variant.color}
                            </span>
                          )}
                          {variant.size && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {variant.size}
                            </span>
                          )}
                          {variant.material && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {variant.material}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium">
                          {variant.sale_price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-orange-400">${parseFloat(variant.sale_price).toFixed(2)}</span>
                              <span className="text-gray-400 line-through text-xs">${parseFloat(variant.price).toFixed(2)}</span>
                            </div>
                          ) : (
                            <span>${parseFloat(variant.price).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs ${variant.stock_quantity > 0 ? 'text-white' : 'text-red-400'}`}>
                          {variant.stock_quantity > 0 ? `${variant.stock_quantity} in stock` : 'Out of stock'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Quantity</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-700 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="text-white hover:bg-gray-700"
                >
                  <Minus size={16} />
                </Button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= maxStock}
                  className="text-white hover:bg-gray-700"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <span className="text-sm text-gray-400">
                {maxStock > 0 ? `${maxStock} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Total Price */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Total:</span>
              <span className="text-lg font-bold">
                {selectedVariant ? (
                  <span>${(parseFloat(selectedVariant.sale_price || selectedVariant.price) * quantity).toFixed(2)}</span>
                ) : (
                  <span>${(parseFloat(product.sale_price || product.price) * quantity).toFixed(2)}</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-700 text-black hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={!canAddToCart}
            >
              Add to Cart
            </Button>
            <Button
            onClick={handleBuyNow}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            disabled={!canAddToCart}
          >
            Buy now
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}