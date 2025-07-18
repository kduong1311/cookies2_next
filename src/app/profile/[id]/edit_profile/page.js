"use client";
import React, { useState, useEffect } from 'react';
import { 
  Camera, Save, X, Upload, User, MapPin, FileText, Globe, Mail, Phone, Calendar, CheckCircle, AlertCircle, Loader2} from 'lucide-react';
import { uploadToCloudinary } from '@/components/upload/uploadCloudinary';

const EditProfilePage = () => {
  // Giả sử userId được lấy từ params hoặc context
  const userId = 'IbOwbDycCXVKGd2wlH0XrPYgwQ43';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    city: '',
    country: '',
    email: '',
    phone_number: '',
    avatar_url: '',
    cover_photo_url: '',
    is_chef: false,
    date_of_birth: ''
  });

  const [previewImages, setPreviewImages] = useState({
    avatar: '',
    cover: ''
  });

  // Simulate fetching user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const userData = {
          username: 'john_doe',
          bio: 'Food enthusiast and cooking lover. Sharing my culinary journey with the world! 🍳👨‍🍳',
          city: 'Ho Chi Minh City',
          country: 'Vietnam',
          email: 'john@example.com',
          phone_number: '+84 901 234 567',
          avatar_url: '/Logo.png',
          cover_photo_url: 'https://marketplace.canva.com/EAEmBit3KfU/3/0/1600w/canva-black-flatlay-photo-motivational-finance-quote-facebook-cover-ZsKh4J6p4s8.jpg',
          is_chef: true,
          date_of_birth: '1990-05-15'
        };
        
        setFormData(userData);
        setPreviewImages({
          avatar: userData.avatar_url,
          cover: userData.cover_photo_url
        });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          setSaving(true);
          const { url } = await uploadToCloudinary(file);

          setPreviewImages(prev => ({
            ...prev,
            [type]: url
          }));
          setFormData(prev => ({
            ...prev,
            [`${type}_url`]: url
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
      // Simulate API call
      const response = await fetch(`http://103.253.145.7:3000/api/users/${userId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-gray-400 text-center mt-2">Update your personal information</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`max-w-4xl mx-auto px-4 py-4`}>
          <div className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Cover Photo Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500" />
              Cover Photo
            </h2>
            <div className="relative h-48 bg-gray-700 rounded-lg overflow-hidden group">
              {previewImages.cover && (
                <img 
                  src={previewImages.cover} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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

          {/* Avatar Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img 
                  src={previewImages.avatar || '/Logo.png'} 
                  alt="Avatar preview" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleImageUpload('avatar')}
                    className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleImageUpload('avatar')}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Change Avatar
                </button>
                <p className="text-sm text-gray-400 mt-2">JPG, PNG or GIF (max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Birth Date</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Location*/}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your country"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Bio
            </h2>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="text-sm text-gray-400 mt-2">{formData.bio.length}/500 characters</p>
          </div>

          {/* Chef Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Chef Status</h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_chef"
                checked={formData.is_chef}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
              />
              <label className="text-gray-300">
                I am a professional chef
              </label>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Check this if you are a professional chef or culinary expert
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;