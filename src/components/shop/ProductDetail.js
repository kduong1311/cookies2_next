"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, Heart, Star, ShoppingCart, Share2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchProductById } from "@/api_services/product";

export default function ProductDetail({ productId, onBack }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const fetchedProduct = await fetchProductById(productId);
        console.log(fetchedProduct);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setSelectedColor(fetchedProduct.colors?.[0] || "");
          setSelectedSize(fetchedProduct.sizes?.[0] || "");
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

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleColorChange = (color) => setSelectedColor(color);
  const handleSizeChange = (size) => setSelectedSize(size);

  const handleAddToCart = () => {
    console.log("Thêm vào giỏ hàng:", {
      productId: product.id,
      name: product.name,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: product.sale_price || product.price,
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    alert("Chuyển đến trang thanh toán!");
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
              src={product.images?.[selectedImage] || "https://res.cloudinary.com/da9rooi9r/image/upload/v1751130040/Logo_lt0d2t.png"}
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
                  <img src={image} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-cover rounded" />
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
            <span className="text-sm text-gray-400">{product.rating} ({product.totalReviews || 0} reviews)</span>
          </div>

          <div className="mb-6">
            {product.sale_price ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{parseFloat(product.sale_price).toLocaleString("vi-VN")}₫</span>
                <span className="text-lg text-gray-400 line-through">{parseFloat(product.price).toLocaleString("vi-VN")}₫</span>
                <span className="bg-red-600 px-2 py-1 text-xs rounded">
                  {Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.price)) * 100)}% Sale
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">{parseFloat(product.price).toLocaleString("vi-VN")}₫</span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Descriptions: </h3>
            <p className="text-gray-300">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors && product.colors.length > 0 ? (
                product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`px-4 py-2 rounded-md ${
                      selectedColor === color ? "bg-orange-500 text-white font-medium" : "bg-gray-800 text-white"
                    }`}
                  >
                    {color}
                  </button>
                ))
              ) : (
                <p className="text-gray-400">No colors available.</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`px-4 py-2 rounded-md ${
                      selectedSize === size ? "bg-orange-500 text-white font-medium" : "bg-gray-800 text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p className="text-gray-400">No sizes available.</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <button onClick={() => handleQuantityChange("decrease")} className="p-2 bg-gray-800 rounded-l-md hover:bg-gray-700">
                <Minus size={16} />
              </button>
              <span className="px-6 py-2 bg-gray-800 border-l border-r border-gray-700">{quantity}</span>
              <button onClick={() => handleQuantityChange("increase")} className="p-2 bg-gray-800 rounded-r-md hover:bg-gray-700">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-3 px-6 rounded-lg flex-1">
              <ShoppingCart size={20} />
              <span>Add to cart</span>
            </button>
            <button onClick={handleBuyNow} className="bg-orange-500 text-white hover:bg-orange-600 py-3 px-6 rounded-lg font-medium flex-1">
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
    </div>
  );
}
