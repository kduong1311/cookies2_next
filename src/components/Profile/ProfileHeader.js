"use client";
import React from 'react';
import { CheckCircle, MapPin, Calendar, Users, Video, BookOpen } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const ProfileHeader = ({ userProfile }) => {
  const [src, setSrc] = useState(displayCover);
  const [avatarSrc, setAvatarSrc] = useState(displayAvatar);

  if (!userProfile) {
    return (
      <div className="w-full h-64 bg-gray-700 animate-pulse rounded-lg">
        <div className="h-32 bg-gray-600 rounded-t-lg"></div>
        <div className="px-4 py-4">
          <div className="w-20 h-20 bg-gray-600 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Work directly with API data structure
  const displayName = userProfile.username || 'Unknown User';
  const displayUsername = `@${userProfile.username || 'unknown'}`;
  const displayBio = userProfile.bio || 'No bio available';
  const displayAvatar = userProfile.avatar_url || '/Logo.png';
  const displayCover = userProfile.cover_photo_url || 'https://marketplace.canva.com/EAEmBit3KfU/3/0/1600w/canva-black-flatlay-photo-motivational-finance-quote-facebook-cover-ZsKh4J6p4s8.jpg';
  const followersCount = userProfile.followers_count || 0;
  const followingCount = userProfile.following_count || 0;
  const postsCount = userProfile.posts_count || 0;
  const isVerified = userProfile.is_verified || false;
  const isChef = userProfile.is_chef || false;
  const isOnline = userProfile.status === 'active';
  
  const location = userProfile.city && userProfile.country 
    ? `${userProfile.city}, ${userProfile.country}` 
    : null;
    
  const joinDate = userProfile.created_at 
    ? new Date(userProfile.created_at).toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long' 
      })
    : null;

  return (
    <div className="w-full bg-gray-800 text-white">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-orange-400 to-red-500">
        <Image
          src={src}
          alt="Cover"
          width={800}
          height={450} 
          className="w-full h-full object-cover"
          onError={() => setSrc('https://marketplace.canva.com/EAEmBit3KfU/3/0/1600w/canva-black-flatlay-photo-motivational-finance-quote-facebook-cover-ZsKh4J6p4s8.jpg')}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-6">
        {/* Avatar */}
        <div className="relative -mt-12 mb-4">
          <div className="relative inline-block">
            <Image
              src={avatarSrc}
              alt={displayName}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-700 object-cover"
              onError={() => setAvatarSrc('/Logo.png')}
            />
            {isOnline && (
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-gray-800 rounded-full"></div>
            )}
          </div>
        </div>

        {/* Name and Username */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {isVerified && (
              <CheckCircle className="w-6 h-6 text-blue-500 fill-current" />
            )}
            {isChef && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
                CHEF
              </span>
            )}
          </div>
          <p className="text-gray-400 text-lg">{displayUsername}</p>
        </div>

        {/* Bio */}
        {displayBio && displayBio !== 'No bio available' && (
          <p className="text-gray-300 mb-4 leading-relaxed">{displayBio}</p>
        )}

        {/* Location and Join Date */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
          {joinDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {joinDate}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-white">{followersCount.toLocaleString()}</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-white">{followingCount.toLocaleString()}</span>
            <span className="text-gray-400">Following</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-white">{postsCount.toLocaleString()}</span>
            <span className="text-gray-400">Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;