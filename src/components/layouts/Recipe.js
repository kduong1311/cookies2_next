import React, { useState } from 'react';
import { 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Star 
} from 'lucide-react';

export default function RecipePage() {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);

  // Sample recipe data
  const recipe = {
    title: "Traditional Vietnamese Beef Pho",
    author: "Chef Nguyen Van A",
    authorAvatar: "https://cafefcdn.com/203337114487263232/2025/1/1/47208442311669476181209639033670841156961389n-1735736938941-17357369390451505103058.jpg",
    coverImage: "https://bizweb.dktcdn.net/100/477/987/products/pho-bo-ha-noi-jpeg.jpg?v=1712628941747",
    description: "Vietnamese beef pho, a traditional dish famous for its rich flavor from beef bone broth simmered for many hours with characteristic spices.",
    prepTime: 30,
    cookTime: 180,
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      { name: "Beef bones", amount: "1.5", unit: "kg" },
      { name: "Beef fillet", amount: "500", unit: "g" },
      { name: "Ginger", amount: "1", unit: "root" },
      { name: "Onion", amount: "2", unit: "bulbs" },
      { name: "Star anise", amount: "3", unit: "pieces" },
      { name: "Cinnamon stick", amount: "2", unit: "sticks" },
      { name: "Cloves", amount: "5", unit: "pieces" },
      { name: "Black cardamom", amount: "2", unit: "pieces" },
      { name: "Coriander seeds", amount: "1", unit: "teaspoon" },
      { name: "Salt", amount: "2", unit: "tablespoons" },
      { name: "Fish sauce", amount: "3", unit: "tablespoons" },
      { name: "Rock sugar", amount: "30", unit: "g" },
      { name: "Rice noodles (pho)", amount: "1", unit: "kg" },
      { name: "Green onions", amount: "100", unit: "g" },
      { name: "Thai basil", amount: "1", unit: "bunch" },
      { name: "Mint", amount: "1", unit: "bunch" },
      { name: "Bean sprouts", amount: "200", unit: "g" },
      { name: "Lime", amount: "2", unit: "fruits" },
      { name: "Fresh chili", amount: "3", unit: "fruits" }
    ],
    steps: [
      {
        title: "Prepare bones and meat",
        description: "Wash beef bones thoroughly, put them in a pot of cold water and boil for 5 minutes to remove foam and impurities. Then take the bones out, rinse them with cold water. Wash beef fillet, slice thinly and set aside."
      },
      {
        title: "Prepare spices",
        description: "Grill or char onions and ginger directly over a flame until fragrant and slightly charred. Then peel off the burnt skin. Lightly toast dry spices like star anise, cinnamon, cloves, and black cardamom until fragrant."
      },
      {
        title: "Cook the broth",
        description: "Add blanched bones to a pot, pour water to cover the bones by about 5cm. Add grilled onion, ginger, and toasted spices. Simmer over low heat for about 3 hours, skimming off foam occasionally to keep the broth clear."
      },
      {
        title: "Season the broth",
        description: "After the broth has developed a sweet flavor from the bones, season with salt, fish sauce, and rock sugar. Adjust seasonings to taste so the broth has a clear, slightly sweet, and slightly salty flavor."
      },
      {
        title: "Prepare pho noodles and herbs",
        description: "Briefly blanch pho noodles in boiling water, then drain and rinse with cold water. Wash fresh herbs like Thai basil, mint, and bean sprouts thoroughly and drain."
      },
      {
        title: "Assemble and serve",
        description: "Place pho noodles in a bowl, arrange sliced beef fillet on top, and pour hot broth over. Add chopped green onions and sprinkle with pepper. Serve with fresh herbs, lime, and fresh chili."
      }
    ],
    comments: [
      {
        user: "Tran Thi B",
        avatar: "/api/placeholder/40/40",
        content: "The recipe is very detailed and easy to follow. I tried it and my whole family loved it!",
        date: "2 days ago"
      },
      {
        user: "Le Van C",
        avatar: "/api/placeholder/40/40",
        content: "The pho is truly delicious. I added a little beef shank and it really suited my family's taste.",
        date: "1 week ago"
      }
    ]
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="bg-gray-800 min-h-screen pb-12">
      {/* Header and cover image */}
      <div className="relative">
        <img 
          src={recipe.coverImage} 
          alt={recipe.title} 
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex items-center gap-3 mb-3">
            <img src={recipe.authorAvatar} alt="Author" className="w-8 h-8 rounded-full" />
            <span>{recipe.author}</span>
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
              <span className="font-medium">{recipe.prepTime} mins</span>
            </div>
            <div className="flex flex-col items-center text-gray-100">
              <ChefHat className="text-orange-500 mb-1" />
              <span className="text-sm text-gray-300">Cook Time</span>
              <span className="font-medium">{recipe.cookTime} mins</span>
            </div>
            <div className="flex flex-col items-center text-gray-100">
              <Users className="text-orange-500 mb-1" />
              <span className="text-sm text-gray-300">Servings</span>
              <span className="font-medium">{recipe.servings} people</span>
            </div>
            <div className="flex flex-col items-center text-gray-100">
              <div className="flex mb-1">
                {[1, 2, 3].map((level) => (
                  <Star 
                    key={level} 
                    className={level <= 2 ? "text-orange-500 fill-orange-500" : "text-gray-400"} 
                    size={16}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-300">Difficulty</span>
              <span className="font-medium">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 mt-6 relative">
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 mb-6">
          {/* Description */}
          <div className="mb-8">
            <p className="text-gray-200 italic">{recipe.description}</p>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center">
              <span className="w-1 h-8 bg-orange-500 mr-3 rounded-full"></span>
              Ingredients
            </h2>
            <div className="bg-gray-600 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-dashed border-gray-500 pb-2">
                    <div className="font-medium text-gray-200">{ingredient.name}:</div>
                    <div className="text-gray-300">
                      {ingredient.amount} {ingredient.unit}
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
              Instructions
            </h2>
            <div className="space-y-6">
              {recipe.steps.map((step, index) => (
                <div key={index} className="bg-gray-600 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-100">{step.title}</h3>
                      <p className="text-gray-300">{step.description}</p>
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
                  <span className="text-gray-300">128</span>
                </button>
                <button className="flex items-center gap-2">
                  <MessageSquare className="text-gray-300" size={20} />
                  <span className="text-gray-300">{recipe.comments.length}</span>
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
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-100">Comments ({recipe.comments.length})</h3>
              <div className="space-y-4 mb-6">
                {recipe.comments.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <img 
                      src={comment.avatar} 
                      alt={comment.user} 
                      className="w-10 h-10 rounded-full" 
                    />
                    <div className="flex-1">
                      <div className="bg-gray-600 p-3 rounded-lg">
                        <div className="font-medium text-gray-100">{comment.user}</div>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{comment.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Form */}
              <div className="flex gap-3">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="User" 
                  className="w-10 h-10 rounded-full" 
                />
                <div className="flex-1">
                  <textarea 
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-100"
                    placeholder="Write your comment..."
                    rows={3}
                  ></textarea>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-orange-600 transition">
                    Submit Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Recipes */}
        <div className="bg-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">Similar Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-gray-600">
                <div className="relative">
                  <img 
                    src={`/api/placeholder/300/200`} 
                    alt="Recipe" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-gray-700 p-1 rounded-full">
                    <Heart size={18} className="text-gray-300" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2 text-gray-100">Delicious Dish #{item}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <Clock size={14} />
                    <span>30 mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        size={14}
                        className={`${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                      />
                    ))}
                    <span className="text-sm text-gray-300 ml-1">(42)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}