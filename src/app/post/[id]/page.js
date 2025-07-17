"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoInteractions from "@/components/video/VideoInteractions";
import RecipePage from "@/components/layouts/Recipe";
import CommentPage from "@/components/video/CommentPage";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshPost, setRefreshPost] = useState(false);

  // States for panels - giống y hệt MainLayout
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  // Determine active panel type - giống y hệt MainLayout
  const activePanelType = isRecipeOpen ? "recipe" : isCommentOpen ? "comment" : null;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://103.253.145.7:3001/api/posts/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.status === "success") {
          setPost(data.data);
          setCurrentPostId(data.data.post_id); // Set current post ID for panels

          const userRes = await fetch(`http://103.253.145.7:3000/api/users/${data.data.user_id}`, {
            credentials: "include",
          });
          const userData = await userRes.json();
          setUserInfo(userData || null);
        }
      } catch (err) {
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  // Handle recipe click - giống MainLayout
  const handleRecipeClick = () => {
    setIsRecipeOpen(true);
    setIsCommentOpen(false);
    setCurrentPostId(post.post_id);
  };

  // Handle comment click - giống MainLayout
  const handleCommentClick = () => {
    setIsCommentOpen(true);
    setIsRecipeOpen(false);
    setCurrentPostId(post.post_id);
  };


  if (loading || !post) return <Loading />;

  return (
    <div className="flex justify-center items-center w-full h-screen bg-black">
      {/* Main content container - giống structure MainLayout */}
      <div className="flex w-full">
        {/* Video and interactions container */}
        <div className="flex-grow flex items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-[95vh] max-w-[600px] w-auto bg-black rounded-lg overflow-hidden">
              <VideoPlayer currentPost={post} currentUser={userInfo} />
            </div>

            <VideoInteractions
              currentPost={post}
              currentUser={userInfo}
              refreshPost={refreshPost}
              setRefreshPost={setRefreshPost}
              onRecipeClick={handleRecipeClick}
              onCommentClick={handleCommentClick}
              onUpdatePost={(updated) => setPost({ ...post, ...updated })}
            />
          </div>
        </div>

        {/* Animated panels - copy exact từ MainLayout */}
        <AnimatePresence mode="wait">
          {activePanelType === "recipe" && (
            <motion.div
              key="recipe-panel"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-[800px] h-[100vh] bg-gray-800 text-black p-6 overflow-y-auto shadow-lg hide-scrollbar rounded-lg"
            >
              <RecipePage postId={currentPostId} />
            </motion.div>
          )}

          {activePanelType === "comment" && (
            <motion.div
              key="comment-panel"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-[800px] h-[100vh] bg-gray-800 text-black p-6 overflow-y-auto shadow-lg hide-scrollbar rounded-lg"
            >
              <CommentPage postId={currentPostId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}