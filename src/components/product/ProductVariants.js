import React from "react";
import { 
  Plus, 
  X, 
  Loader2,
  Palette,
  Layers,
  DollarSign,
  Package
} from "lucide-react";
import { uploadToCloudinary } from "../upload/uploadCloudinary";
import toast from "react-hot-toast";

const ProductVariants = ({ variants, setVariants, isUploading, setIsUploading }) => {
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        size: "",
        material: "",
        price: 0,
        image_url: "",
        stock_quantity: 0,
        sku: ""
      }
    ]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
    toast.success("Variant removed");
  };

  const handleVariantImageUpload = async (index, file) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      updateVariant(index, "image_url", imageUrl.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image. Please try again!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            Product Variants
          </h3>
          <button
            onClick={addVariant}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">No variants created yet</p>
            <button
              onClick={addVariant}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create First Variant
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-md font-semibold text-white flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    Variant {index + 1}
                  </h4>
                  {variants.length > 1 && (
                    <button
                      onClick={() => removeVariant(index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Palette className="w-3 h-3 text-pink-400" />
                      Color
                    </label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => updateVariant(index, "color", e.target.value)}
                      className="w-full p-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="e.g. Red, Blue, Black..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Package className="w-3 h-3 text-blue-400" />
                      Size
                    </label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => updateVariant(index, "size", e.target.value)}
                      className="w-full p-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="e.g. S, M, L, XL..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      value={variant.material}
                      onChange={(e) => updateVariant(index, "material", e.target.value)}
                      className="w-full p-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="e.g. Cotton, Polyester..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-green-400" />
                      Price
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                      className="w-full p-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Variant Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Variant Image (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVariantImageUpload(index, e.target.files[0])}
                      className="hidden"
                      id={`variant-image-${index}`}
                      disabled={isUploading}
                    />
                    <label
                      htmlFor={`variant-image-${index}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg cursor-pointer transition-colors"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Upload Image
                    </label>
                    
                    {variant.image_url && (
                      <div className="relative">
                        <img
                          src={variant.image_url}
                          alt="Variant"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-500"
                        />
                        <button
                          onClick={() => updateVariant(index, "image_url", "")}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={variant.stock_quantity}
                    onChange={(e) => updateVariant(index, "stock_quantity", parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-gray-600/50 border border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariants;
