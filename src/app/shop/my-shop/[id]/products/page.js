"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddProductModal from "@/components/product/AddProductModal";
import Link from "next/link";

// Helpers
const getStatusFromStock = (stock) => {
  if (stock === 0) return "Out of Stock";
  if (stock < 10) return "Low Stock";
  return "In Stock";
};

const getCategoryFromProduct = (product) => {
  return product.categories?.[0]?.name || "Uncategorized";
};

export default function ProductsPage() {
  const params = useParams();
  const shopId = params.id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://103.253.145.7:3003/api/categories");
        const result = await res.json();
        if (result.status === "success") {
          setCategoriesData(result.data);
        }
      } catch (error) {
        console.error("Error get categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://103.253.145.7:3002/api/products/shop/${shopId}`, {
          credentials: "include",
        });
        const result = await response.json();

        if (result.status === "success") {
          const transformedProducts = result.data.data.map((product) => ({
            id: product.product_id,
            name: product.name,
            category: getCategoryFromProduct(product),
            price: parseFloat(product.price),
            stock: product.stock_quantity,
            status: getStatusFromStock(product.stock_quantity),
            image: product.images?.[0]?.image_url || "📦",
            description: product.description,
            rating: parseFloat(product.rating),
            total_sales: product.total_sales,
            currency: product.currency,
            sale_price: product.sale_price,
            is_featured: product.is_featured,
            created_at: product.created_at,
          }));

          setProducts(transformedProducts);
        } else {
          setError("Can not get products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error connect API");
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchProducts();
    }
  }, [shopId]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await fetch(`http://103.253.145.7:3003/api/products/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.status === "success") {
          setProducts(products.filter((p) => p.id !== id));
        } else {
          alert("Delete Fail: " + (result.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Can not delete, Error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-500";
      case "Low Stock":
        return "bg-yellow-500";
      case "Out of Stock":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatPrice = (price, currency = "USD") => {
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-400 text-xl">
        {error}
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
          <p className="text-gray-400">Manage Products</p>
        </div>
        <Link
          href={`/shop/my-shop/${shopId}`}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          ← Back
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: "Totals", value: products.length, color: "blue" },
          {
            label: "In Stock",
            value: products.filter((p) => p.status === "In Stock").length,
            color: "green",
          },
          {
            label: "Low Stock",
            value: products.filter((p) => p.status === "Low Stock").length,
            color: "yellow",
          },
          {
            label: "Out of Stock",
            value: products.filter((p) => p.status === "Out of Stock").length,
            color: "red",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-${item.color}-600 p-4 rounded-xl text-white`}
          >
            <div className="text-2xl font-bold">{item.value}</div>
            <div className={`text-${item.color}-100`}>{item.label}</div>
          </div>
        ))}
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
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            >
              <option value="all">Tất cả danh mục</option>
              {categoriesData.map((category) => (
                <option key={category.category_id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            ➕ Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Add Modal */}
      <AddProductModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        shopId={shopId}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newProduct) => {
          setProducts([...products, newProduct]);
        }}
      />

      {/* Product Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Product list ({filteredProducts.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50 text-left text-white">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-8">
                    Products not found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-700 hover:bg-gray-700/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.image?.startsWith("http") ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                        <div>
                          <div className="text-white font-medium">
                            {product.name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {product.description}
                          </div>
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
                      <div className="text-white font-medium">
                        {formatPrice(product.price, product.currency)}
                      </div>
                      {product.sale_price && (
                        <div className="text-green-400 text-sm">
                          Giảm: {formatPrice(product.sale_price, product.currency)}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-300">{product.stock}</td>
                    <td className="p-4">
                      <span
                        className={`${getStatusColor(product.status)} text-white px-2 py-0.5 rounded-full text-xs`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-yellow-400">
                      ⭐ {product.rating} ({product.total_sales} sale)
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
