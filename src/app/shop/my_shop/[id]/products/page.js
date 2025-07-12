// app/shop/dashboard/products/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CreateProductModal from "@/components/product/addProduct";

export default function ProductsPage() {
  const params = useParams();
  const shopId = params.id; // Lấy shop_id từ URL params
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);


  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://103.253.145.7:3002/api/products/shop/${shopId}`, {
          credentials: "include",
        });
        const result = await response.json();
        
        console.log("API Response:", result.data);
        
        if (result.status === "success") {
          // Transform API data to match our component structure
          const transformedProducts = result.data.data.map(product => ({
            id: product.product_id,
            name: product.name,
            category: getCategoryFromProduct(product), // Helper function to determine category
            price: parseFloat(product.price),
            stock: product.stock_quantity,
            status: getStatusFromStock(product.stock_quantity),
            image: product.images && product.images.length > 0 ? product.images[0].image_url : "📦",
            description: product.description,
            rating: parseFloat(product.rating),
            total_sales: product.total_sales,
            currency: product.currency,
            sale_price: product.sale_price,
            is_featured: product.is_featured,
            created_at: product.created_at
          }));
          
          setProducts(transformedProducts);
        } else {
          setError("Không thể tải danh sách sản phẩm");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Lỗi kết nối API");
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchProducts();
    }
  }, [shopId]);

  // Helper function to determine category based on product name/description
  const getCategoryFromProduct = (product) => {
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    
    if (name.includes('phone') || name.includes('iphone') || name.includes('điện thoại')) {
      return 'Điện thoại';
    } else if (name.includes('laptop') || name.includes('macbook') || name.includes('computer')) {
      return 'Laptop';
    } else if (name.includes('tablet') || name.includes('ipad')) {
      return 'Tablet';
    } else if (name.includes('scale') || name.includes('bowl') || name.includes('kitchen')) {
      return 'Nhà bếp';
    } else {
      return 'Phụ kiện';
    }
  };

  // Helper function to determine status based on stock
  const getStatusFromStock = (stock) => {
    if (stock === 0) return "Hết hàng";
    if (stock < 10) return "Sắp hết";
    return "Còn hàng";
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Còn hàng": return "bg-green-500";
      case "Sắp hết": return "bg-yellow-500";
      case "Hết hàng": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatPrice = (price, currency = "USD") => {
    if (currency === "VND") {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(price);
    }
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải danh sách sản phẩm...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-blue-400">📦</span>
            Quản lý sản phẩm
          </h1>
          <p className="text-gray-400">Thêm, sửa, xóa và quản lý sản phẩm</p>
        </div>
        <Link
          href={`/shop/my_shop/${shopId}`}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ← Về Dashboard
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{products.length}</div>
          <div className="text-blue-100">Tổng sản phẩm</div>
        </div>
        <div className="bg-green-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{products.filter(p => p.status === "Còn hàng").length}</div>
          <div className="text-green-100">Còn hàng</div>
        </div>
        <div className="bg-yellow-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{products.filter(p => p.status === "Sắp hết").length}</div>
          <div className="text-yellow-100">Sắp hết hàng</div>
        </div>
        <div className="bg-red-600 p-4 rounded-xl text-white">
          <div className="text-2xl font-bold">{products.filter(p => p.status === "Hết hàng").length}</div>
          <div className="text-red-100">Hết hàng</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none flex-1"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Thêm sản phẩm
        </Button>

        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Danh sách sản phẩm ({filteredProducts.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="text-left text-white font-medium p-4">Sản phẩm</th>
                <th className="text-left text-white font-medium p-4">Danh mục</th>
                <th className="text-left text-white font-medium p-4">Giá</th>
                <th className="text-left text-white font-medium p-4">Tồn kho</th>
                <th className="text-left text-white font-medium p-4">Trạng thái</th>
                <th className="text-left text-white font-medium p-4">Đánh giá</th>
                <th className="text-left text-white font-medium p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-8">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {typeof product.image === 'string' && product.image.startsWith('http') ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                        <div>
                          <div className="text-white font-medium">{product.name}</div>
                          <div className="text-gray-400 text-sm">{product.description}</div>
                          {product.is_featured && (
                            <span className="inline-block bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-medium mt-1">
                              Nổi bật
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{product.category}</td>
                    <td className="p-4">
                      <div className="text-white font-medium">{formatPrice(product.price, product.currency)}</div>
                      {product.sale_price && (
                        <div className="text-green-400 text-sm">
                          Giảm: {formatPrice(product.sale_price, product.currency)}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-300">{product.stock}</td>
                    <td className="p-4">
                      <span className={`${getStatusColor(product.status)} text-white px-3 py-1 rounded-full text-sm`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-yellow-400">
                        ⭐ {product.rating} ({product.total_sales} bán)
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddForm || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Tên sản phẩm"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.name || ""}
              />
              <input
                type="text"
                placeholder="Mô tả"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.description || ""}
              />
              <select 
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.category || ""}
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Giá (USD)"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.price || ""}
                step="0.01"
              />
              <input
                type="number"
                placeholder="Số lượng tồn kho"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                defaultValue={editingProduct?.stock || ""}
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingProduct ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  <CreateProductModal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  shopId={shopId}
  onSuccess={(newProduct) => {
    setShowCreateModal(false);
  }}
/>
}


