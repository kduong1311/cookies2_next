"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ChefHat, Plus, X, Clock, Users, Camera, Video, Hash, MapPin, DollarSign, Image as ImageIcon } from "lucide-react"
import { Description } from "@radix-ui/react-dialog";
import { uploadToCloudinary } from "@/components/upload/uploadCloudinary";
import Image from "next/image";

export default function CookingUploadPage() {

  const {user} = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [location, setLocation] = useState("");
  const [hasRecipe, setHasRecipe] = useState(false);
  const [duration, setDuration] = useState(false);
  const [cuisine, setCuisine] = useState("");
  const [mealType, setMealType] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPrice, setPremiumPrice] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [recipeCover, setRecipeCover] = useState(null);
  const [recipeCoverPreview, setRecipeCoverPreview] = useState(null);
  const [recipe, setRecipe] = useState({
    title: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "easy",
    ingredients: [""],
    instructions: [""]
  })

  const cuisineOptions = [
    "Vietnamese", "Chinese", "Japanese", "Korean", "Thai", "Italian", 
    "French", "American", "Mexican", "Indian", "Other"
  ];

  const mealTypeOptions = [
    "breakfast", "lunch", "dinner", "snack", "dessert", "appetizer", "beverage"
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleRecipeCoverChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setRecipeCover(selectedFile);
      setRecipeCoverPreview(URL.createObjectURL(selectedFile));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const addIngredient = () => {
    setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]})
  }

  const updateIngredient = (index, value) => {
    const newIngredients = [...recipe.ingredients]
    newIngredients[index] = value
    setRecipe({...recipe, ingredients: newIngredients})
  }

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index)
    setRecipe({...recipe, ingredients: newIngredients})
  }

  const addInstruction = () => {
    setRecipe({...recipe, instructions: [...recipe.instructions, ""]})
  }

  const updateInstruction = (index, value) => {
    const newInstructions = [...recipe.instructions]
    newInstructions[index] = value
    setRecipe({...recipe, instructions: newInstructions})
  }

  const removeInstruction = (index) => {
    const newInstructions = recipe.instructions.filter((_, i) => i !== index)
    setRecipe({...recipe, instructions: newInstructions})
  }

  // Parse ingredients from text format to API format
  const parseIngredients = (ingredientTexts) => {
    return ingredientTexts
      .filter(text => text.trim())
      .map((text, index) => {

        const match = text.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.+)$/);
        if (match) {
          return {
            name: match[3].trim(),
            quantity: parseFloat(match[1]),
            unit: match[2] || "piece",
            position: index
          };
        } else {
          return {
            name: text.trim(),
            quantity: 1,
            unit: "piece",
            position: index
          };
        }
      });
  };

  // Parse instructions to API format
  const parseInstructions = (instructionTexts) => {
    return instructionTexts
      .filter(text => text.trim())
      .map((text, index) => ({
        step_number: index + 1,
        description: text.trim(),
        duration: 5
      }));
  };

  const handleSubmit = async () => {
    if (!file) return alert("Choose file please!");
    if (!title.trim()) return alert("Enter Title please!");
    
  if (hasRecipe) {
  if (!recipe.title.trim()) return alert("Please enter the recipe title!");
  if (isPremium && (!premiumPrice || premiumPrice <= 0)) return alert("Please enter a valid price for premium content!");
  if (parseInt(recipe.prepTime) < 0 || parseInt(recipe.cookTime) < 0) return alert("Time cannot be negative!");
  if (parseInt(recipe.servings) < 0) return alert("Servings cannot be negative!");

  const nonEmptyIngredients = recipe.ingredients.filter(i => i.trim() !== "");
  if (nonEmptyIngredients.length === 0) return alert("At least one ingredient is required!");

  const nonEmptyInstructions = recipe.instructions.filter(i => i.trim() !== "");
  if (nonEmptyInstructions.length === 0) return alert("At least one instruction step is required!");
  }


    setIsUploading(true);

    try {
      const dataCloud = await uploadToCloudinary(file);

      setDuration(dataCloud.duration);

      let recipeCoverUrl = "";
      if (hasRecipe && recipeCover) {
        recipeCoverUrl = await uploadToCloudinary(recipeCover);
      }

      const postData = {
        content_type: file.type.startsWith("image") ? "image" : "video",
        title: title.trim(),
        description: caption.trim(),
        cooking_time: parseInt(recipe.cookTime) || 0,
        difficulty_level: recipe.difficulty,
        serving_size: parseInt(recipe.servings) || 1,
        has_recipe: hasRecipe,
        is_premium: hasRecipe ? isPremium : false,
        premium_price: hasRecipe && isPremium ? parseFloat(premiumPrice) : 0,
        status: "published",
        is_featured: false,
        media: [{
          url: dataCloud.url,
          type: file.type.startsWith("image") ? "image" : "video",
          duration: dataCloud.duration,
        }]
      };

      console.log("Creating post...", postData);
      const postResponse = await fetch("http://103.253.145.7:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        credentials: "include",
      });

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.message || "Create post fail!");
      }

      const postResult = await postResponse.json();

      if (hasRecipe) {
        const recipeData = {
          post_id: postResult.post_id,
          name: recipe.title.trim(),
          cuisine_type: cuisine || "Other",
          meal_type: mealType || "dinner",
          preparation_time: parseInt(recipe.prepTime) || 0,
          cooking_time: parseInt(recipe.cookTime) || 0,
          is_premium: isPremium,
          ingredients: parseIngredients(recipe.ingredients),
          steps: parseInstructions(recipe.instructions),
          cover_media_url: recipeCoverUrl.url,
          user_id: user.user_id,
        };

        console.log("Creating recipe...", recipeData);
        const recipeResponse = await fetch("http://103.253.145.7:3004/api/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipeData),
          credentials: "include",
        });

        if (!recipeResponse.ok) {
          const errorData = await recipeResponse.json();
          console.error("Create recipe failed:", errorData);
          alert("Create post sucessfull but have error in recipe!");
        } else {
          const recipeResult = await recipeResponse.json();
          console.log("Create post sucessfully:", recipeResult);
        }
      }

        alert("Upload successfully!");
        
      // Reset form
      setFile(null);
      setPreview(null);
      setTitle("");
      setCaption("");
      setTags([]);
      setCurrentTag("");
      setLocation("");
      setHasRecipe(false);
      setCuisine("");
      setMealType("");
      setIsPremium(false);
      setPremiumPrice("");
      setRecipe({
        title: "",
        prepTime: "",
        cookTime: "",
        servings: "",
        difficulty: "easy",
        ingredients: [""],
        instructions: [""]
      });

    } catch (err) {
      console.error("Upload Error:", err);
      alert(`Upload Error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-xl  overflow-y-auto hide-scrollbar"
    style={{
        width: "1200px",
        height: "95vh",
        margin: "20px auto",
      }}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-white">Share amazing food</h1>
        </div>
        <p className="text-gray-400 text-sm">Show off your amazing food to the community!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="space-y-4 overflow-y-auto pr-2">
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-orange-500" />
              Upload media
            </h3>
            
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-orange-500 transition-colors">
              <input
                type="file"
                id="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {!preview ? (
                  <>
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Upload video</p>
                      <p className="text-xs text-gray-400">MP4 maximum 50MB</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    {file?.type?.startsWith("image") ? (
                      <Image 
                        src={preview} 
                        alt="preview" 
                        width={500}
                        height={300} 
                        className="rounded-lg w-full max-h-48 object-cover" 
                      />
                    ) : (
                      <video
                        controls
                        className="rounded-lg w-full max-h-48"
                      >
                        <source src={preview} type={file.type} />
                        Browser do not accept this video.
                      </video>
                    )}
                    <p className="mt-2 text-xs text-gray-400">Click to change</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <Label className="text-sm font-semibold text-white mb-2 block">
              Post Title *
            </Label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Let's share your story..."
              className="w-full h-20 p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/200</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <Label className="text-sm font-semibold text-white mb-2 block">
              Descriptions:
            </Label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share the story..."
              className="w-full h-20 p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">{caption.length}/500</p>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2">
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                Add recipe
              </Label>
              <button
                onClick={() => setHasRecipe(!hasRecipe)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  hasRecipe ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    hasRecipe ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {hasRecipe && (
            <>
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 space-y-3">
            <h3 className="text-lg font-semibold text-white">Cover image (optional)</h3>
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-orange-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                id="recipeCover"
                onChange={handleRecipeCoverChange}
                className="hidden"
              />
              <label htmlFor="recipeCover" className="cursor-pointer flex flex-col items-center gap-2">
                {!recipeCoverPreview ? (
                  <>
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-sm font-medium text-white">Choose cover image</p>
                  </>
                ) : (
                  <Image 
                  src={recipeCoverPreview} 
                  alt="cover preview" 
                  width={500} 
                  height={300}
                  className="rounded-lg w-full max-h-48 object-cover" 
                />
                )}
              </label>
            </div>
          </div>
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 space-y-3">
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                
                <div>
                  <Label className="text-xs font-medium text-gray-300">Name *</Label>
                  <input
                    type="text"
                    value={recipe.title}
                    onChange={(e) => setRecipe({...recipe, title: e.target.value})}
                    className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Food name..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-300">Cuisine</Label>
                    <select
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                    >
                      <option value="">Cuisine</option>
                      {cuisineOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-300">Meal type</Label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                    >
                      <option value="">Choose Meal Type</option>
                      {mealTypeOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'breakfast' ? 'Breakfast' : 
                        option === 'lunch' ? 'Lunch' : 
                        option === 'dinner' ? 'Dinner' : 
                        option === 'snack' ? 'Snack' : 
                        option === 'dessert' ? 'Dessert' : 
                        option === 'appetizer' ? 'Appetizer' : 
                        'Drink'}
                      </option>
                    ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Prep (Mins)
                    </Label>
                    <input
                      type="number"
                      value={recipe.prepTime}
                      onChange={(e) => setRecipe({...recipe, prepTime: e.target.value})}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Cook (Mins)
                    </Label>
                    <input
                      type="number"
                      value={recipe.cookTime}
                      onChange={(e) => setRecipe({...recipe, cookTime: e.target.value})}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="30"
                    />
                  </div>
                 <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isKidFriendly"
                    className="h-4 w-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500 rounded"
                  />
                  <label htmlFor="isKidFriendly" className="text-sm text-gray-300">
                    👶 For Kid?
                  </label>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Servings
                    </Label>
                    <input
                      type="number"
                      value={recipe.servings}
                      onChange={(e) => setRecipe({...recipe, servings: e.target.value})}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="4"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-300">difficulty</Label>
                    <select
                      value={recipe.difficulty}
                      onChange={(e) => setRecipe({...recipe, difficulty: e.target.value})}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-500" /> Premium
                  </Label>
                  <button
                    onClick={() => setIsPremium(!isPremium)}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      isPremium ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        isPremium ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                {isPremium && (
                  <div>
                    <Label className="text-xs font-medium text-gray-300">Price</Label>
                    <input
                      type="number"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(e.target.value)}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="50000"
                      min="0"
                    />
                    <p className="text-xs text-gray-400 mt-1">User must paid for this recipe</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Ingredients</h3>
                  <Button
                    onClick={addIngredient}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Example: 500g Beef"
                      />
                      {recipe.ingredients.length > 1 && (
                        <Button
                          onClick={() => removeIngredient(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Steps</h3>
                  <Button
                    onClick={addInstruction}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add step
                  </Button>
                </div>
                <div className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <textarea
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="How to do..."
                          rows="2"
                        />
                        {recipe.instructions.length > 1 && (
                          <Button
                            onClick={() => removeInstruction(index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg h-fit"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl text-base font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload Post"}
          </Button>
        </div>
      </div>
    </div>
  )
}