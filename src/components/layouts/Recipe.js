import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Star,
  ArrowLeft,
  Loader
} from 'lucide-react';

export default function RecipePage({ postId, onBack }) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recipe data from API
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://103.253.145.7:3004/api/recipes/post/${postId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setRecipe(data.data);
        } else {
          setError('Failed to load recipe');
        }
      } catch (err) {
        setError('Error fetching recipe data');
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [postId]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const getDifficultyLevel = (cookingTime) => {
    if (cookingTime <= 30) return { level: 'Easy', stars: 1 };
    if (cookingTime <= 60) return { level: 'Medium', stars: 2 };
    return { level: 'Hard', stars: 3 };
  };

  if (loading) {
    return (
      <div className="bg-gray-800 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-orange-500" size={40} />
          <p className="text-gray-300">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="bg-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Recipe not found'}</p>
          {onBack && (
            <button 
              onClick={onBack}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const difficulty = getDifficultyLevel(recipe.cooking_time);
  const totalTime = recipe.total_time || (recipe.preparation_time + recipe.cooking_time);

  return (
    <div className="bg-gray-800 min-h-screen pb-12">
      {/* Header with back button */}
      {onBack && (
        <div className="p-4 border-b border-gray-600">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Feed</span>
          </button>
        </div>
      )}

      {/* Header and cover image */}
      <div className="relative">
        <img 
          src={recipe.cover_media_url || "https://bizweb.dktcdn.net/100/477/987/products/pho-bo-ha-noi-jpeg.jpg?v=1712628941747"} 
          alt={recipe.name} 
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.name}</h1>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <ChefHat size={16} />
            </div>
            <span>Recipe by Chef</span>
          </div>
        </div>
      </div>

      {/* Card with general info right below the image */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 relative">
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-gray-100">
              <Clock className="text-orange-500 mb-1" />
              <span className="text-sm text-gray-300">Prep Time</span>
              <span className="font-medium">{recipe.preparation_time} mins</span>
            </div>
            <div className="flex flex-col items-center text-gray-100">
              <ChefHat className="text-orange-500 mb-1" />
              <span className="text-sm text-gray-300">Cook Time</span>
              <span className="font-medium">{recipe.cooking_time} mins</span>
            </div>
            <div className="flex flex-col items-center text-gray-100">
              <Users className="text-orange-500 mb-1" />
              <span className="text-sm text-gray-300">Total Time</span>
              <span className="font-medium">{totalTime} mins</span>
            </div>
            <div className="flex flex-col items-center text-gray-100">
              <div className="flex mb-1">
                {[1, 2, 3].map((level) => (
                  <Star 
                    key={level} 
                    className={level <= difficulty.stars ? "text-orange-500 fill-orange-500" : "text-gray-400"} 
                    size={16}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-300">Difficulty</span>
              <span className="font-medium">{difficulty.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 mt-6 relative">
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 mb-6">
          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {recipe.cuisine_type}
              </span>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm capitalize">
                {recipe.meal_type}
              </span>
              {recipe.is_premium && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                  Premium ${recipe.premium_price}
                </span>
              )}
            </div>
            <p className="text-gray-200 italic">
              Delicious {recipe.cuisine_type} {recipe.name} perfect for {recipe.meal_type}. 
              Ready in just {totalTime} minutes!
            </p>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
              <span className="w-1 h-8 bg-orange-500 mr-3 rounded-full"></span>
              Ingredients ({recipe.ingredients.length})
            </h2>
            <div className="bg-gray-600 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={ingredient.ingredient_id} className="flex items-center justify-between border-b border-dashed border-gray-500 pb-2">
                    <div className="font-medium text-gray-200 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      {ingredient.name}
                      {ingredient.is_optional && (
                        <span className="text-gray-400 text-sm ml-2">(optional)</span>
                      )}
                    </div>
                    <div className="text-gray-300">
                      {ingredient.quantity} {ingredient.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
              <span className="w-1 h-8 bg-orange-500 mr-3 rounded-full"></span>
              Instructions ({recipe.steps.length} steps)
            </h2>
            <div className="space-y-6">
              {recipe.steps
                .sort((a, b) => a.step_number - b.step_number)
                .map((step, index) => (
                <div key={step.step_id} className="bg-gray-600 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {step.step_number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-bold text-lg text-gray-100">Step {step.step_number}</h3>
                        {step.duration && (
                          <div className="flex items-center gap-1 text-sm text-gray-300">
                            <Clock size={14} />
                            <span>{step.duration} mins</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{step.description}</p>
                      {step.tip && (
                        <div className="bg-blue-500/20 border-l-4 border-blue-500 p-3 rounded">
                          <p className="text-blue-200 text-sm">💡 Tip: {step.tip}</p>
                        </div>
                      )}
                      {step.media_url && (
                        <img 
                          src={step.media_url} 
                          alt={`Step ${step.step_number}`}
                          className="mt-3 rounded-lg max-w-full h-48 object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactions */}
          <div className="border-t border-gray-600 pt-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button 
                  className="flex items-center gap-2"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart 
                    className={liked ? "text-red-500 fill-red-500" : "text-gray-300"} 
                    size={20} 
                  />
                  <span className="text-gray-300">Like</span>
                </button>
                <button className="flex items-center gap-2">
                  <MessageSquare className="text-gray-300" size={20} />
                  <span className="text-gray-300">Comments</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2">
                  <Share2 className="text-gray-300" size={20} />
                  <span className="text-gray-300">Share</span>
                </button>
                <button 
                  className="flex items-center gap-2"
                  onClick={() => setSaved(!saved)}
                >
                  <Bookmark 
                    className={saved ? "text-orange-500 fill-orange-500" : "text-gray-300"} 
                    size={20} 
                  />
                  <span className="text-gray-300">Save</span>
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-100">Rate this Recipe</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={24}
                    onClick={() => handleRatingChange(star)}
                    className={`cursor-pointer ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                  />
                ))}
                {rating > 0 && (
                  <span className="text-gray-300 ml-2">({rating}/5)</span>
                )}
              </div>
            </div>

            {/* Recipe Info Footer */}
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="text-sm text-gray-300">
                <p>Recipe ID: {recipe.recipe_id}</p>
                <p>Created: {new Date(recipe.created_at).toLocaleDateString()}</p>
                {recipe.updated_at !== recipe.created_at && (
                  <p>Last updated: {new Date(recipe.updated_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}