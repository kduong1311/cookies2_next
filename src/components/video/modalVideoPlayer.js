import { useState, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import RecipePage from "@/components/layouts/Recipe";
import CommentPage from "@/components/video/CommentPage";
import VideoInteractions from "./VideoInteractions";

export default function ModalVideoPlayer({ video, onClose }) {
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [author, setAuthor] = useState(null);

  const activePanelType = isRecipeOpen ? "recipe" : isCommentOpen ? "comment" : null;

  useEffect(() => {
  if (!video?.user_id) return;

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://103.253.145.7:3000/api/users/${video.user_id}`);
      if (!res.ok) throw new Error("Không lấy được thông tin người dùng");
      const data = await res.json();
      setAuthor(data);
    } catch (err) {
      console.error("Fetch user error:", err);
      setAuthor(null);
    }
  };
  fetchUser();
}, [video?.user_id]);

  // Đóng modal khi click backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Đóng modal bằng ESC
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="relative flex">

          {/* VIDEO PLAYER */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[90vh] max-w-[600px]"
          >
            <VideoPlayer
              currentPost={video}
              currentUser={author}
              isRecipeOpen={isRecipeOpen}
              isCommentOpen={isCommentOpen}
            />
          </motion.div>

          {/* PANEL RECIPE & COMMENT */}
          <AnimatePresence mode="wait">
            {activePanelType === "recipe" && (
              <motion.div
                key="recipe-panel"
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-[800px] h-[90vh] bg-gray-800 text-black p-6 overflow-y-auto shadow-lg hide-scrollbar"
              >
                <RecipePage postId={video.post_id} />
              </motion.div>
            )}
            {activePanelType === "comment" && (
              <motion.div
                key="comment-panel"
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-[800px] h-[90vh] bg-gray-800 text-white p-6 overflow-y-auto shadow-lg hide-scrollbar"
              >
                <CommentPage video={video.post_id} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* INTERACTIONS */}
          <VideoInteractions
            currentPost={video}
            onRecipeClick={() => {
              setIsRecipeOpen(!isRecipeOpen);
              if (!isRecipeOpen) setIsCommentOpen(false);
            }}
            onCommentClick={() => {
              setIsCommentOpen(!isCommentOpen);
              if (!isCommentOpen) setIsRecipeOpen(false);
            }}
            onLike={() => {
              console.log("Like video", video.id);
              // TODO: Call API hoặc cập nhật state
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-full ml-4"
          />

          {/* CLOSE BUTTON */}
          <button
            className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors z-10"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
