"use client";
import { useState } from "react";
import { ChevronLeft, Heart, Star, ShoppingCart, Share2, Minus, Plus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail({ productId, onBack }) {
  // Mock data - thay thế bằng dữ liệu thực tế từ API hoặc props
  const product = {
    id: productId || "1",
    name: "Electric stove",
    price: 1290000,
    salePrice: 990000,
    description: "Modern electric stove featuring high-quality tempered glass surface for easy cleaning and safe usage. Its compact and elegant design fits perfectly into any kitchen space, making it ideal for everyday cooking needs.",
    features: [
      "Durable stainless steel body",
      "Fast and efficient heating technology",
      "Compact and portable design",
      "Made in Japanese"
    ],
    rating: 4.8,
    reviewCount: 124,
    images: [
      "/CookingImage/bep.jpg",
      "/CookingImage/am.jpg",
      "/CookingImage/195cd62e37e6246c35b3190d17b1f6f8.jpg",
      "/CookingImage/pan.jpg"
    ],
    colors: ["Black", "White", "Silver"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    // Xử lý thêm vào giỏ hàng
    console.log("Thêm vào giỏ hàng:", {
      productId: product.id,
      name: product.name,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: product.salePrice || product.price
    });
    // Thêm code hiển thị thông báo hoặc chuyển đến trang giỏ hàng
  };

  const handleBuyNow = () => {
    // Xử lý mua ngay
    handleAddToCart();
    // Chuyển đến trang thanh toán
    // router.push('/checkout');
  };

  const {id} = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-black-cs text-white min-h-screen px-4 py-6">
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center mb-6 text-gray-400 hover:text-white"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Phần hình ảnh sản phẩm */}
        <div className="lg:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <button className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 p-2 rounded-full">
              <Heart size={20} className="text-white" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded cursor-pointer border-2 ${selectedImage === index ? 'border-white' : 'border-transparent'}`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} - ${index + 1}`} 
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
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
                  className={i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">{product.rating} ({product.reviewCount} sold)</span>
          </div>

          <div className="mb-6">
            {product.salePrice ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{product.salePrice.toLocaleString('vi-VN')}₫</span>
                <span className="text-lg text-gray-400 line-through">{product.price.toLocaleString('vi-VN')}₫</span>
                <span className="bg-red-600 px-2 py-1 text-xs rounded">
                  {Math.round((1 - product.salePrice / product.price) * 100)}% Sale
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">{product.price.toLocaleString('vi-VN')}₫</span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Descriptions</h3>
            <p className="text-gray-300">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Feature details:</h3>
            <ul className="list-disc pl-5 text-gray-300">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`px-4 py-2 rounded-md ${
                    selectedColor === color
                      ? 'bg-orange text-white font-medium'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-2 rounded-md ${
                    selectedSize === size
                      ? 'bg-orange text-white font-medium'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <button 
                onClick={() => handleQuantityChange('decrease')}
                className="p-2 bg-gray-800 rounded-l-md"
              >
                <Minus size={16} />
              </button>
              <span className="px-6 py-2 bg-gray-800 border-l border-r border-gray-700">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange('increase')}
                className="p-2 bg-gray-800 rounded-r-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-3 px-6 rounded-lg flex-1"
            >
              <ShoppingCart size={20} />
              <span>Add to cart</span>
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-orange text-white hover:bg-gray-200 py-3 px-6 rounded-lg font-medium flex-1"
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

      {/* Phần đánh giá và sản phẩm liên quan có thể thêm ở đây */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">Feedbacks from customers</h2>
        {/* Component đánh giá sẽ được thêm ở đây */}
        <div className="text-center py-8 text-gray-400">
          No feedback available!
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800">Same product</h2>
        {/* Component sản phẩm tương tự sẽ được thêm ở đây */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="aspect-square">
                <img src="/CookingImage/am.jpg" alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-medium truncate">Sample product{item}</h3>
                <p className="text-gray-400 text-sm mt-1">660.000₫</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
