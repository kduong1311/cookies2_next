"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadToCloudinary } from "../upload/uploadCloudinary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader,
  DollarSign,
  Palette,
  Ruler,
  Settings,
  X,
  Plus,
  Trash2,
  Package,
  Tag,
  FileImage,
  Star,
  ShoppingCart,
  Info,
  Layers,
  Hash,
  Percent,
  Box,
  Camera,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function AddProductModal({ open, onOpenChange, shopId, onSuccess }) {
  // Basic product info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  
  // Images
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Variants
  const [variants, setVariants] = useState([
    {
      sku: "",
      price: "",
      stock_quantity: "",
      color: "",
      size: "",
      material: "",
      images: [],
      previewImages: []
    }
  ]);
  
  // UI State
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    images: true,
    variants: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData();
    
    // Basic product info
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", parseFloat(price));
    formData.append("category_id", categoryId);
    formData.append("shop_id", shopId);
    formData.append("stock_quantity", parseInt(stockQuantity));
    
    if (salePrice) {
      formData.append("sale_price", parseFloat(salePrice));
    }

    // Main product images
    const uploadedImageUrls = [];
    for (const image of images) {
      const url = await uploadToCloudinary(image);
      uploadedImageUrls.push(url);
    }

      const imagesData = uploadedImageUrls.map((url, index) => ({
        url,
        position: index,
        is_primary: index === 0,
        alt_text: `${name} image ${index + 1}`,
      }));

      formData.append("images", JSON.stringify(imagesData));


    // Variants
    const variantsData = [];

    for (const [variantIndex, variant] of variants.entries()) {
      const uploadedVariantImageUrls = [];
      for (const image of variant.images) {
        const url = await uploadToCloudinary(image);
        uploadedVariantImageUrls.push(url);
      }

      variantsData.push({
        sku: variant.sku,
        price: parseFloat(variant.price) || parseFloat(price),
        stock_quantity: parseInt(variant.stock_quantity),
        color: variant.color,
        size: variant.size,
        material: variant.material,
        images: uploadedVariantImageUrls.map((url, imgIndex) => ({
          url,
          position: imgIndex,
          alt_text: `${variant.color} ${variant.size} variant`
        }))
      });
    }

formData.append("variants", JSON.stringify(variantsData));


    try {
      const res = await fetch(
        `http://103.253.145.7:3003/api/products`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      if (onSuccess) onSuccess(data.data);
      setTimeout(() => onOpenChange(false), 1500);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  const handleMainImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMainImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantImageChange = (variantIndex, e) => {
    const files = Array.from(e.target.files);
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images = [...updatedVariants[variantIndex].images, ...files];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedVariants[variantIndex].previewImages = [
          ...updatedVariants[variantIndex].previewImages,
          reader.result
        ];
        setVariants([...updatedVariants]);
      };
      reader.readAsDataURL(file);
    });
    
    setVariants(updatedVariants);
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images = updatedVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
    updatedVariants[variantIndex].previewImages = updatedVariants[variantIndex].previewImages.filter((_, i) => i !== imageIndex);
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: "",
        price: "",
        stock_quantity: "",
        color: "",
        size: "",
        material: "",
        images: [],
        previewImages: []
      }
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setSalePrice("");
    setCategoryId("");
    setStockQuantity("");
    setImages([]);
    setPreviewImages([]);
    setVariants([{
      sku: "",
      price: "",
      stock_quantity: "",
      color: "",
      size: "",
      material: "",
      images: [],
      previewImages: []
    }]);
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-y-auto max-h-[95vh] border-purple-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <Package className="w-8 h-8 text-purple-400" />
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white hover:bg-purple-500/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-400 mb-6 p-4 bg-green-400/10 rounded-lg border border-green-400/20">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Product created successfully!</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-red-400 mb-6 p-4 bg-red-400/10 rounded-lg border border-red-400/20">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <div onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleSection('basic')}
            >
              <Info className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-semibold">Basic Information</h3>
              {expandedSections.basic ? 
                <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </div>
            
            {expandedSections.basic && (
              <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/20 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Product Name *
                    </label>
                    <Input
                      placeholder="Enter product name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Category ID *
                    </label>
                    <Input
                      placeholder="Enter category ID"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Price *
                    </label>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Sale Price
                    </label>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Stock Quantity *
                    </label>
                    <Input
                      placeholder="0"
                      type="number"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      required
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Description
                  </label>
                  <Textarea
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Main Images Section */}
          <div className="space-y-4">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleSection('images')}
            >
              <FileImage className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-semibold">Product Images</h3>
              {expandedSections.images ? 
                <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </div>
            
            {expandedSections.images && (
              <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/20 space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMainImagesChange}
                    className="bg-slate-700/50 border-purple-500/30 text-white file:bg-purple-500 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.querySelector('input[type="file"][multiple]').click()}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Images
                  </Button>
                </div>
                
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-purple-500/20"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                            <Star className="w-3 h-3 inline mr-1" />
                            Primary
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMainImage(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleSection('variants')}
            >
              <Settings className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-semibold">Product Variants</h3>
              {expandedSections.variants ? 
                <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </div>
            
            {expandedSections.variants && (
              <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/20 space-y-6">
                {variants.map((variant, index) => (
                  <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-purple-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-purple-300">
                        Variant {index + 1}
                      </h4>
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-purple-300 mb-1 block">
                          <Hash className="w-4 h-4 inline mr-1" />
                          SKU
                        </label>
                        <Input
                          placeholder="SKU"
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          className="bg-slate-600/50 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-purple-300 mb-1 block">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Price
                        </label>
                        <Input
                          placeholder="Price"
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                          className="bg-slate-600/50 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-purple-300 mb-1 block">
                          <Box className="w-4 h-4 inline mr-1" />
                          Stock
                        </label>
                        <Input
                          placeholder="Stock"
                          type="number"
                          value={variant.stock_quantity}
                          onChange={(e) => updateVariant(index, 'stock_quantity', e.target.value)}
                          className="bg-slate-600/50 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-purple-300 mb-1 block">
                          <Palette className="w-4 h-4 inline mr-1" />
                          Color
                        </label>
                        <Input
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          className="bg-slate-600/50 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-purple-300 mb-1 block">
                          <Ruler className="w-4 h-4 inline mr-1" />
                          Size
                        </label>
                        <Input
                          placeholder="Size"
                          value={variant.size}
                          onChange={(e) => updateVariant(index, 'size', e.target.value)}
                          className="bg-slate-600/50 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-purple-300 mb-1 block">
                          <Layers className="w-4 h-4 inline mr-1" />
                          Material
                        </label>
                        <Input
                          placeholder="Material"
                          value={variant.material}
                          onChange={(e) => updateVariant(index, 'material', e.target.value)}
                          className="bg-slate-600/50 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                    
                    {/* Variant Images */}
                    <div>
                      <label className="text-sm font-medium text-purple-300 mb-2 block">
                        <Camera className="w-4 h-4 inline mr-1" />
                        Variant Images
                      </label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleVariantImageChange(index, e)}
                        className="bg-slate-600/50 border-purple-500/30 text-white file:bg-purple-500 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                      />
                      
                      {variant.previewImages && variant.previewImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {variant.previewImages.map((preview, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={preview}
                                alt={`Variant ${index + 1} image ${imgIndex + 1}`}
                                className="w-full h-16 object-cover rounded border border-purple-500/20"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeVariantImage(index, imgIndex)}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-purple-500/20">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              Reset Form
            </Button>
            <Button
              onClick={handleSubmit}
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin w-5 h-5" />
                  Creating Product...
                </span>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add Product
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}