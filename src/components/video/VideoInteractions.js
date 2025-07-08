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
  refreshPost,
  setRefreshPost
}) {
  const heartRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { user } = useAuth();

  const lastServerLikeState = useRef(null);
  const pendingLikeRequest = useRef(null);
  const lastFetchedPostId = useRef(null);
  const lastClickTime = useRef(0);

  // Memoize các giá trị
  const postId = useMemo(() => currentPost?.post_id, [currentPost?.post_id]);
  const userId = useMemo(() => user?.user_id, [user?.user_id]);
  const commentCount = useMemo(() => currentPost?.comments_count ?? 0, [currentPost?.comments_count]);
  const shareCount = useMemo(() => currentPost?.shares_count ?? 0, [currentPost?.shares_count]);

  // Reset state khi chuyển post
  useEffect(() => {
    if (postId && lastFetchedPostId.current !== postId) {
      setLiked(false);
      setLikeCount(0);
      setLoadingLike(false);
      lastServerLikeState.current = null;
      lastFetchedPostId.current = postId;
      
      // Hủy request cũ nếu có
      if (pendingLikeRequest.current) {
        pendingLikeRequest.current.abort();
        pendingLikeRequest.current = null;
      }
    }
  }, [postId]);

  // Khởi tạo dữ liệu post
  const initializePostData = useCallback(async () => {
    if (!postId || !userId) return;

    try {
      const response = await fetch(`http://103.253.145.7:3001/api/posts/${postId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      const postDetail = result.data;
      const serverLiked = postDetail.likes?.some(like => like.user_id === userId) || false;
      const serverLikeCount = Math.max(0, postDetail.likes_count ?? 0);

      setLikeCount(serverLikeCount);
      setLiked(serverLiked);
      lastServerLikeState.current = serverLiked;

      // Cập nhật parent với dữ liệu server mới nhất
      if (onUpdatePost) {
        onUpdatePost({
          ...postDetail,
          likes_count: serverLikeCount,
          likes: postDetail.likes || []
        });
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      // Fallback về dữ liệu từ currentPost
      const fallbackLikeCount = Math.max(0, currentPost?.likes_count ?? 0);
      const fallbackLiked = currentPost?.likes?.some(like => like.user_id === userId) || false;
      
      setLikeCount(fallbackLikeCount);
      setLiked(fallbackLiked);
      lastServerLikeState.current = fallbackLiked;
    }
  }, [postId, userId, currentPost, onUpdatePost]);

  // Khởi tạo khi có refreshPost hoặc post mới
  useEffect(() => {
    if (postId && userId && (refreshPost || lastFetchedPostId.current !== postId)) {
      initializePostData();
      if (refreshPost && setRefreshPost) {
        setRefreshPost(false);
      }
    }
  }, [postId, userId, refreshPost, initializePostData, setRefreshPost]);

  // Sync với currentPost data khi có thay đổi từ bên ngoài
  useEffect(() => {
    if (!postId || !userId || !currentPost) return;
    
    // Chỉ sync nếu không có pending request
    if (!pendingLikeRequest.current) {
      const currentLiked = currentPost.likes?.some(like => like.user_id === userId) || false;
      const currentLikeCount = Math.max(0, currentPost.likes_count ?? 0);
      
      // Chỉ cập nhật nếu có sự khác biệt
      if (currentLiked !== liked || currentLikeCount !== likeCount) {
        setLiked(currentLiked);
        setLikeCount(currentLikeCount);
        lastServerLikeState.current = currentLiked;
      }
    }
  }, [currentPost?.likes, currentPost?.likes_count, postId, userId, liked, likeCount]);

  // Xử lý like/unlike
  const handleLikeToggle = useCallback(async () => {
    if (!postId || !userId || loadingLike) return;

    const now = Date.now();
    if (now - lastClickTime.current < 300) return; // Throttle 300ms
    lastClickTime.current = now;

    setLoadingLike(true);
    const currentLiked = liked;
    const currentLikeCount = likeCount;

    // Optimistic update
    const newLiked = !currentLiked;
    const newLikeCount = newLiked ? currentLikeCount + 1 : Math.max(0, currentLikeCount - 1);

    setLiked(newLiked);
    setLikeCount(newLikeCount);

    // Animation
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

      const controller = new AbortController();
      pendingLikeRequest.current = controller;

      const response = await fetch(
        `http://103.253.145.7:3001/api/posts/${postId}/like`,
        { 
          method: newLiked ? "POST" : "DELETE",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      const updatedPost = responseData.data;
      
      // Cập nhật state với dữ liệu thực từ server
      const serverLikeCount = Math.max(0, updatedPost.likes_count ?? 0);
      const serverLiked = updatedPost.likes?.some(like => like.user_id === userId) || false;
      
      setLikeCount(serverLikeCount);
      setLiked(serverLiked);
      lastServerLikeState.current = serverLiked;

      // Cập nhật parent với dữ liệu server
      if (onUpdatePost) {
        onUpdatePost({
          ...updatedPost,
          likes_count: serverLikeCount,
          likes: updatedPost.likes || []
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Like error:", error);
        // Rollback về trạng thái trước đó
        setLiked(currentLiked);
        setLikeCount(currentLikeCount);
        lastServerLikeState.current = currentLiked;
      }
    } finally {
      setLoadingLike(false);
      pendingLikeRequest.current = null;
    }
  }, [postId, userId, liked, likeCount, loadingLike, onUpdatePost]);

  const openShareModal = useCallback(() => setShareOpen(true), []);
  const closeShareModal = useCallback(() => setShareOpen(false), []);

  // Cleanup
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

      <ShareModal open={shareOpen} onOpenChange={closeShareModal} />
    </div>
  );
}