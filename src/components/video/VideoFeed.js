import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import VideoInteractions from './VideoInteractions';
import Loading from '../Loading';

export default function VideoFeed({ isRecipeOpen, setIsRecipeOpen, isCommentOpen, setIsCommentOpen, setIsProfileOpen }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [loading, setLoading] = useState(true); // vẫn giữ state loading

  // Fetch posts and user data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://103.253.145.7:3001/api/posts');
        const data = await response.json();
        
        if (data.status === 'success') {
          setPosts(data.data);
          
          // Fetch user data for each post
          const userPromises = data.data.map(async (post) => {
            try {
              const userResponse = await fetch(`http://103.253.145.7:3000/api/users/${post.user_id}`);
              const userData = await userResponse.json();
              return { userId: post.user_id, userData };
            } catch (error) {
              console.error('Error fetching user:', error);
              return { userId: post.user_id, userData: null };
            }
          });
          
          const userResults = await Promise.all(userPromises);
          const usersMap = {};
          userResults.forEach(({ userId, userData }) => {
            usersMap[userId] = userData;
          });
          setUsers(usersMap);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Navigation handlers
  const handlePrevious = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPostIndex, posts.length]);

  const currentPost = posts[currentPostIndex];
  const currentUser = users[currentPost?.user_id];

  return (
    <>
      {/* Hiển thị modal loading nếu đang fetch */}
      {loading && <Loading />}

      <div className="flex justify-center items-center w-full h-screen bg-black">
        {/* Container cho video và interaction */}
        <div className="relative flex items-center justify-center">
          {/* Fixed 9:16 Video Container */}
          {posts.length > 0 && (
            <div className={`relative bg-black rounded-lg overflow-hidden transition-all duration-300 ${
              isRecipeOpen || isCommentOpen ? 'h-[90vh] w-auto max-w-[600px]' : 'h-[90vh] w-auto max-w-[600px]'
            }`}>
              <VideoPlayer
                currentPost={currentPost}
                currentUser={currentUser}
                isRecipeOpen={isRecipeOpen}
                isCommentOpen={isCommentOpen}
              />
            </div>
          )}

          {/* Video Interactions - dính vào cạnh phải video */}
          {posts.length > 0 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-full ml-4">
              <VideoInteractions 
                currentPost={currentPost}
                currentUser={currentUser}
                onRecipeClick={() => {
                  setIsRecipeOpen(!isRecipeOpen);
                  if (!isRecipeOpen) setIsCommentOpen(false);
                }}
                onCommentClick={() => {
                  setIsCommentOpen(!isCommentOpen);
                  if (!isCommentOpen) setIsRecipeOpen(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        {posts.length > 0 && (
          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30">
            <div className="flex flex-col justify-center items-center">
              <div className="space-y-4">
                {/* Nút điều hướng lên */}
                <button 
                  onClick={handlePrevious}
                  disabled={currentPostIndex === 0}
                  className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* Page Indicator */}
                <div className="text-white text-xs text-center bg-black/60 rounded-full px-3 py-1 backdrop-blur-sm">
                  {currentPostIndex + 1}/{posts.length}
                </div>

                {/* Nút điều hướng xuống */}
                <button 
                  onClick={handleNext}
                  disabled={currentPostIndex === posts.length - 1}
                  className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
