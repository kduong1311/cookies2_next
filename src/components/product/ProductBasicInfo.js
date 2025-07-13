import React from "react";
import { 
  Package, 
  Info,
  Tag,
  DollarSign
} from "lucide-react";

const ProductBasicInfo = ({ product, setProduct, categories, isLoading }) => {
  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
        <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-orange-500" />
          Tên sản phẩm *
        </label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
          placeholder="Nhập tên sản phẩm..."
        />
      </div>

      {/* Description */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
        <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-orange-500" />
          Mô tả sản phẩm
        </label>
        <textarea
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 resize-none transition-all duration-300"
          placeholder="Mô tả chi tiết về sản phẩm..."
          rows={4}
        />
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
          <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            Giá cơ bản *
          </label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
          <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-500" />
            Danh mục *
          </label>
          <select
            value={product.category_id}
            onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white transition-all duration-300"
            disabled={isLoading}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;