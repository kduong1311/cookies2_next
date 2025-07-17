'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import VideoGrid from './VideoGrid';
import RecipeGrid from './RecipeGrid';
import { 
  AlertOctagon, 
  ArrowLeft, 
  UserPlus, 
  UserMinus, 
  Loader2, 
  Settings,
  ShoppingBag,
  Edit3,
  Package
} from 'lucide-react';
import axios from 'axios';

const ProfilePage = ({ userId }) => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileUser, setProfileUser] = useState(null);

  const [activeTab, setActiveTab] = useState('videos');
  const [viewMode, setViewMode] = useState('grid');

  const [userVideos, setUserVideos] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

  const [videosLoading, setVideosLoading] = useState(false);
  const [recipesLoading, setRecipesLoading] = useState(false);

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const handleBack = () => router.back();

  useEffect(() => {
    if (!authLoading) {
      setIsOwner(user?.user_id === userId);
    }
  }, [authLoading, user, userId]);

  useEffect(() => {
    const fetchUser = async () => {
       try {
        setLoading(true);
        const res = await axios.get(`http://103.253.145.7:3000/api/users/${userId}`, { withCredentials: true });
        setProfileUser(res.data);
        
        // Initialize follow states
        setIsFollowing(res.data.isFollowing || false);
        setFollowersCount(res.data.followersCount || 0);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  // Follow handler
  const handleFollow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setFollowLoading(true);
      
      // Optimistic update
      const wasFollowing = isFollowing;
      setIsFollowing(!wasFollowing);
      setFollowersCount(prev => wasFollowing ? prev - 1 : prev + 1);

      await axios.post(
        `http://103.253.145.7:3000/api/users/${userId}/follow`,
        {},
        { withCredentials: true }
      );
      
    } catch (err) {
      // Revert on error
      setIsFollowing(isFollowing);
      setFollowersCount(followersCount);
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Navigation handlers
  const handleUpdateProfile = () => {
    router.push("/edit_profile");
  };

  const handleMyOrders = () => {
    router.push('/my-orders');
  };

  // Profile Action Buttons (for owner)
  const ProfileActionButtons = () => {
    if (!isOwner) return null;

    return (
      <div className="flex gap-3">
        <button
          onClick={handleUpdateProfile}
          className="group relative px-5 py-2.5 rounded-full font-medium text-sm
            bg-gradient-to-r from-blue-500 to-purple-600 text-white
            hover:from-blue-600 hover:to-purple-700
            transition-all duration-300 ease-out transform hover:scale-105
            shadow-lg hover:shadow-xl hover:shadow-blue-500/25
            border border-transparent"
        >
          <div className="flex items-center justify-center">
            <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-6 transition-transform duration-200" />
            <span>Edit Profile</span>
          </div>
        </button>

        <button
          onClick={handleMyOrders}
          className="group relative px-5 py-2.5 rounded-full font-medium text-sm
            bg-gradient-to-r from-green-500 to-emerald-600 text-white
            hover:from-green-600 hover:to-emerald-700
            transition-all duration-300 ease-out transform hover:scale-105
            shadow-lg hover:shadow-xl hover:shadow-green-500/25
            border border-transparent"
        >
          <div className="flex items-center justify-center">
            <Package className="w-4 h-4 mr-2 group-hover:bounce transition-transform duration-200" />
            <span>My Orders</span>
          </div>
        </button>
      </div>
    );
  };

  // Follow Button Component
  const FollowButton = () => {
    if (isOwner) return null;

    return (
      <button
        onClick={handleFollow}
        disabled={followLoading}
        className={`
          group relative px-6 py-2.5 rounded-full font-medium text-sm
          transition-all duration-300 ease-out transform hover:scale-105
          disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
          ${isFollowing 
            ? 'bg-transparent border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400 hover:shadow-lg' 
            : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 border-2 border-transparent hover:shadow-xl hover:shadow-orange-500/25'
          }
          shadow-lg
        `}
      >
        {followLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span>{isFollowing ? 'Unfollowing' : 'Following'}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {isFollowing ? (
              <>
                <UserMinus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span>Follow</span>
              </>
            )}
          </div>
        )}
      </button>
    );
  };

  const fetchUserVideos = async () => {
    try {
      setVideosLoading(true);
      const res = await fetch(`http://103.253.145.7:3001/api/posts/user/${userId}`);
      const data = res.ok ? await res.json() : [];
      setUserVideos(data.data);
    } catch {
      setUserVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      setRecipesLoading(true);
      const res = await fetch(`http://103.253.145.7:3004/api/recipes/user/${userId}`);
      const data = res.ok ? await res.json() : [];
      setUserRecipes(data.data.recipes);
    } catch {
      setUserRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  };

  useEffect(() => {
    if (!profileUser) return;
    if (activeTab === 'videos' && userVideos.length === 0) fetchUserVideos();
    if (activeTab === 'recipes' && userRecipes.length === 0) fetchUserRecipes();
  }, [activeTab, profileUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-800 max-h-[90vh] overflow-y-auto rounded-2xl hide-scrollbar">
        <div className="sticky top-0 z-10 bg-gray-800 shadow-sm px-4 py-3 flex items-center border-b border-gray-700">
          <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-300 mr-4 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm">back</span>
          </button>
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-white mb-2">Failed to load profile</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 text-white">
        <p>User not found</p>
      </div>
    );
  }

  const EmptyState = ({ type, loading }) => (
    <div className="flex items-center justify-center h-40">
      <div className="text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto mb-2"></div>
            <p className="text-gray-400">Loading {type}...</p>
          </>
        ) : (
          <>
            <p className="text-gray-400 mb-2">No {type} yet</p>
            <p className="text-gray-500 text-sm">
              {isOwner ? `Start sharing your ${type}!` : `This user hasn't shared any ${type} yet.`}
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-[1000px] bg-gray-800 h-[95vh] overflow-y-auto rounded-2xl hide-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-800/95 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center border-b border-gray-700">
          <button 
            onClick={handleBack} 
            className="flex items-center text-gray-600 hover:text-gray-300 mr-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm">back</span>
          </button>
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>

        {/* Profile Header with Action Buttons */}
        <div className="relative">
          <ProfileHeader userProfile={profileUser} />
          
          {/* Action Buttons Container */}
          <div className="absolute top-4 right-4 z-10">
            {isOwner ? (
              <ProfileActionButtons />
            ) : (
              <FollowButton />
            )}
          </div>
        </div>

        {/* Profile Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isOwner={isOwner}
        />

        {/* Content */}
        <div className="px-4 py-6">
          {activeTab === 'videos' && (
            userVideos.length > 0 ? (
              <VideoGrid videos={userVideos} viewMode={viewMode} />
            ) : (
              <EmptyState type="videos" loading={videosLoading} />
            )
          )}
          {activeTab === 'recipes' && (
            userRecipes.length > 0 ? (
              <RecipeGrid recipes={userRecipes} viewMode={viewMode} />
            ) : (
              <EmptyState type="recipes" loading={recipesLoading} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;