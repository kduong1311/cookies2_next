"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, Heart, Star, ShoppingCart, Share2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchProductById } from "@/api_services/product";
import AddToCartModal from "./AddToCartModal";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";

export default function ProductDetail({ productId, onBack }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const { addToCart, setBuyNow} = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const fetchedProduct = await fetchProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setError(null);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Get total stock quantity from all variants
  const getTotalStock = () => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => {
        return total + (variant.stock_quantity || 0);
      }, 0);
    }
    return product?.stock_quantity || 0;
  };

  // Get price range for display
  const getPriceRange = () => {
    if (!product?.variants || product.variants.length === 0) {
      return {
        minPrice: product?.price,
        maxPrice: product?.price,
        minSalePrice: product?.sale_price,
        maxSalePrice: product?.sale_price
      };
    }

    const prices = product.variants.map(v => parseFloat(v.price));
    const salePrices = product.variants.map(v => v.sale_price ? parseFloat(v.sale_price) : null).filter(Boolean);

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minSalePrice: salePrices.length > 0 ? Math.min(...salePrices) : null,
      maxSalePrice: salePrices.length > 0 ? Math.max(...salePrices) : null
    };
  };

  const handleQuantityChange = (action) => {
    const maxQuantity = getTotalStock();
    if (action === "increase" && quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    setCartModalOpen(true);
  };

  const handleAddToCartConfirmed = (item) => {
    addToCart(item);
    setCartModalOpen(false);
    toast.success("Added to cart!")
  };

  const handleBuyNow = () => {
    const totalStock = getTotalStock();
    if (totalStock === 0) {
      toast.error("Sold out")
      return;
    }
    handleAddToCart();
  };

  if (loading) {
    return (
      <div className="bg-black-cs text-white min-h-screen flex items-center justify-center">
        <div>Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-black-cs text-white min-h-screen px-4 py-6">
        <button onClick={() => router.back()} className="flex items-center mb-6 text-gray-400 hover:text-white">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <div className="text-center py-8 text-red-500">{error || "Product not found"}</div>
      </div>
    );
  }

  const totalStock = getTotalStock();
  const priceRange = getPriceRange();

  return (
    <div className="bg-black-cs text-white min-h-screen px-4 py-6">
      {/* Nút quay lại */}
      <button onClick={() => router.back()} className="flex items-center mb-6 text-gray-400 hover:text-white">
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Phần hình ảnh sản phẩm */}
        <div className="lg:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
            <img
              src={product.images?.[selectedImage]?.image_url || product.images?.[selectedImage] || "https://res.cloudinary.com/da9rooi9r/image/upload/v1751130040/Logo_lt0d2t.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 p-2 rounded-full">
              <Heart size={20} className="text-white" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded cursor-pointer border-2 ${
                    selectedImage === index ? "border-white" : "border-transparent"
                  }`}
                >
                  <img src={image.image_url || image} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-cover rounded" />
                </div>
              ))
            ) : (
              <div className="aspect-square rounded border border-gray-700 flex items-center justify-center text-gray-400">
                No images
              </div>
            )}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="lg:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(parseFloat(product.rating)) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">{product.rating} ({product.total_reviews || 0} reviews)</span>
          </div>

          {/* Price Display */}
          <div className="mb-4">
            {product.variants && product.variants.length > 0 ? (
              <div>
                {priceRange.minSalePrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      ${priceRange.minSalePrice.toFixed(2)}
                      {priceRange.minSalePrice !== priceRange.maxSalePrice && ` - $${priceRange.maxSalePrice.toFixed(2)}`}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${priceRange.minPrice.toFixed(2)}
                      {priceRange.minPrice !== priceRange.maxPrice && ` - $${priceRange.maxPrice.toFixed(2)}`}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">
                    ${priceRange.minPrice.toFixed(2)}
                    {priceRange.minPrice !== priceRange.maxPrice && ` - $${priceRange.maxPrice.toFixed(2)}`}
                  </span>
                )}
              </div>
            ) : (
              <div>
                {product.sale_price ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">${parseFloat(product.sale_price).toFixed(2)}</span>
                    <span className="text-lg text-gray-400 line-through">${parseFloat(product.price).toFixed(2)}</span>
                    <span className="bg-red-600 px-2 py-1 text-xs rounded">
                      {Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.price)) * 100)}% Sale
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">${parseFloat(product.price).toFixed(2)}</span>
                )}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            <span className={`text-sm font-medium ${totalStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalStock > 0 ? `In Stock (${totalStock} available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description:</h3>
            <p className="text-gray-300">{product.description}</p>
          </div>

          {/* Variants Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Available Options:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.slice(0, 4).map((variant) => (
                  <div
                    key={variant.variant_id}
                    className="p-3 rounded-lg border border-gray-700 bg-gray-800"
                  >
                    <div className="flex justify-between items-start mb-2">
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
                        <div className={`text-xs ${variant.stock_quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {variant.stock_quantity > 0 ? `${variant.stock_quantity} in stock` : 'Out of stock'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {product.variants.length > 4 && (
                  <div className="p-3 rounded-lg border border-gray-700 bg-gray-800 flex items-center justify-center">
                    <span className="text-sm text-gray-400">+{product.variants.length - 4} more options</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={handleAddToCart} 
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-3 px-6 rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={totalStock === 0}
            >
              <ShoppingCart size={20} />
              <span>Add to cart</span>
            </button>
            <button 
              onClick={handleBuyNow} 
              className="bg-orange-500 text-white hover:bg-orange-600 py-3 px-6 rounded-lg font-medium flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={totalStock === 0}
            >
              Buy Now
            </button>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white">
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white">
              <Heart size={18} />
              <span>Add to favorite list</span>
            </button>
          </div>
        </div>
      </div>

      <AddToCartModal
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        product={product}
        onAddToCart={(item) => addToCart(item)}
        onBuyNow={(item) => {
          setBuyNow(item);
          router.push("/shop/order")
        }}
      />
    </div>
  );
}