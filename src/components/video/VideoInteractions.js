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

  const lastClickTime = useRef(0);
  const pendingLikeRequest = useRef(null);

  const postId = useMemo(() => currentPost?.post_id, [currentPost?.post_id]);
  const userId = useMemo(() => user?.user_id, [user?.user_id]);
  const commentCount = useMemo(() => currentPost?.comments_count ?? 0, [currentPost?.comments_count]);
  const shareCount = useMemo(() => currentPost?.shares_count ?? 0, [currentPost?.shares_count]);

  const calculateLikeCount = useCallback((post) => {
    const countFromServer = post.likes_count;
    const countFromArray = post.likes ? post.likes.length : 0;
    return Math.max(countFromServer ?? 0, countFromArray);
  }, []);

  // Fetch chi tiết bài viết nếu cần
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!postId || !userId) return;

      try {
        const response = await fetch(`http://103.253.145.7:3001/api/posts/${postId}`, {
          credentials: "include",
        });
        const result = await response.json();

        if (result.status === "success" && result.data) {
          const updatedPost = result.data;
          const serverLiked = updatedPost.likes?.some(like => like.user_id === userId) || false;
          const serverLikeCount = calculateLikeCount(updatedPost);

          setLiked(serverLiked);
          setLikeCount(serverLikeCount);

          if (onUpdatePost) {
            onUpdatePost(updatedPost);
          }
        }
      } catch (error) {
        console.error("Lỗi khi fetch chi tiết bài viết:", error);
      }
    };

    fetchPostDetails();
  }, [postId, userId, calculateLikeCount, onUpdatePost]);

  const handleLikeToggle = useCallback(async () => {
    if (!postId || !userId || loadingLike) return;

    const now = Date.now();
    if (now - lastClickTime.current < 500) return;
    lastClickTime.current = now;

    setLoadingLike(true);
    const currentLiked = liked;
    const currentLikeCount = likeCount;

    const newLiked = !currentLiked;
    const newLikeCount = newLiked
      ? currentLikeCount + 1
      : Math.max(0, currentLikeCount - 1);

    setLiked(newLiked);
    setLikeCount(newLikeCount);

    if (newLiked && heartRef.current) {
      gsap.fromTo(
        heartRef.current,
        { scale: 1, rotation: 0 },
        {
          scale: 1.3,
          rotation: 15,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(heartRef.current, {
              scale: 1,
              rotation: 0,
              duration: 0.2,
              ease: "elastic.out(1, 0.5)",
            });
          },
        }
      );
    }

    try {
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
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      if (result.status === "success" && result.data) {
        const updatedPost = result.data;
        const serverLikeCount = calculateLikeCount(updatedPost);
        const serverLiked = updatedPost.likes?.some(like => like.user_id === userId) || false;

        setLiked(serverLiked);
        setLikeCount(serverLikeCount);

        if (onUpdatePost) {
          onUpdatePost(updatedPost);
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Like error:", error);
        setLiked(currentLiked);
        setLikeCount(currentLikeCount);
      }
    } finally {
      setLoadingLike(false);
      pendingLikeRequest.current = null;
    }
  }, [postId, userId, liked, likeCount, loadingLike, onUpdatePost, calculateLikeCount]);

  const formatCount = useCallback((count) => {
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return count.toString();
  }, []);

  const openShareModal = useCallback(() => setShareOpen(true), []);
  const closeShareModal = useCallback(() => setShareOpen(false), []);

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
        className={`flex flex-col items-center transition-all duration-200 ${
          loadingLike ? "cursor-not-allowed opacity-70" : "active:scale-95"
        }`}
        onClick={handleLikeToggle}
        disabled={loadingLike}
        aria-label={liked ? "Unlike this post" : "Like this post"}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg relative transition-all duration-200 ${
            liked ? "bg-pink-500" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <Heart
            ref={heartRef}
            className={`w-7 h-7 transition-all duration-200 ${
              liked ? "text-white fill-white" : "text-white"
            }`}
          />
          {loadingLike && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <span className="text-xs text-white font-medium mt-1">
          {formatCount(likeCount)}
        </span>
      </button>

      {/* Comment button */}
      <button
        className="flex flex-col items-center transition-transform active:scale-95"
        onClick={onCommentClick}
        aria-label="View comments"
      >
        <div className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center shadow-lg transition-colors duration-200">
          <FaCommentDots className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs text-white font-medium mt-1">
          {formatCount(commentCount)}
        </span>
      </button>

      {/* Recipe button */}
      <button
        className="flex flex-col items-center transition-transform active:scale-95"
        onClick={onRecipeClick}
        aria-label="View recipe"
      >
        <div className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center shadow-lg transition-colors duration-200">
          <FaBook className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs text-white font-medium mt-1">Recipe</span>
      </button>

      {/* Share button */}
      <button
        className="flex flex-col items-center transition-transform active:scale-95"
        onClick={openShareModal}
        aria-label="Share this post"
      >
        <div className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center shadow-lg transition-colors duration-200">
          <FaShareAltSquare className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs text-white font-medium mt-1">
          {formatCount(shareCount)}
        </span>
      </button>

      <ShareModal open={shareOpen} onOpenChange={closeShareModal} postId={postId} />
    </div>
  );
}
