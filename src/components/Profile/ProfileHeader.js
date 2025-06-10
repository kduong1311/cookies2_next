import React from 'react';
import { Users, Share2, Settings, HeartPlus } from 'lucide-react';

const ProfileHeader = ({ userProfile }) => {
  return (
    <div className="bg-gray-800 shadow-sm">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={userProfile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Action Buttons - Bottom Right */}
        <div className="absolute bottom-2 right-4 flex space-x-2">
          <button className="bg-orange  text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm">
            <HeartPlus className="w-4 h-4 mr-1" />
            Follow
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Avatar + Info */}
      <div className="px-6 py-6">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg -mt-14"
            />
            {userProfile.isOnline && (
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          {/* Tên & username */}
          <div>
            <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
            <p className="text-gray-500">{userProfile.username}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-300 mt-4 text-sm">{userProfile.bio}</p>

        {/* Stats */}
        <div className="flex justify-start space-x-6 mt-6">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{userProfile.totalVideos}</div>
            <div className="text-gray-400 text-sm">Video</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{userProfile.totalRecipes}</div>
            <div className="text-gray-400 text-sm">Recipe</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{userProfile.followers.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Follower</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{userProfile.following.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
