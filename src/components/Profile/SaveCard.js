import React from 'react';
import { Play, Clock } from 'lucide-react';

const SavedCard = ({ item }) => {
  return (
    <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={item.type === 'video' ? item.thumbnail : item.image} 
          alt={item.title} 
          className="w-full h-48 object-cover" 
        />
        {item.type === 'video' && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
            <Play className="w-3 h-3 mr-1" />
            {item.duration}
          </div>
        )}
        <div className="absolute top-2 left-2 bg-orange text-white px-2 py-1 rounded-full text-xs font-medium">
          {item.type === 'video' ? 'Video' : 'Công thức'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-sm text-gray-300 mb-2">bởi {item.author}</p>
        <div className="flex items-center text-gray-200 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {item.type === 'video' ? item.duration : item.time}
        </div>
      </div>
    </div>
  );
};

export default SavedCard;