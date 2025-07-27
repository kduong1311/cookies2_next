"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  Video,
} from 'lucide-react';

const DEFAULT_COVER =
  'https://marketplace.canva.com/EAEmBit3KfU/3/0/1600w/canva-black-flatlay-photo-motivational-finance-quote-facebook-cover-ZsKh4J6p4s8.jpg';
const DEFAULT_AVATAR = '/Logo.png';

const ProfileHeader = ({ userProfile }) => {
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

  const {
    username,
    bio,
    avatar_url,
    cover_photo_url,
    followers_count = 0,
    following_count = 0,
    posts_count = 0,
    is_verified = false,
    is_chef = false,
    status,
    city,
    country,
    created_at,
  } = userProfile;

  const displayName = username || 'Unknown User';
  const displayUsername = `@${username || 'unknown'}`;
  const displayBio = bio || '';
  const isOnline = status === 'active';
  const location = city && country ? `${city}, ${country}` : null;
  const joinDate = created_at
    ? new Date(created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : null;

  const [coverSrc, setCoverSrc] = useState(cover_photo_url || DEFAULT_COVER);
  const [avatarSrc, setAvatarSrc] = useState(avatar_url || DEFAULT_AVATAR);

  return (
    <div className="w-full bg-gray-800 text-white">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-orange-400 to-red-500">
        <Image
          src={coverSrc}
          alt="Cover"
          width={800}
          height={450}
          className="w-full h-full object-cover"
          onError={() => setCoverSrc(DEFAULT_COVER)}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)'
          }}
        ></div>
      </div>

      <div className="px-4 pb-6">
        <div className="relative -mt-12 mb-4">
          <div className="relative inline-block">
            <Image
              src={avatarSrc}
              alt={displayName}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-700 object-cover"
              onError={() => setAvatarSrc(DEFAULT_AVATAR)}
            />
            {isOnline && (
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-gray-800 rounded-full"></div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {is_verified && (
              <CheckCircle className="w-6 h-6 text-blue-500 fill-current" />
            )}
            {is_chef && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
                CHEF
              </span>
            )}
          </div>
          <p className="text-gray-400 text-lg">{displayUsername}</p>
        </div>

        {/* Bio */}
        {displayBio && (
          <p className="text-gray-300 mb-4 leading-relaxed">{displayBio}</p>
        )}

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

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-white">{followers_count.toLocaleString()}</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-white">{following_count.toLocaleString()}</span>
            <span className="text-gray-400">Following</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-white">{posts_count.toLocaleString()}</span>
            <span className="text-gray-400">Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
