import React from 'react';
import { Play, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoCard = ({ video }) => {
  const thumbnailUrl = video.media[0]?.thumbnail_url || video.media[0]?.url;

  return (
    <Link href={`/post/${video.post_id}`} className="block">
      <div className="w-full max-w-sm bg-gray-700 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-200 cursor-pointer">
      <div className="relative group">
        <video 
          src={video.media[0]?.url} 
          className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
          muted
          preload="metadata"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
          <Play className="w-4 h-4 mr-1" />
          {formatDuration(video.cooking_time)}
        </div>

        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
          {video.views_count} views
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white line-clamp-2">{video.title || 'Untitled Video'}</h3>
        <p className="text-sm text-orange line-clamp-2">{video.description || 'No description provided.'}</p>

        <div className="flex items-center justify-between text-orange">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm">{video.likes_count}</span>
          </div>
          {video.has_recipe ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Recipe
            </span>
          ) : (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              NO Recipe
            </span>
          )}
        </div>
      </div>
    </div>
    </Link>
  );
};

export default VideoCard;