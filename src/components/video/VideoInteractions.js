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

      // Cập nhật trạng thái server cuối cùng
      lastServerLikeState.current = newLiked;

      // Fetch lại post data để đảm bảo đồng bộ với server (optional)
      const postRes = await fetch(
        `http://103.253.145.7:3001/api/posts/${currentPost.post_id}`,
        { 
          credentials: "include",
          signal: controller.signal
        }
      );
      
      if (postRes.ok) {
        const postData = await postRes.json();
        const serverPostData = postData.data;
        
        // Chỉ cập nhật nếu không có thay đổi từ user trong lúc request
        const serverLiked = serverPostData.likes?.some((like) => like.user_id === user.user_id) || false;
        const serverLikeCount = serverPostData.likes_count ?? 0;
        
        // Cập nhật state với dữ liệu từ server
        setLiked(serverLiked);
        setLikeCount(serverLikeCount);
        lastServerLikeState.current = serverLiked;
        
        // Cập nhật post data cho component cha
        if (onUpdatePost) {
          onUpdatePost(serverPostData);
        }
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
      
      // Hiển thị thông báo lỗi
      // toast.error("Không thể thực hiện hành động này. Vui lòng thử lại!");
    } finally {
      setLoadingLike(false);
      pendingLikeRequest.current = null;
    }
  };

  // Debounced like handler để tránh click quá nhanh
  const debouncedLikeToggle = useRef(null);
  
  const handleLikeClick = () => {
    // Clear timeout cũ
    if (debouncedLikeToggle.current) {
      clearTimeout(debouncedLikeToggle.current);
    }
    
    // Thực hiện ngay lập tức optimistic update
    handleLikeToggle();
    
    // Set timeout để prevent spam clicking
    debouncedLikeToggle.current = setTimeout(() => {
      debouncedLikeToggle.current = null;
    }, 300);
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
      if (debouncedLikeToggle.current) {
        clearTimeout(debouncedLikeToggle.current);
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