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

  // Ref để track trạng thái like cuối cùng đã gửi lên server
  const lastServerLikeState = useRef(null);
  const pendingLikeRequest = useRef(null);

  // Khởi tạo state từ currentPost và fetch chi tiết nếu cần
  useEffect(() => {
    const initializePostData = async () => {
        try {
          const response = await fetch(
            `http://103.253.145.7:3001/api/posts/${currentPost.post_id}`,
            {method: "GET", credentials: "include"}
          );
          
          if (response.ok) {
            const data = await response.json();
            const postData = data.data;
            console.log("id", user.user_id)
            
            const serverLiked = postData.likes?.some((like) => like.user_id === user.user_id) || false;
            const serverLikeCount = postData.likes_count ?? 0;
            
            setLikeCount(serverLikeCount);
            setLiked(serverLiked);
            
            // Cập nhật trạng thái server cuối cùng
            lastServerLikeState.current = serverLiked;
            
            // Cập nhật post data cho component cha nếu có callback
            if (onUpdatePost) {
              onUpdatePost(postData);
            }
          }
        } catch (error) {
          console.error("Lỗi khi fetch post details:", error);
          // Fallback về dữ liệu từ currentPost
          const fallbackLiked = false;
          const fallbackLikeCount = currentPost.likes_count ?? 0;
          
          setLikeCount(fallbackLikeCount);
          setLiked(fallbackLiked);
          lastServerLikeState.current = fallbackLiked;
        }
    };

    initializePostData();
  }, [currentPost?.post_id, user?.user_id, onUpdatePost]);

  const handleLikeToggle = async () => {
    if (!currentPost?.post_id || !user?.user_id) return;
    
    // Prevent multiple clicks while request is pending
    if (loadingLike) return;
    
    setLoadingLike(true);
    
    // Lưu trạng thái hiện tại
    const currentLiked = liked;
    const currentLikeCount = likeCount;
    
    // Optimistic update - cập nhật UI ngay lập tức
    const newLiked = !currentLiked;
    const newLikeCount = newLiked ? currentLikeCount + 1 : currentLikeCount - 1;
    
    setLiked(newLiked);
    setLikeCount(newLikeCount);
    
    // Chạy animation nếu đang like
    if (newLiked) {
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
      // Hủy request cũ nếu có
      if (pendingLikeRequest.current) {
        pendingLikeRequest.current.abort();
      }

      // Tạo AbortController mới
      const controller = new AbortController();
      pendingLikeRequest.current = controller;

      let response;
      
      if (newLiked) {
        // Gửi request để like
        response = await fetch(
          `http://103.253.145.7:3001/api/posts/${currentPost.post_id}/like`,
          { 
            method: "POST", 
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            },
            signal: controller.signal
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
            },
            signal: controller.signal
          }
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Request thành công - cập nhật trạng thái server
      lastServerLikeState.current = newLiked;

      // Lấy response data nếu có
      const responseData = await response.json();
      console.log("Like response:", responseData);

      // Không cần fetch lại post data nữa vì đã có optimistic update
      // Chỉ cập nhật post data cho component cha với thông tin hiện tại
      if (onUpdatePost) {
        // Tạo updated post data
        const updatedPost = {
          ...currentPost,
          likes_count: newLikeCount,
          likes: newLiked 
            ? [...(currentPost.likes || []), { user_id: user.user_id }]
            : (currentPost.likes || []).filter(like => like.user_id !== user.user_id)
        };
        onUpdatePost(updatedPost);
      }
      
    } catch (error) {
      // Ignore AbortError (khi request bị hủy)
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error("Lỗi khi toggle like:", error);
      
      // Rollback về trạng thái cũ nếu có lỗi
      setLiked(currentLiked);
      setLikeCount(currentLikeCount);
      lastServerLikeState.current = currentLiked;
      
      // Hiển thị thông báo lỗi
      // toast.error("Không thể thực hiện hành động này. Vui lòng thử lại!");
    } finally {
      setLoadingLike(false);
      pendingLikeRequest.current = null;
    }
  };

  // Throttled like handler để tránh click quá nhanh
  const lastClickTime = useRef(0);
  const minClickInterval = 500; // 500ms giữa các click
  
  const handleLikeClick = () => {
    const now = Date.now();
    
    // Nếu click quá nhanh, bỏ qua
    if (now - lastClickTime.current < minClickInterval) {
      console.log("Click quá nhanh, bỏ qua");
      return;
    }
    
    lastClickTime.current = now;
    handleLikeToggle();
  };

  const openShareModal = () => setShareOpen(true);

  const commentCount = currentPost?.comments_count ?? 0;
  const shareCount = currentPost?.shares_count ?? 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pendingLikeRequest.current) {
        pendingLikeRequest.current.abort();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 ml-4 mr-4">
      {/* Like button */}
      <button
        className="flex flex-col items-center disabled:cursor-not-allowed transition-transform active:scale-95"
        onClick={handleLikeClick}
        disabled={false} // Không disable để UX mượt mà hơn
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