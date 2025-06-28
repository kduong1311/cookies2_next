"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ChefHat, Plus, X, Clock, Users, Camera, Video, Hash, MapPin } from "lucide-react"
import { Description } from "@radix-ui/react-dialog";
import { uploadToCloudinary } from "@/components/upload/uploadCloudinary";

export default function CookingUploadPage() {

  const {user} = useAuth();
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")
  const [location, setLocation] = useState("")
  const [hasRecipe, setHasRecipe] = useState(false)
  const [recipe, setRecipe] = useState({
    title: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "Dễ",
    ingredients: [""],
    instructions: [""]
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

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

  const now = new Date().toISOString();

  const handleSubmit = async () => {

    if (!file) return alert("Bạn chưa chọn file!");
    try {
      console.log("Đang upload file lên Cloudinary...");
      const uploadedUrl = await uploadToCloudinary(file);
      console.log("Upload thành công! URL:", uploadedUrl);
      // Ví dụ: hiển thị ảnh hoặc gửi URL về BE
      alert(`Upload thành công!\nURL: ${uploadedUrl}`);
      console.log(uploadedUrl)
    } catch (err) {
      console.error("Upload lỗi:", err);
    }

    // if (!file) return alert("Select a video or image, pls");

    // try {
    //   const formData = new FormData();
    //   formData.append("user_id", user.id);
    //   formData.append("content_type", "multi");
    //   formData.append("title", title);
    //   formData.append("description", caption);
    //   formData.append("cooking_time", 0);
    //   formData.append("difficulty_level", "easy");
    //   formData.append("has_recipe", hasRecipe? true : false);
    //   formData.append("is_premium", false);
    //   formData.append("premium_price", 0.00);
    //   formData.append("views_count", 0);
    //   formData.append("likes_count", 0);
    //   formData.append("comments_count", 0);
    //   formData.append("shares_count", 0);
    //   formData.append("created_at", now);
    //   formData.append("updated_at", now);
    //   formData.append("status", "published");
    //   formData.append("is_featured", "false");

    //   const response = await fetch("http://103.253.145.7:3001/api/posts", {
    //     method: "POST",
    //     body: formData,
    //     credentials: "include",
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || "Upload fail!");
    //   }

    //   const result = await response.json();
    //   alert("Upload successfull!")
    // }catch (err) {
    //   alert(`Upload error ${err.message}`);
    // }


  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-xl  overflow-y-auto hide-scrollbar"
    style={{
        width: "1200px",
        height: "95vh",
        margin: "20px auto",
      }}>
      {/* Header - Compact */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-white">Chia sẻ món ngon</h1>
        </div>
        <p className="text-gray-400 text-sm">Show off your amazing food to the community!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Column - Media Upload */}
        <div className="space-y-4 overflow-y-auto pr-2">
          {/* File Upload - Compact */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-orange-500" />
              Tải lên ảnh/video
            </h3>
            
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-orange-500 transition-colors">
              <input
                type="file"
                id="file"
                accept="image/*,video/*"
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
                      <p className="text-sm font-medium text-white">Chọn ảnh hoặc video</p>
                      <p className="text-xs text-gray-400">PNG, JPG, MP4 tối đa 50MB</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    {file?.type?.startsWith("image") ? (
                      <img 
                        src={preview} 
                        alt="preview" 
                        className="rounded-lg w-full max-h-48 object-cover" 
                      />
                    ) : (
                      <video
                        controls
                        className="rounded-lg w-full max-h-48"
                      >
                        <source src={preview} type={file.type} />
                        Trình duyệt không hỗ trợ video.
                      </video>
                    )}
                    <p className="mt-2 text-xs text-gray-400">Click to change</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <Label className="text-sm font-semibold text-white mb-2 block">
              Post Title
            </Label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Let's share your story..."
              className="w-full h-20 p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/80</p>
          </div>


          {/* Caption */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <Label className="text-sm font-semibold text-white mb-2 block">
              Descriptions:
            </Label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Chia sẻ câu chuyện về món ăn này..."
              className="w-full h-20 p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">{caption.length}/500</p>
          </div>

          {/* Tags
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <Label className="text-sm font-semibold text-white mb-2 block items-center gap-2">
              <Hash className="w-4 h-4 text-orange-500" />
              Hashtags
            </Label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Thêm hashtag..."
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <Button 
                onClick={addTag}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-orange-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div> */}

        </div>

        {/* Right Column - Recipe */}
        <div className="space-y-4 overflow-y-auto pr-2">
          {/* Recipe Toggle */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-500" />
                Thêm công thức nấu ăn
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
              {/* Recipe Basic Info */}
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 space-y-3">
                <h3 className="text-lg font-semibold text-white">Thông tin cơ bản</h3>
                
                <div>
                  <Label className="text-xs font-medium text-gray-300">Tên món ăn</Label>
                  <input
                    type="text"
                    value={recipe.title}
                    onChange={(e) => setRecipe({...recipe, title: e.target.value})}
                    className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Tên món ăn..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Prep
                    </Label>
                    <input
                      type="text"
                      value={recipe.prepTime}
                      onChange={(e) => setRecipe({...recipe, prepTime: e.target.value})}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="15 phút"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Cook
                    </Label>
                    <input
                      type="text"
                      value={recipe.cookTime}
                      onChange={(e) => setRecipe({...recipe, cookTime: e.target.value})}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="30 phút"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Khẩu phần
                    </Label>
                    <input
                      type="text"
                      value={recipe.servings}
                      onChange={(e) => setRecipe({...recipe, servings: e.target.value})}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="4 người"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-300">Độ khó</Label>
                    <select
                      value={recipe.difficulty}
                      onChange={(e) => setRecipe({...recipe, difficulty: e.target.value})}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                    >
                      <option value="Dễ">Dễ</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Khó">Khó</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Nguyên liệu</h3>
                  <Button
                    onClick={addIngredient}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Thêm
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
                        placeholder="Ví dụ: 500g thịt heo"
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

              {/* Instructions */}
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Cách làm</h3>
                  <Button
                    onClick={addInstruction}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Thêm bước
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
                          placeholder="Mô tả chi tiết bước này..."
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

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!file}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl text-base font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Đăng bài ngay
          </Button>
        </div>
      </div>
    </div>
  )
}