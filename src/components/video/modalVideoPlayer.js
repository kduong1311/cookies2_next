import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import RecipePage from "@/components/video/Recipe";
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
        const res = await fetch(
          `http://103.253.145.7:3000/api/users/${video.user_id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Fetch user fail");
        const data = await res.json();
        setAuthor(data);
      } catch (err) {
        console.error("Fetch user error:", err);
        setAuthor(null);
      }
    };
    fetchUser();
  }, [video?.user_id]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

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
        {/* Container flex chính */}
        <div className="relative flex items-center">
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

          {/* VideoInteractions hiện được đặt bên cạnh video */}
          <div className="ml-4">
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
              }}
            />
          </div>

          {/* Các panel Recipe/Comment */}
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

          <button
            className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
