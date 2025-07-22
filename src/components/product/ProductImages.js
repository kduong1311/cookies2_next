import React, { useState } from "react";
import { 
  ImageIcon, 
  X, 
  Upload, 
  Loader2
} from "lucide-react";
import { uploadToCloudinary } from "../upload/uploadCloudinary";

const ProductImages = ({ images, setImages, isUploading, setIsUploading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const imageUrl = await uploadToCloudinary(file);
      
      const newImage = {
        url: imageUrl.url,
        thumbnail_url: imageUrl.url,
        alt_text: "Product image",
        position: images.length,
        is_primary: images.length === 0
      };

      setImages([...images, newImage]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages.map((img, i) => ({ ...img, position: i, is_primary: i === 0 })));
  };

  const setPrimaryImage = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    setImages(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-orange-500" />
          Product Images
        </h3>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? "border-orange-500 bg-orange-500/10" 
              : "border-gray-600 hover:border-orange-500/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="product-images"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
            disabled={isUploading}
            multiple
          />
          
          <label htmlFor="product-images" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              {isUploading ? (
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-white">
                  {isUploading ? "Uploading..." : "Upload an image"}
                </p>
                <p className="text-sm text-gray-400">
                  Drag & drop or click to upload (PNG, JPG, JPEG)
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h4 className="text-md font-semibold text-white mb-4">
            Uploaded Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.alt_text}
                  className="w-full h-32 object-cover rounded-lg border border-gray-600 cursor-pointer hover:border-orange-500 transition-colors"
                  onClick={() => setPrimaryImage(index)}
                />
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    Primary
                  </div>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to set as primary image
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
