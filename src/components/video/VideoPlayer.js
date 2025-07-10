import { useEffect, useState } from "react";
import { ChefHat, Eye, Clock, ConstructionIcon } from "lucide-react";
import CustomVideo from './CustomVideo';

export default function VideoPlayer({ currentPost, currentUser, isRecipeOpen, isCommentOpen }) {
  const [userData, setUserData] = useState(null);

  console.log("id", currentUser)
  useEffect(() => {
    if (!currentUser) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://103.253.145.7:3000/api/users/${currentUser}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.status === 'success') {
          setUserData(data.data);
        } else {
          console.warn("User fetch failed:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [currentUser]);

  if (!currentPost || !currentPost.media || currentPost.media.length === 0) {
    return (
      <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-white">No video available</p>
      </div>
    );
  }

  const videoUrl = currentPost.media[0].url;

  return (
    <div className="relative w-full h-full">
      <CustomVideo src={videoUrl} isActive={true} />

      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
        <div className="space-y-2">
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <img 
              src={userData?.avatar_url || 'https://via.placeholder.com/28'} 
              alt={userData?.username || 'User'}
              className="w-7 h-7 rounded-full border border-white object-cover flex-shrink-0"
            />
            <span className="font-semibold text-sm truncate">@{userData?.username || 'Unknown'}</span>

            {userData?.is_verified && (
              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            {userData?.is_chef && (
              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <ChefHat size={10} className="text-white" />
              </div>
            )}
          </div>

          {/* Post Title */}
          <h3 className="font-bold text-base leading-tight">{currentPost.title}</h3>

          {/* Description */}
          <p className="text-xs opacity-90 line-clamp-2 leading-tight">{currentPost.description}</p>

          {/* Post Stats */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs opacity-75">
            {currentPost.cooking_time > 0 && (
              <div className="flex items-center space-x-1">
                <Clock size={10} />
                <span>{currentPost.cooking_time}min</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Eye size={10} />
              <span>{currentPost.views_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
