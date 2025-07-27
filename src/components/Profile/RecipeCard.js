import React from 'react';
import { Clock, Bookmark, Crown} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
const RecipeCard = ({ recipe }) => {

  const difficulty = getDifficulty(recipe.cooking_time);

  function getDifficulty(time) {
    if (time < 30) return 'Easy';
    if (time < 60) return 'Medium';
    return 'Hard';
  }

  return (
    <Link href={`/post/${recipe.post_id}`} className="block">
    <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
      <div className="relative">
        <Image 
            src={recipe.cover_media_url} 
            alt={recipe.name} 
            width={120}
            height={250} 
            className="w-full h-48 object-cover"
          />
        <div className="absolute top-2 right-2 bg-orange bg-opacity-90 p-1 rounded-full">
          {recipe.is_premium ? (
            <Crown className="w-4 h-4 text-white" />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{recipe.name}</h3>
        <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {recipe.cooking_time} mins
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            difficulty === 'Dễ' ? 'bg-green-100 text-green-800' :
            difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' :
            'bg-orange text-white'
          }`}>
            {difficulty}
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default RecipeCard;