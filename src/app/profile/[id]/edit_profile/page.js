"use client";
import React, { useState, useEffect } from 'react';
import { 
  Camera, Save, X, Upload, User, MapPin, FileText, Globe, Mail, Phone, Calendar, CheckCircle, AlertCircle, Loader2, Truck
} from 'lucide-react';
import { uploadToCloudinary } from '@/components/upload/uploadCloudinary';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';


const EditProfilePage = () => {

  const params = useParams();
  const userId = params?.id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
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

  const [shippingData, setShippingData] = useState({
    recipient_name: '',
    contact_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    district: '',
    ward: '',
    postal_code: ''
  });

  const [shippingAddressId, setShippingAddressId] = useState(null);

  const [previewImages, setPreviewImages] = useState({
    avatar: '',
    cover: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`http://103.253.145.7:3000/api/users/${userId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error('Failed to load profile data');
        const userData = await res.json();
        const cleanProfile = {
          username: userData.username || '',
          bio: userData.bio || '',
          city: userData.city || '',
          country: userData.country || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          avatar_url: userData.avatar_url || '',
          cover_photo_url: userData.cover_photo_url || '',
          is_chef: userData.is_chef || false,
          date_of_birth: userData.date_of_birth?.split('T')[0] || ''
        };
        setProfileData(cleanProfile);
        setPreviewImages({
          avatar: cleanProfile.avatar_url,
          cover: cleanProfile.cover_photo_url
        });
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };
    const fetchShippingAddress = async () => {
      try {
        const res = await fetch('http://103.253.145.7:3000/api/users/shipping-address/', {
          credentials: 'include',
        });
        if (!res.ok) return; // No address yet
        const data = await res.json();
        const address = data.data;
        if (address) {
          setShippingData({
            recipient_name: address.recipient_name || '',
            contact_number: address.contact_number || '',
            address: address.address || '',
            city: address.city || '',
            state: address.state || '',
            country: address.country || '',
            district: address.district || '',
            ward: address.ward || '',
            postal_code: address.postal_code || ''
          });
        }
      } catch (error) {
      }
    };
    fetchUserData();
    fetchShippingAddress();
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
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
          setProfileData(prev => ({
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
      const response = await fetch(`http://103.253.145.7:3000/api/users/${userId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const shippingPayload = { ...shippingData };
      let shippingRes;
      if (shippingAddressId) {
        shippingRes = await fetch('http://103.253.145.7:3000/api/users/shipping-address/', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shippingPayload)
        });
      } else {
        shippingRes = await fetch('http://103.253.145.7:3000/api/users/shipping-address/', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shippingPayload)
        });
      }
      if (!shippingRes.ok) throw new Error('Failed to save shipping address');
      toast.success("Profile and shipping address updated successfully!");
      setMessage({ type: 'success', text: 'Profile and shipping address updated successfully!' });
      setTimeout(() => { setMessage({ type: '', text: '' }); }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
      toast.error(error.message || 'An error occurred');
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
    <div className="h-screen bg-gray-900 text-white overflow-y-auto hide-scrollbar">
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-gray-400 text-center mt-2">Update your personal information</p>
        </div>
      </div>

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
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
              <div className="absolute inset-0 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleImageUpload('cover_photo')}
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Cover
                </button>
              </div>
            </div>
          </div>

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
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Birth Date</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={profileData.date_of_birth}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

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
                  value={profileData.city}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your country"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Bio
            </h2>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleProfileChange}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="text-sm text-gray-400 mt-2">{profileData.bio.length}/500 characters</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Name</label>
                <input
                  type="text"
                  name="recipient_name"
                  value={shippingData.recipient_name || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter recipient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
                <input
                  type="text"
                  name="contact_number"
                  value={shippingData.contact_number || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingData.address || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingData.country || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingData.city || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={shippingData.state || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter state/province"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={shippingData.district || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter district"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ward</label>
                <input
                  type="text"
                  name="ward"
                  value={shippingData.ward || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter ward"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={shippingData.postal_code || ''}
                  onChange={handleShippingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Chef Status</h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_chef"
                checked={profileData.is_chef}
                onChange={handleProfileChange}
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