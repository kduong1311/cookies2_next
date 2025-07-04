"use client";

import { useRef, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { FaCommentDots, FaBook, FaShareAltSquare } from "react-icons/fa";
import gsap from "gsap";
import ShareModal from "../user/ShareModal";

export default function VideoInteractions({
  currentPost,
  currentUser, // <-- thêm currentUser
  onRecipeClick,
  onCommentClick,
  onUpdatePost,
}) {
  const heartRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Kiểm tra user đã like chưa khi currentPost hoặc currentUser thay đổi
  useEffect(() => {
    if (currentPost && currentUser) {
      const isLiked = currentPost.likes?.some(
        (like) => like.user_id === currentUser.id
      );
      setLiked(isLiked);
    } else {
      setLiked(false);
    }
  }, [currentPost, currentUser]);

  const handleLikeToggle = async () => {
    if (!currentPost?.post_id || loadingLike) return;

    setLoadingLike(true);

    try {
      const res = await fetch(
        `http://103.253.145.7:3001/api/posts/${currentPost.post_id}/like`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Không thể gửi like!");

      // Đảo trạng thái ngay
      setLiked(!liked);

      // Animate chỉ khi like
      if (!liked) {
        gsap.fromTo(
          heartRef.current,
          { scale: 1 },
          {
            scale: 1.4,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          }
        );
      }

      // Gọi update để refetch dữ liệu từ server
      onUpdatePost && onUpdatePost();
    } catch (error) {
      console.error("Lỗi khi toggle like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const openShareModal = () => setShareOpen(true);

  const likeCount = currentPost?.likes_count ?? 0;
  const commentCount = currentPost?.comments_count ?? 0;
  const shareCount = currentPost?.shares_count ?? 0;

  // Tính like hiển thị: cộng/trừ 1 nếu local state khác với server
  let displayLikeCount = likeCount;
  const serverLiked = currentPost?.likes?.some(
    (like) => like.user_id === currentUser?.id
  );
  if (liked && !serverLiked) displayLikeCount += 1;
  if (!liked && serverLiked) displayLikeCount -= 1;

  return (
    <div className="flex flex-col items-center space-y-6 ml-4 mr-4">
      {/* Like button */}
      <button
        className="flex flex-col items-center disabled:cursor-not-allowed"
        onClick={handleLikeToggle}
        disabled={loadingLike}
      >
        <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg relative">
          <Heart
            ref={heartRef}
            className={`w-7 h-7 ${
              liked ? "text-red-500 fill-red-500" : "text-white"
            }`}
          />
          <span className="absolute -bottom-5 text-xs text-white font-semibold">
            {displayLikeCount}
          </span>
        </div>
      </button>

      {/* Comment button */}
      <button className="flex flex-col items-center" onClick={onCommentClick}>
        <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg relative">
          <FaCommentDots className="w-7 h-7 text-white" />
          <span className="absolute -bottom-5 text-xs text-white font-semibold">
            {commentCount}
          </span>
        </div>
      </button>

      {/* Recipe button */}
      <button className="flex flex-col items-center" onClick={onRecipeClick}>
        <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg">
          <FaBook className="w-6.5 h-6.5 text-white" />
        </div>
      </button>

      {/* Share button */}
      <button className="flex flex-col items-center" onClick={openShareModal}>
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
