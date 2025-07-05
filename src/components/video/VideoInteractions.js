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
  const [loadingLike, setLoadingLike] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { user } = useAuth();

  // Refetch post details để kiểm tra like và cập nhật post
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!currentPost?.post_id || !user?.user_id) return;
      try {
        const res = await fetch(
          `http://103.253.145.7:3001/api/posts/${currentPost.post_id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Không thể lấy thông tin bài viết!");

        const data = await res.json();
        setLiked(
          data.data.likes?.some((like) => like.user_id === user.user_id)
        );
        console.log("user:", user)
        console.log("userid: ", user.user_id)
        onUpdatePost && onUpdatePost(data.data); // cập nhật post mới cho cha nếu cần
      } catch (err) {
        console.error("Lỗi khi lấy thông tin post:", err);
      }
    };

    fetchPostDetails();
  }, [currentPost?.post_id, user?.user_id]); // refetch nếu post hoặc user thay đổi

  const handleLikeToggle = async () => {
    if (!currentPost?.post_id || loadingLike) return;
    setLoadingLike(true);
    try {
      const res = await fetch(
        `http://103.253.145.7:3001/api/posts/${currentPost.post_id}/like`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Không thể gửi like!");

      // Sau khi like thành công, refetch post để cập nhật dữ liệu chính xác
      const postRes = await fetch(
        `http://103.253.145.7:3001/api/posts/${currentPost.post_id}`,
        { credentials: "include" }
      );
      const postData = await postRes.json();

      setLiked(
        postData.data.likes?.some((like) => like.user_id === user.user_id)
      );
      onUpdatePost && onUpdatePost(postData.data);

      if (!liked) {
        gsap.fromTo(
          heartRef.current,
          { scale: 1 },
          { scale: 1.4, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" }
        );
      }
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
            {likeCount}
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
