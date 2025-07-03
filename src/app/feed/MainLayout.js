// feed/MainLayout.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebar from "@/components/sidebar/leftSide";
import RightSidebar from "@/components/sidebar/rightSide";
import TopNavbar from "@/components/sidebar/TopNavbar";
import VideoFeed from "@/components/video/VideoFeed";
import RecipePage from "@/components/layouts/Recipe";
import CommentPage from "@/components/video/CommentPage";
import ProfilePage from "@/components/Profile/ProfilePage";
import ChatBot from "@/components/chatbot/chatBot";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const {user} = useAuth();

  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

const isCustomPage = pathname.startsWith("/shop") || pathname.startsWith("/upload") || pathname.startsWith("/about") || pathname.startsWith("/profile") || pathname.startsWith("/search");

  const activePanelType = isRecipeOpen ? "recipe" : isCommentOpen ? "comment" : null;

  return (
    <div className="flex h-screen bg-black text-white">
      {
        user ? (
          <TopNavbar />
        ) : (
          <></>
        )
      }

      <LeftSidebar
        openShop={() => {}}
        goToVideoFeed={() => {
          setIsRecipeOpen(false);
          setIsCommentOpen(false);
          setIsProfileOpen(false);
        }}
      />

      <div className="flex-grow relative flex justify-center text-black">
        {isCustomPage ? (
          <div className="w-full">{children}</div>
        ) : (
          <div className="flex w-full">
            <div className="flex-grow">
              {isProfileOpen ? (
                <div className="w-full max-w-4xl mx-auto bg-gray-900 text-white p-6 overflow-y-auto shadow-lg">
                  <ProfilePage onBack={() => setIsProfileOpen(false)} />
                </div>
              ) : (
                <VideoFeed
                  isRecipeOpen={isRecipeOpen}
                  setIsRecipeOpen={setIsRecipeOpen}
                  isCommentOpen={isCommentOpen}
                  setIsCommentOpen={setIsCommentOpen}
                  setIsProfileOpen={setIsProfileOpen}
                  setCurrentPostId={setCurrentPostId}
                />
              )}
            </div>

            <AnimatePresence mode="wait">
              {activePanelType === "recipe" && (
                <motion.div
                  key="recipe-panel"
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-[800px] bg-gray-800 text-black p-6 overflow-y-auto shadow-lg hide-scrollbar"
                >
                  <RecipePage
                  postId={currentPostId}/>
                </motion.div>
              )}

              {activePanelType === "comment" && (
                <motion.div
                  key="comment-panel"
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-[800px] bg-gray-800 text-white p-6 overflow-y-auto shadow-lg hide-scrollbar"
                >
                  <CommentPage postId={currentPostId}/>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <RightSidebar />
      <ChatBot apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY}/>
    </div>
  );
}
