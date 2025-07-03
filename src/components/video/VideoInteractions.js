"use client";

import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { FaCommentDots, FaBook, FaShareAltSquare } from "react-icons/fa";
import gsap from "gsap";
import ShareModal from "../user/ShareModal";

export default function VideoInteractions({
  currentPost,
  onRecipeClick,
  onCommentClick,
  onUpdatePost,   // HÀM REFRESH DỮ LIỆU, được truyền từ cha
}) {
  const heartRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleLike = async () => {
    if (!currentPost?.post_id || loadingLike) return;

    setLoadingLike(true);

    try {
      // Gửi request like
      const res = await fetch(
        `http://103.253.145.7:3001/api/posts/${currentPost.post_id}/like`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Không thể gửi like!");

      setLiked(true);

      // Animate
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

      // Sau khi like thành công, fetch lại post để cập nhật count
      onUpdatePost && onUpdatePost();

    } catch (error) {
      console.error("Lỗi khi like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const openShareModal = () => setShareOpen(true);

  const likeCount = currentPost?.likes_count ?? 0;
  const commentCount = currentPost?.comments_count ?? 0;
  const shareCount = currentPost?.shares_count ?? 0;

  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        {/* Like button */}
        <button
          className="flex flex-col items-center disabled:cursor-not-allowed"
          onClick={handleLike}
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
              {likeCount + (liked ? 1 : 0)}
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
      </div>

      {/* Share Modal */}
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
}
