"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
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
  const lastFetchedPostId = useRef(null);
  const isInitialized = useRef(false); // Track xem đã khởi tạo chưa

  // Memoize các giá trị để tránh re-render không cần thiết
  const postId = useMemo(() => currentPost?.post_id, [currentPost?.post_id]);
  const userId = useMemo(() => user?.user_id, [user?.user_id]);
  const commentCount = useMemo(() => currentPost?.comments_count ?? 0, [currentPost?.comments_count]);
  const shareCount = useMemo(() => currentPost?.shares_count ?? 0, [currentPost?.shares_count]);

  // Khởi tạo state từ currentPost và fetch chi tiết nếu cần
  const initializePostData = useCallback(async () => {
    if (!postId || !userId) {
      return;
    }

    // Reset state khi chuyển post
    if (lastFetchedPostId.current !== postId) {
      setLiked(false);
      setLikeCount(Math.max(0, currentPost?.likes_count ?? 0));
      lastServerLikeState.current = null;
      isInitialized.current = false;
    }

    // Tránh fetch lại cùng một post đã được khởi tạo
    if (isInitialized.current && lastFetchedPostId.current === postId) {
      return;
    }

    try {
      const response = await fetch(
        `http://103.253.145.7:3001/api/posts/${postId}`,
        {method: "GET", credentials: "include"}
      );
      
      if (response.ok) {
        const data = await response.json();
        const postData = data.data;
        
        if (process.env.NODE_ENV === 'development') {
          console.log("Fetched post data for user:", userId);
        }
        
        const serverLiked = postData.likes?.some((like) => like.user_id === userId) || false;
        const serverLikeCount = Math.max(0, postData.likes_count ?? 0); // Đảm bảo không âm
        
        setLikeCount(serverLikeCount);
        setLiked(serverLiked);
        
        // Cập nhật trạng thái server cuối cùng
        lastServerLikeState.current = serverLiked;
        lastFetchedPostId.current = postId;
        isInitialized.current = true;
        
        // Cập nhật post data cho component cha nếu có callback
        if (onUpdatePost) {
          onUpdatePost({
            ...postData,
            likes_count: serverLikeCount // Đảm bảo likes_count không âm
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi fetch post details:", error);
      // Fallback về dữ liệu từ currentPost
      const fallbackLiked = false;
      const fallbackLikeCount = Math.max(0, currentPost?.likes_count ?? 0);
      
      setLikeCount(fallbackLikeCount);
      setLiked(fallbackLiked);
      lastServerLikeState.current = fallbackLiked;
      lastFetchedPostId.current = postId;
      isInitialized.current = true;
    }
  }, [postId, userId, onUpdatePost, currentPost?.likes_count]);

  // Chỉ chạy khi postId hoặc userId thay đổi
  useEffect(() => {
    if (postId && userId) {
      initializePostData();
    }
  }, [postId, userId, initializePostData]);

  const handleLikeToggle = useCallback(async () => {
    if (!postId || !userId) return;
    
    // Prevent multiple clicks while request is pending
    if (loadingLike) return;
    
    setLoadingLike(true);
    
    // Lưu trạng thái hiện tại
    const currentLiked = liked;
    const currentLikeCount = likeCount;
    
    // Optimistic update - cập nhật UI ngay lập tức
    const newLiked = !currentLiked;
    // FIX: Đảm bảo likeCount không bao giờ âm
    const newLikeCount = newLiked 
      ? Math.max(0, currentLikeCount) + 1 
      : Math.max(0, Math.max(0, currentLikeCount) - 1);
    
    setLiked(newLiked);
    setLikeCount(newLikeCount);
    
    // Chạy animation nếu đang like
    if (newLiked && heartRef.current) {
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
          `http://103.253.145.7:3001/api/posts/${postId}/like`,
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
          `http://103.253.145.7:3001/api/posts/${postId}/like`,
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Like response:", responseData);
      }

      // FIX: Cập nhật post data cho component cha với thông tin chính xác
      if (onUpdatePost) {
        const updatedPost = {
          ...currentPost,
          likes_count: Math.max(0, newLikeCount), // Đảm bảo không âm
          likes: newLiked 
            ? [...(currentPost.likes || []), { user_id: userId }]
            : (currentPost.likes || []).filter(like => like.user_id !== userId)
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
      setLikeCount(Math.max(0, currentLikeCount)); // Đảm bảo không âm khi rollback
      lastServerLikeState.current = currentLiked;
      
      // Hiển thị thông báo lỗi nếu cần
      // toast.error("Không thể thực hiện hành động này. Vui lòng thử lại!");
    } finally {
      setLoadingLike(false);
      pendingLikeRequest.current = null;
    }
  }, [postId, userId, liked, likeCount, loadingLike, currentPost, onUpdatePost]);

  // Throttled like handler để tránh click quá nhanh
  const lastClickTime = useRef(0);
  const minClickInterval = 300; // 300ms giữa các click
  
  const handleLikeClick = useCallback(() => {
    const now = Date.now();
    
    // Nếu click quá nhanh, bỏ qua
    if (now - lastClickTime.current < minClickInterval) {
      return;
    }
    
    lastClickTime.current = now;
    handleLikeToggle();
  }, [handleLikeToggle]);

  const openShareModal = useCallback(() => setShareOpen(true), []);
  const closeShareModal = useCallback(() => setShareOpen(false), []);

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
            {Math.max(0, likeCount)}
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

      <ShareModal open={shareOpen} onOpenChange={closeShareModal} />
    </div>
  );
}