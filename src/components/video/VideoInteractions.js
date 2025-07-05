"use client";

import { useRef, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { FaCommentDots, FaBook, FaShareAltSquare } from "react-icons/fa";
import gsap from "gsap";
import ShareModal from "../user/ShareModal";
import { useAuth } from "@/contexts/AuthContext";

export default function VideoInteractions({
  currentPost,
  onRecipeClick,
  onCommentClick,
  onUpdatePost,
}) {
  const heartRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { user } = useAuth();

  // Khởi tạo state từ currentPost và fetch chi tiết nếu cần
  useEffect(() => {
    const initializePostData = async () => {
        try {
          const response = await fetch(
            `http://103.253.145.7:3001/api/posts/${currentPost.post_id}`,
            {method: "GET"}
          );
          
          if (response.ok) {
            const data = await response.json();
            const postData = data.data;
                        console.log(postData)
            
            setLikeCount(postData.likes_count ?? 0);
            setLiked(
              postData.likes?.some((like) => like.user_id === user.user_id) || false
            );
            
            // Cập nhật post data cho component cha nếu có callback
            if (onUpdatePost) {
              onUpdatePost(postData);
            }
          }
        } catch (error) {
          console.error("Lỗi khi fetch post details:", error);
          // Fallback về dữ liệu từ currentPost
          setLikeCount(currentPost.likes_count ?? 0);
          setLiked(false);
        }
    };

    initializePostData();
  }, [currentPost?.post_id, user?.user_id, onUpdatePost]);

  const handleLikeToggle = async () => {
    if (!currentPost?.post_id || loadingLike || !user?.user_id) return;
    
    setLoadingLike(true);
    
    // Optimistic update - cập nhật UI ngay lập tức
    const previousLiked = liked;
    const previousLikeCount = likeCount;
    
    // Cập nhật state ngay lập tức
    setLiked(!liked);
    setLikeCount(prevCount => !liked ? prevCount + 1 : prevCount - 1);
    
    // Chạy animation ngay lập tức
    if (!liked) {
      gsap.fromTo(
        heartRef.current,
        { scale: 1 },
        { 
          scale: 1.4, 
          duration: 0.15, 
          yoyo: true, 
          repeat: 1, 
          ease: "power2.out" 
        }
      );
    }

    try {
      let response;
      
      if (!liked) {
        // Gửi request để like
        response = await fetch(
          `http://103.253.145.7:3001/api/posts/${currentPost.post_id}/like`,
          { 
            method: "POST", 
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Gửi request để unlike
        response = await fetch(
          `http://103.253.145.7:3001/api/posts/${currentPost.post_id}/like`,
          { 
            method: "DELETE", 
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Fetch lại post data để đảm bảo đồng bộ với server
      const postRes = await fetch(
        `http://103.253.145.7:3001/api/posts/${currentPost.post_id}`,
        { credentials: "include" }
      );
      
      if (postRes.ok) {
        const postData = await postRes.json();
        const serverPostData = postData.data;
        
        // Cập nhật lại state với dữ liệu chính xác từ server
        const serverLiked = serverPostData.likes?.some((like) => like.user_id === user.user_id) || false;
        const serverLikeCount = serverPostData.likes_count ?? 0;
        
        setLiked(serverLiked);
        setLikeCount(serverLikeCount);
        
        // Cập nhật post data cho component cha
        if (onUpdatePost) {
          onUpdatePost(serverPostData);
        }
      }
      
    } catch (error) {
      console.error("Lỗi khi toggle like:", error);
      
      // Rollback về trạng thái cũ nếu có lỗi
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);
      
      // Có thể hiển thị toast notification lỗi ở đây
      // toast.error("Không thể thực hiện hành động này. Vui lòng thử lại!");
    } finally {
      setLoadingLike(false);
    }
  };

  const openShareModal = () => setShareOpen(true);

  const commentCount = currentPost?.comments_count ?? 0;
  const shareCount = currentPost?.shares_count ?? 0;

  return (
    <div className="flex flex-col items-center space-y-6 ml-4 mr-4">
      {/* Like button */}
      <button
        className="flex flex-col items-center disabled:cursor-not-allowed transition-transform active:scale-95"
        onClick={handleLikeToggle}
        disabled={loadingLike}
      >
        <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg relative">
          <Heart
            ref={heartRef}
            className={`w-7 h-7 transition-colors duration-200 ${
              liked ? "text-red-500 fill-red-500" : "text-white"
            }`}
          />
          <span className="absolute -bottom-5 text-xs text-white font-semibold">
            {likeCount}
          </span>
        </div>
      </button>

      {/* Comment button */}
      <button 
        className="flex flex-col items-center transition-transform active:scale-95" 
        onClick={onCommentClick}
      >
        <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg relative">
          <FaCommentDots className="w-7 h-7 text-white" />
          <span className="absolute -bottom-5 text-xs text-white font-semibold">
            {commentCount}
          </span>
        </div>
      </button>

      {/* Recipe button */}
      <button 
        className="flex flex-col items-center transition-transform active:scale-95" 
        onClick={onRecipeClick}
      >
        <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg">
          <FaBook className="w-6.5 h-6.5 text-white" />
        </div>
      </button>

      {/* Share button */}
      <button 
        className="flex flex-col items-center transition-transform active:scale-95" 
        onClick={openShareModal}
      >
        <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg relative">
          <FaShareAltSquare className="w-7 h-7 text-white" />
          <span className="absolute -bottom-5 text-xs text-white font-semibold">
            {shareCount}
          </span>
        </div>
      </button>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}