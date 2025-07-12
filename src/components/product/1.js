"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Package, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Loader,
  Camera,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  X,
  DollarSign,
  Tag,
  Palette,
  Ruler,
  Settings
} from 'lucide-react';

import { uploadToCloudinary } from "@/components/upload/uploadCloudinary";

export default function CreateProductModal({ isOpen, onClose, shopId, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    shop_id: shopId || ''
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([
    {
      sku: '',
      price: '',
      stock_quantity: '',
      color: '',
      size: '',
      material: '',
      image_url: ''
    }
  ]);

  const [uploadingImages, setUploadingImages] = useState({});
  const [uploadingVariantImages, setUploadingVariantImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch categories on mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      shop_id: shopId || ''
    });
    setImages([]);
    setVariants([{
      sku: '',
      price: '',
      stock_quantity: '',
      color: '',
      size: '',
      material: '',
      image_url: ''
    }]);
    setFieldErrors({});
    setError('');
    setSuccess(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://103.253.145.7:3003/api/categories', {
        credentials: "include"
      });
      const data = await response.json();
      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, {
      sku: '',
      price: '',
      stock_quantity: '',
      color: '',
      size: '',
      material: '',
      image_url: ''
    }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chỉ chọn file hình ảnh');
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file không được vượt quá 5MB');
        continue;
      }

      const imageId = Date.now() + Math.random();
      setUploadingImages(prev => ({
        ...prev,
        [imageId]: true
      }));

      try {
        const url = await uploadToCloudinary(file);
        
        setImages(prev => [...prev, {
          id: imageId,
          url: url,
          thumbnail_url: url,
          alt_text: file.name,
          position: prev.length,
          is_primary: prev.length === 0
        }]);
        
        setError('');
      } catch (error) {
        setError(`Lỗi upload hình ảnh: ${error.message}`);
      } finally {
        setUploadingImages(prev => {
          const newState = { ...prev };
          delete newState[imageId];
          return newState;
        });
      }
    }
  };

  const handleVariantImageUpload = async (e, variantIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chỉ chọn file hình ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    const uploadKey = `variant_${variantIndex}`;
    setUploadingVariantImages(prev => ({
      ...prev,
      [uploadKey]: true
    }));

    try {
      const url = await uploadToCloudinary(file);
      handleVariantChange(variantIndex, 'image_url', url);
      setError('');
    } catch (error) {
      setError(`Lỗi upload hình ảnh variant: ${error.message}`);
    } finally {
      setUploadingVariantImages(prev => {
        const newState = { ...prev };
        delete newState[uploadKey];
        return newState;
      });
    }
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const setPrimaryImage = (imageId) => {
    setImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Please enter a valid price';
    }
    
    if (!formData.category_id) {
      errors.category_id = 'Please select a category';
    }
    
    if (!formData.shop_id) {
      errors.shop_id = 'Shop ID is required';
    }

    // Validate variants
    variants.forEach((variant, index) => {
      if (!variant.sku.trim()) {
        errors[`variant_${index}_sku`] = 'SKU is required';
      }
      if (!variant.price || isNaN(variant.price) || parseFloat(variant.price) <= 0) {
        errors[`variant_${index}_price`] = 'Valid price is required';
      }
      if (!variant.stock_quantity || isNaN(variant.stock_quantity) || parseInt(variant.stock_quantity) < 0) {
        errors[`variant_${index}_stock`] = 'Valid stock quantity is required';
      }
    });
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        shop_id: formData.shop_id,
        images: images.map(img => ({
          url: img.url,
          thumbnail_url: img.thumbnail_url,
          alt_text: img.alt_text,
          position: img.position,
          is_primary: img.is_primary
        })),
        variants: variants.map(variant => ({
          sku: variant.sku,
          price: parseFloat(variant.price),
          stock_quantity: parseInt(variant.stock_quantity),
          color: variant.color || null,
          size: variant.size || null,
          material: variant.material || null,
          image_url: variant.image_url || null
        }))
      };

      const response = await fetch('http://103.253.145.7:3003/api/products', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onSuccess && onSuccess(data.data);
        onClose();
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package size={28} />
              <h1 className="text-2xl font-bold">Create New Product</h1>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-blue-100 mt-2">Add a new product to your shop</p>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <h3 className="text-green-500 font-semibold">Product Created Successfully!</h3>
                <p className="text-green-400 text-sm">Your product has been added to your shop.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-700 rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
                    <span className="w-1 h-8 bg-blue-500 mr-3 rounded-full"></span>
                    Basic Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Product Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-500'} focus:border-blue-500 focus:outline-none transition`}
                        placeholder="Enter product name"
                      />
                      {fieldErrors.name && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={16} />
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Description <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 border ${fieldErrors.description ? 'border-red-500' : 'border-gray-500'} focus:border-blue-500 focus:outline-none transition resize-none`}
                        placeholder="Describe your product"
                      />
                      {fieldErrors.description && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={16} />
                          {fieldErrors.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Base Price <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 pl-12 border ${fieldErrors.price ? 'border-red-500' : 'border-gray-500'} focus:border-blue-500 focus:outline-none transition`}
                            placeholder="0.00"
                          />
                        </div>
                        {fieldErrors.price && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={16} />
                            {fieldErrors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Category <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleInputChange}
                          className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 border ${fieldErrors.category_id ? 'border-red-500' : 'border-gray-500'} focus:border-blue-500 focus:outline-none transition`}
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category.category_id} value={category.category_id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.category_id && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={16} />
                            {fieldErrors.category_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Variants */}
                <div className="bg-gray-700 rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-100 flex items-center">
                      <span className="w-1 h-8 bg-blue-500 mr-3 rounded-full"></span>
                      Product Variants
                    </h2>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      <Plus size={16} />
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-4">
                    {variants.map((variant, index) => (
                      <div key={index} className="bg-gray-600 rounded-lg p-4 relative">
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition"
                          >
                            <X size={16} />
                          </button>
                        )}
                        
                        <h3 className="text-lg font-semibold text-gray-100 mb-3">
                          Variant {index + 1}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-300 font-medium mb-2">
                              SKU <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                              className={`w-full bg-gray-500 text-white rounded-lg px-3 py-2 border ${fieldErrors[`variant_${index}_sku`] ? 'border-red-500' : 'border-gray-400'} focus:border-blue-500 focus:outline-none transition`}
                              placeholder="SKU code"
                            />
                            {fieldErrors[`variant_${index}_sku`] && (
                              <p className="text-red-400 text-xs mt-1">
                                {fieldErrors[`variant_${index}_sku`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-gray-300 font-medium mb-2">
                              Price <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                              step="0.01"
                              min="0"
                              className={`w-full bg-gray-500 text-white rounded-lg px-3 py-2 border ${fieldErrors[`variant_${index}_price`] ? 'border-red-500' : 'border-gray-400'} focus:border-blue-500 focus:outline-none transition`}
                              placeholder="0.00"
                            />
                            {fieldErrors[`variant_${index}_price`] && (
                              <p className="text-red-400 text-xs mt-1">
                                {fieldErrors[`variant_${index}_price`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-gray-300 font-medium mb-2">
                              Stock <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="number"
                              value={variant.stock_quantity}
                              onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
                              min="0"
                              className={`w-full bg-gray-500 text-white rounded-lg px-3 py-2 border ${fieldErrors[`variant_${index}_stock`] ? 'border-red-500' : 'border-gray-400'} focus:border-blue-500 focus:outline-none transition`}
                              placeholder="Quantity"
                            />
                            {fieldErrors[`variant_${index}_stock`] && (
                              <p className="text-red-400 text-xs mt-1">
                                {fieldErrors[`variant_${index}_stock`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-gray-300 font-medium mb-2">
                              Color
                            </label>
                            <div className="relative">
                              <Palette className="absolute left-3 top-2.5 text-gray-400" size={16} />
                              <input
                                type="text"
                                value={variant.color}
                                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                className="w-full bg-gray-500 text-white rounded-lg px-3 py-2 pl-10 border border-gray-400 focus:border-blue-500 focus:outline-none transition"
                                placeholder="Color"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-300 font-medium mb-2">
                              Size
                            </label>
                            <div className="relative">
                              <Ruler className="absolute left-3 top-2.5 text-gray-400" size={16} />
                              <input
                                type="text"
                                value={variant.size}
                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                className="w-full bg-gray-500 text-white rounded-lg px-3 py-2 pl-10 border border-gray-400 focus:border-blue-500 focus:outline-none transition"
                                placeholder="Size"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-300 font-medium mb-2">
                              Material
                            </label>
                            <div className="relative">
                              <Settings className="absolute left-3 top-2.5 text-gray-400" size={16} />
                              <input
                                type="text"
                                value={variant.material}
                                onChange={(e) => handleVariantChange(index, 'material', e.target.value)}
                                className="w-full bg-gray-500 text-white rounded-lg px-3 py-2 pl-10 border border-gray-400 focus:border-blue-500 focus:outline-none transition"
                                placeholder="Material"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Variant Image Upload */}
                        <div className="mt-4">
                          <label className="block text-gray-300 font-medium mb-2">
                            Variant Image
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleVariantImageUpload(e, index)}
                                className="hidden"
                                id={`variant-image-${index}`}
                              />
                              <label
                                htmlFor={`variant-image-${index}`}
                                className="inline-flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                              >
                                <Camera size={16} />
                                Choose Image
                              </label>
                            </div>
                            {uploadingVariantImages[`variant_${index}`] && (
                              <div className="flex items-center gap-2 text-gray-300">
                                <Loader className="animate-spin" size={16} />
                                <span className="text-sm">Uploading...</span>
                              </div>
                            )}
                            {variant.image_url && (
                              <div className="flex items-center gap-2">
                                <img
                                  src={variant.image_url}
                                  alt={`Variant ${index + 1}`}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleVariantChange(index, 'image_url', '')}
                                  className="text-red-400 hover:text-red-300 transition"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Images */}
              <div className="lg:col-span-1">
                <div className="bg-gray-700 rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
                    <span className="w-1 h-8 bg-blue-500 mr-3 rounded-full"></span>
                    Product Images
                  </h2>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center mb-4">
                    <Upload className="text-gray-400 mx-auto mb-2" size={32} />
                    <p className="text-gray-300 mb-2">Upload product images</p>
                    <p className="text-gray-400 text-xs mb-4">PNG, JPG up to 5MB each</p>
                    
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                    >
                      Choose Images
                    </label>
                  </div>

                  {/* Uploaded Images */}
                  {images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm font-medium">Uploaded Images:</p>
                      {images.map((image, index) => (
                        <div key={image.id} className="flex items-center gap-3 bg-gray-600 rounded-lg p-3">
                          <img
                            src={image.url}
                            alt={image.alt_text}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{image.alt_text}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(image.id)}
                                className={`text-xs px-2 py-1 rounded ${
                                  image.is_primary 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-500 text-gray-300 hover:bg-gray-400'
                                }`}
                              >
                                {image.is_primary ? 'Primary' : 'Set Primary'}
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Uploading indicators */}
                  {Object.keys(uploadingImages).length > 0 && (
                    <div className="mt-4 space-y-2">
                      {Object.entries(uploadingImages).map(([id, uploading]) => (
                        uploading && (
                          <div key={id} className="flex items-center gap-2 text-gray-300">
                            <Loader className="animate-spin" size={16} />
                            <span className="text-sm">Uploading...</span>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                {/* Submit Button */}
                <div className="mt-6 pt-6 border-t border-gray-600">
                  <button
                    type="submit"
                    disabled={loading || Object.keys(uploadingImages).length > 0}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <Package size={20} />
                        Create Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
