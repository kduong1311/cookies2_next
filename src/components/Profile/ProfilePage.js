'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import VideoGrid from './VideoGrid';
import RecipeGrid from './RecipeGrid';
import SavedGrid from './SaveGrid';
import { AlertOctagon, ArrowLeft, UserPlus, UserMinus, Loader2 } from 'lucide-react';
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
  const [userSavedItems, setUserSavedItems] = useState([]);

  const [videosLoading, setVideosLoading] = useState(false);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [savedLoading, setSavedLoading] = useState(false);

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

  // Follow Button Component
  const FollowButton = () => {
    if (isOwner) return null;

    return (
      <button
        onClick={handleFollow}
        disabled={followLoading}
        className={`
          relative px-6 py-2.5 rounded-full font-medium text-sm
          transition-all duration-300 ease-out transform hover:scale-105
          disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
          ${isFollowing 
            ? 'bg-transparent border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400' 
            : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 border-2 border-transparent'
          }
          shadow-lg hover:shadow-xl
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
                <UserMinus className="w-4 h-4 mr-2" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
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
      setUserVideos(data);
    } catch {
      setUserVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  // const fetchUserRecipes = async () => {
  //   try {
  //     setRecipesLoading(true);
  //     const res = await fetch(`http://103.253.145.7:3000/api/users/${userId}/recipes`);
  //     const data = res.ok ? await res.json() : [];
  //     setUserRecipes(data);
  //   } catch {
  //     setUserRecipes([]);
  //   } finally {
  //     setRecipesLoading(false);
  //   }
  // };

  // const fetchUserSavedItems = async () => {
  //   try {
  //     setSavedLoading(true);
  //     const res = await fetch(`http://103.253.145.7:3000/api/users/${userId}/saved`, {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     const data = res.ok ? await res.json() : [];
  //     setUserSavedItems(data);
  //   } catch {
  //     setUserSavedItems([]);
  //   } finally {
  //     setSavedLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!profileUser) return;
    if (activeTab === 'videos' && userVideos.length === 0) fetchUserVideos();
    if (activeTab === 'recipes' && userRecipes.length === 0) fetchUserRecipes();
    if (activeTab === 'saved' && isOwner && userSavedItems.length === 0) fetchUserSavedItems();
  }, [activeTab, profileUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-800 max-h-[90vh] overflow-y-auto rounded-2xl hide-scrollbar">
        <div className="sticky top-0 z-10 bg-gray-800 shadow-sm px-4 py-3 flex items-center border-b">
          <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-300 mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm">back to back</span>
          </button>
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-white mb-2">Failed to load profile</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
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
      <div className="sticky top-0 z-10 bg-gray-800 shadow-sm px-4 py-3 flex items-center border-b">
        <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-300 mr-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">back</span>
        </button>
        <h2 className="text-lg font-semibold text-white">Profile</h2>
      </div>

      {/* Add Follow Button to ProfileHeader */}
      <div className="relative">
        <ProfileHeader userProfile={profileUser} />
        {!isOwner && (
          <div className="absolute top-4 right-4">
            <FollowButton />
          </div>
        )}
      </div>

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isOwner={isOwner}
      />

      <div className="px-4 py-6">
        {activeTab === 'videos' && (
          userVideos.length > 0 ? <VideoGrid videos={userVideos} viewMode={viewMode} /> : <EmptyState type="videos" loading={videosLoading} />
        )}
        {activeTab === 'recipes' && (
          userRecipes.length > 0 ? <RecipeGrid recipes={userRecipes} viewMode={viewMode} /> : <EmptyState type="recipes" loading={recipesLoading} />
        )}
        {activeTab === 'saved' && (
          !isOwner ? (
            <div className="flex items-center justify-center h-40 text-gray-400">Saved items are private</div>
          ) : userSavedItems.length > 0 ? (
            <SavedGrid savedItems={userSavedItems} viewMode={viewMode} />
          ) : (
            <EmptyState type="saved items" loading={savedLoading} />
          )
        )}
      </div>
    </div>
  </div>
);

};

export default ProfilePage;