"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Camera, Save, Upload, Store, MapPin, FileText, Globe, Mail, Phone, 
  CheckCircle, AlertCircle, Loader2, Building
} from 'lucide-react';
import { uploadToCloudinary } from '../upload/uploadCloudinary';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

const EditShopDialog = ({ isOpen, onClose, shopId }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    business_registration: '',
    logo_url: '',
    cover_photo_url: ''
  });

  const [previewImages, setPreviewImages] = useState({
    logo: '',
    cover: ''
  });

  useEffect(() => {
    const fetchShopData = async () => {
      if (!shopId || !isOpen) return;
      setLoading(true);
      try {
        const res = await fetch(`http://103.253.145.7:3002/api/shops/${shopId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error('Failed to load shop data');
        const data = await res.json();
        
        const cleanShopData = {
          name: data.name || '',
          description: data.description || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          postal_code: data.postal_code || '',
          business_registration: data.business_registration || '',
          logo_url: data.logo_url || '',
          cover_photo_url: data.cover_photo_url || ''
        };
        
        setShopData(cleanShopData);
        setPreviewImages({
          logo: cleanShopData.logo_url,
          cover: cleanShopData.cover_photo_url
        });
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to load shop data' });
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          setSaving(true);
          const response = await uploadToCloudinary(file);
          const imageUrl = response.url;
          
          setPreviewImages(prev => ({
            ...prev,
            [type]: imageUrl
          }));
          
          const fieldName = type === 'logo' ? 'logo_url' : 'cover_photo_url';
          setShopData(prev => ({
            ...prev,
            [fieldName]: imageUrl
          }));
          
          setMessage({ type: 'success', text: 'Image uploaded successfully!' });
          setTimeout(() => {
            setMessage({ type: '', text: '' });
          }, 2000);
        } catch (err) {
          setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
          setSaving(false);
        }
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`http://103.253.145.7:3002/api/shops/${shopId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      });
      
      if (!response.ok) throw new Error('Failed to update shop');
      
      toast.success("Shop information updated successfully!");
      setMessage({ type: 'success', text: 'Shop information updated successfully!' });
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
      toast.error(error.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Edit Shop Information
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your shop details and settings
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-gray-300">Loading shop data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {message.text && (
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{message.text}</span>
              </div>
            )}

            {/* Cover Photo Section */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-500" />
                Cover Photo
              </h3>
              <div className="relative h-32 bg-gray-700 rounded-lg overflow-hidden group">
                {previewImages.cover && (
                  <img 
                    src={previewImages.cover} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                  <button
                    type="button"
                    onClick={() => handleImageUpload('cover')}
                    className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Cover
                  </button>
                </div>
              </div>
            </div>

            {/* Logo Section */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-orange-500" />
                Shop Logo
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img 
                    src={previewImages.logo || '/Logo.png'} 
                    alt="Logo preview" 
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-600"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleImageUpload('logo')}
                      className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleImageUpload('logo')}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Change Logo
                  </button>
                  <p className="text-sm text-gray-400 mt-2">JPG, PNG or GIF (max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Shop Name</label>
                  <input
                    type="text"
                    name="name"
                    value={shopData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter shop name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business Registration</label>
                  <input
                    type="text"
                    name="business_registration"
                    value={shopData.business_registration}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter business registration"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={shopData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Describe your shop..."
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={shopData.contact_email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={shopData.contact_phone}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shopData.address}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shopData.city}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shopData.country}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={shopData.postal_code}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                disabled={saving}
              >
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditShopDialog;