"use client"
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Upload, Edit, Trash2, RefreshCw } from 'lucide-react';
import { uploadToCloudinary } from '../upload/uploadCloudinary';
import toast from 'react-hot-toast';

const ProductEditDialog = ({ productId, children, isOpen, onClose }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onClose !== undefined ? onClose : setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    shop_id: '',
    images: [],
    variants: []
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (open && productId) {
      fetchProduct();
      fetchCategories();
    }
  }, [open, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://103.253.145.7:3003/api/products/${productId}`, {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        const fetchedProductData = data.data;

        const categoryId = fetchedProductData.categories && fetchedProductData.categories.length > 0
          ? fetchedProductData.categories[0].category_id
          : '';

        setProduct({
          ...fetchedProductData,
          price: parseFloat(fetchedProductData.price) || 0,
          category_id: categoryId,
          variants: fetchedProductData.variants || [],
          images: fetchedProductData.images || []
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error loading product data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch('http://103.253.145.7:3003/api/categories', {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error loading categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const totalStock = product.variants.reduce(
      (sum, variant) => sum + (parseInt(variant.stock_quantity) || 0),
      0
      );

      const payload = {
        ...product,
        stock_quantity: totalStock,
      };
      delete payload.categories;

      const response = await fetch(`http://103.253.145.7:3003/api/products/${productId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setOpen(false);
        toast.success('Product updated successfully!');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImages(true);
      const uploadPromises = files.map(async (file) => {
        const response = await uploadToCloudinary(file);
        return {
          url: response.url,
          thumbnail_url: response.url,
          alt_text: file.name,
          position: product.images.length,
          is_primary: product.images.length === 0
        };
      });

      const newImages = await Promise.all(uploadPromises);
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error uploading images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setPrimaryImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        is_primary: i === index
      }))
    }));
  };

  const addVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, {
        sku: '',
        price: product.price,
        stock_quantity: 0,
        color: '',
        size: '',
        material: ''
      }]
    }));
  };

  const updateVariant = (index, field, value) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (index) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const getCurrentCategoryName = () => {
    const currentCategory = categories.find(cat => cat.category_id === product.category_id);
    return currentCategory ? currentCategory.name : 'No category selected';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-500">Edit Product</DialogTitle>
        </DialogHeader>
        
        {loading && !product.name ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Product Name</Label>
                <Input
                  id="name"
                  value={product.name || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-200">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={product.price || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category" className="text-gray-200">Category</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fetchCategories}
                  disabled={loadingCategories}
                  className="text-orange-400 hover:text-orange-300 hover:bg-gray-800"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loadingCategories ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              {loadingCategories ? (
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-gray-400">Loading categories...</span>
                </div>
                ) : (
                <select
                    value={product.category_id || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev, category_id: e.target.value }))}
                    className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 w-full focus:border-orange-500 focus:ring-orange-500"
                >
                    <option value="">No category</option>
                    {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                        {category.name}
                    </option>
                    ))}
                </select>
                )}
                            
              {product.category_id && (
                <div className="text-sm text-gray-400 mt-1">
                  Current category: <span className="text-orange-400">{getCurrentCategoryName()}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-200">Description</Label>
              <Textarea
                id="description"
                value={product.description || ''}
                onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-200">Product Images</Label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImages}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={uploadingImages}
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImages ? 'Uploading...' : 'Upload Images'}
                  </Button>
                </div>
              </div>
              
              {product.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.thumbnail_url || image.url || image.image_url}
                        alt={image.alt_text}
                        className={`w-full h-24 object-cover rounded border-2 ${
                          image.is_primary ? 'border-orange-500' : 'border-gray-600'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transition-opacity">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setPrimaryImage(index)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 text-xs"
                        >
                          Primary
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                          className="bg-red-600 hover:bg-red-700 w-6 h-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {image.is_primary && (
                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-200">Product Variants</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addVariant}
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </div>

              {product.variants.map((variant, index) => (
                <div key={index} className="border border-gray-600 rounded-lg p-4 space-y-3 bg-gray-800">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-orange-400">Variant {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300">SKU</Label>
                      <Input
                        value={variant.sku || ''}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value || null)}
                        placeholder="SKU"
                        className="bg-gray-700 border-gray-500 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price || ''}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-500 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Stock Quantity</Label>
                      <Input
                        type="number"
                        value={variant.stock_quantity || ''}
                        onChange={(e) => updateVariant(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                        placeholder="Stock"
                        className="bg-gray-700 border-gray-500 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300">Color</Label>
                      <Input
                        value={variant.color || ''}
                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                        placeholder="e.g., Red"
                        className="bg-gray-700 border-gray-500 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Size</Label>
                      <Input
                        value={variant.size || ''}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        placeholder="e.g., M"
                        className="bg-gray-700 border-gray-500 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Material</Label>
                      <Input
                        value={variant.material || ''}
                        onChange={(e) => updateVariant(index, 'material', e.target.value)}
                        placeholder="e.g., Cotton"
                        className="bg-gray-700 border-gray-500 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || uploadingImages}
                className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-600 disabled:text-gray-400"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;