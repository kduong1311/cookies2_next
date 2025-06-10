import React from 'react';
import { Clock, Bookmark } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 p-1 rounded-full">
          <Bookmark className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{recipe.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {recipe.time}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            recipe.difficulty === 'Dễ' ? 'bg-green-100 text-green-800' :
            recipe.difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' :
            'bg-orange text-white'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-sm font-medium">{recipe.rating}</span>
          </div>
          <div className="flex items-center text-gray-200">
            <Bookmark className="w-4 h-4 mr-1" />
            <span className="text-sm">{recipe.saves}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;