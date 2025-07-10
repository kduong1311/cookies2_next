import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Loader,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { uploadToCloudinary } from "@/components/upload/uploadCloudinary";

export default function CreateShopPage({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    business_registration: ''
  });

  const [files, setFiles] = useState({
    logo: null,
    cover_photo: null
  });

  const [uploadingImages, setUploadingImages] = useState({
    logo: false,
    cover_photo: false
  });

  const [uploadedUrls, setUploadedUrls] = useState({
    logo_url: '',
    cover_photo_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = 'Shop name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Shop name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      errors.name = 'Shop name must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    if (!formData.contact_email.trim()) {
      errors.contact_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      errors.contact_email = 'Please enter a valid email address';
    }
    
    // Optional fields validation
    if (formData.contact_phone && !/^[\+]?[\d\s\-\(\)]+$/.test(formData.contact_phone)) {
      errors.contact_phone = 'Please enter a valid phone number';
    }
    
    if (formData.contact_phone && formData.contact_phone.length < 10) {
      errors.contact_phone = 'Phone number must be at least 10 digits';
    }
    
    if (formData.postal_code && !/^[A-Za-z0-9\s\-]+$/.test(formData.postal_code)) {
      errors.postal_code = 'Please enter a valid postal code';
    }
    
    if (formData.city && formData.city.length < 2) {
      errors.city = 'City name must be at least 2 characters';
    }
    
    if (formData.country && formData.country.length < 2) {
      errors.country = 'Country name must be at least 2 characters';
    }
    
    if (formData.address && formData.address.length < 5) {
      errors.address = 'Address must be at least 5 characters';
    }
    
    if (formData.business_registration && formData.business_registration.length < 3) {
      errors.business_registration = 'Business registration must be at least 3 characters';
    }
    
    return errors;
  };

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setFiles(prev => ({
      ...prev,
      [type]: file
    }));

    // Upload to Cloudinary
    setUploadingImages(prev => ({
      ...prev,
      [type]: true
    }));

    try {
      const url = await uploadToCloudinary(file);
      setUploadedUrls(prev => ({
        ...prev,
        [`${type}_url`]: url
      }));
      setError('');
    } catch (error) {
      setError(`Lỗi upload ${type}: ${error.message}`);
    } finally {
      setUploadingImages(prev => ({
        ...prev,
        [type]: false
      }));
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        logo_url: uploadedUrls.logo_url || null,
        cover_photo_url: uploadedUrls.cover_photo_url || null
      };

      const response = await fetch('http://localhost:3002/api/shops/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Tạo shop thất bại');
      }

      setSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: '',
          description: '',
          contact_email: '',
          contact_phone: '',
          address: '',
          city: '',
          country: '',
          postal_code: '',
          business_registration: ''
        });
        setFiles({ logo: null, cover_photo: null });
        setUploadedUrls({ logo_url: '', cover_photo_url: '' });
        setFieldErrors({});
      }, 3000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen pb-12">
      {/* Header with back button */}
      {onBack && (
        <div className="p-4 border-b border-gray-600">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Store size={32} />
            <h1 className="text-3xl font-bold">Create New Shop</h1>
          </div>
          <p className="text-orange-100">Fill in the details to create your shop</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative">
        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <div>
              <h3 className="text-green-500 font-semibold">Shop Created Successfully!</h3>
              <p className="text-green-400 text-sm">Your shop has been created and is now active.</p>
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

        {/* Form */}
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 mb-6">
          {/* Image Uploads */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
              <span className="w-1 h-8 bg-orange-500 mr-3 rounded-full"></span>
              Shop Images
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="bg-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                  <Camera size={20} />
                  Shop Logo
                </h3>
                
                <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center">
                  {uploadedUrls.logo_url ? (
                    <div className="space-y-3">
                      <img 
                        src={uploadedUrls.logo_url} 
                        alt="Logo preview"
                        className="w-24 h-24 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-green-400 text-sm">Logo uploaded successfully!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uploadingImages.logo ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader className="animate-spin text-orange-500" size={24} />
                          <p className="text-gray-300 text-sm">Uploading logo...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-gray-400 mx-auto" size={32} />
                          <p className="text-gray-300">Upload shop logo</p>
                          <p className="text-gray-400 text-xs">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'logo')}
                    className="hidden"
                    id="logo-upload"
                    disabled={uploadingImages.logo}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition cursor-pointer"
                  >
                    {uploadedUrls.logo_url ? 'Change Logo' : 'Choose Logo'}
                  </label>
                </div>
              </div>

              {/* Cover Photo Upload */}
              <div className="bg-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                  <Camera size={20} />
                  Cover Photo
                </h3>
                
                <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center">
                  {uploadedUrls.cover_photo_url ? (
                    <div className="space-y-3">
                      <img 
                        src={uploadedUrls.cover_photo_url} 
                        alt="Cover preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <p className="text-green-400 text-sm">Cover photo uploaded successfully!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uploadingImages.cover_photo ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader className="animate-spin text-orange-500" size={24} />
                          <p className="text-gray-300 text-sm">Uploading cover...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-gray-400 mx-auto" size={32} />
                          <p className="text-gray-300">Upload cover photo</p>
                          <p className="text-gray-400 text-xs">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'cover_photo')}
                    className="hidden"
                    id="cover-upload"
                    disabled={uploadingImages.cover_photo}
                  />
                  <label
                    htmlFor="cover-upload"
                    className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition cursor-pointer"
                  >
                    {uploadedUrls.cover_photo_url ? 'Change Cover' : 'Choose Cover'}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
              <span className="w-1 h-8 bg-orange-500 mr-3 rounded-full"></span>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-300 font-medium mb-2">
                  Shop Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition`}
                  placeholder="Enter shop name"
                />
                {fieldErrors.name && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.name}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 font-medium mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 border ${fieldErrors.description ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition resize-none`}
                  placeholder="Describe your shop and what you offer"
                />
                {fieldErrors.description && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Business Registration
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="business_registration"
                    value={formData.business_registration}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 pl-12 border ${fieldErrors.business_registration ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition`}
                    placeholder="Business registration number"
                  />
                </div>
                {fieldErrors.business_registration && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.business_registration}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
              <span className="w-1 h-8 bg-orange-500 mr-3 rounded-full"></span>
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 pl-12 border ${fieldErrors.contact_email ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition`}
                    placeholder="shop@example.com"
                  />
                </div>
                {fieldErrors.contact_email && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.contact_email}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 pl-12 border ${fieldErrors.contact_phone ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition`}
                    placeholder="+1234567890"
                  />
                </div>
                {fieldErrors.contact_phone && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.contact_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
              <span className="w-1 h-8 bg-orange-500 mr-3 rounded-full"></span>
              Address Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-300 font-medium mb-2">
                  Street Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 pl-12 border ${fieldErrors.address ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition`}
                    placeholder="123 Main Street"
                  />
                </div>
                {fieldErrors.address && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.address}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 border ${fieldErrors.city ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition`}
                  placeholder="Enter city"
                />
                {fieldErrors.city && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.city}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 border ${fieldErrors.country ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition`}
                  placeholder="Enter country"
                />
                {fieldErrors.country && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.country}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-600 text-white rounded-lg px-4 py-3 border ${fieldErrors.postal_code ? 'border-red-500' : 'border-gray-500'} focus:border-orange-500 focus:outline-none transition`}
                  placeholder="12345"
                />
                {fieldErrors.postal_code && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {fieldErrors.postal_code}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || uploadingImages.logo || uploadingImages.cover_photo}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Creating Shop...
                </>
              ) : (
                <>
                  <Store size={20} />
                  Create Shop
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}