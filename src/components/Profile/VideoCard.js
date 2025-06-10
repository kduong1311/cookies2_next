import React from 'react';
import { Play, Heart } from 'lucide-react';

const VideoCard = ({ video }) => {
  return (
    <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
          <Play className="w-3 h-3 mr-1" />
          {video.duration}
        </div>
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          {video.views} views
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
        <div className="flex items-center justify-between text-gray-300 text-sm">
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1 text-red-500" />
            {video.likes}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;