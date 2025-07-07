import { useState, useEffect, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import VideoInteractions from './VideoInteractions';
import Loading from '../Loading';
import { useAuth } from '@/contexts/AuthContext';

export default function VideoFeed({
  isRecipeOpen,
  setIsRecipeOpen,
  isCommentOpen,
  setIsCommentOpen,
  setIsProfileOpen,
  setCurrentPostId,
}) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [currentPostIndex, setCurrentPostIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [currentPostDetail, setCurrentPostDetail] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const { user } = useAuth();

  // Fetch danh sách posts ban đầu
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://103.253.145.7:3001/api/posts', {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.status === 'success') {
          const shuffledPosts = shuffleArray(data.data);
          setPosts(shuffledPosts);

          // Fetch thông tin user cho tất cả posts
          const userPromises = shuffledPosts.map(async (post) => {
            try {
              const userResponse = await fetch(`http://103.253.145.7:3000/api/users/${post.user_id}`, {
                credentials: 'include'
              });
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
            usersMap[userId] = userData?.data || null;
          });
          setUsers(usersMap);

          if (shuffledPosts.length > 0) {
            const randomIndex = Math.floor(Math.random() * shuffledPosts.length);
            setCurrentPostIndex(randomIndex);
          }
        }
      } catch (error) {
        console.error('Error fetching initial posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, []);

  // Fetch chi tiết post khi currentPostIndex thay đổi
  useEffect(() => {
    if (posts.length === 0 || currentPostIndex === -1) return;

    const currentPostId = posts[currentPostIndex]?.post_id;
    if (!currentPostId) return;

    const fetchPostDetail = async () => {
      try {
        setLoadingPost(true);
        const response = await fetch(`http://103.253.145.7:3001/api/posts/${currentPostId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          setCurrentPostDetail(data.data);
          setCurrentPostId(currentPostId);
        } else {
          console.error('Failed to fetch post detail:', data.message);
        }
      } catch (error) {
        console.error('Error fetching post detail:', error);
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPostDetail();
  }, [currentPostIndex, posts, setCurrentPostId]);

  // Cập nhật dữ liệu post khi có thay đổi từ interactions
  const updatePostData = useCallback((updatedPost) => {
    setCurrentPostDetail(prev => ({
      ...prev,
      ...updatedPost,
      likes_count: Math.max(0, updatedPost.likes_count ?? 0),
      likes: updatedPost.likes || prev?.likes || []
    }));

    // Cập nhật cả danh sách posts để giữ đồng bộ
    setPosts(prevPosts =>
      prevPosts.map(post => 
        post.post_id === updatedPost.post_id 
          ? { ...post, likes_count: updatedPost.likes_count } 
          : post
      )
    );
  }, []);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (posts.length === 0) return;
    setCurrentPostIndex(prev => (prev === 0 ? posts.length - 1 : prev - 1));
  }, [posts.length]);

  const handleNext = useCallback(() => {
    if (posts.length === 0) return;
    setCurrentPostIndex(prev => (prev === posts.length - 1 ? 0 : prev + 1));
  }, [posts.length]);

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
  }, [handleNext, handlePrevious]);

  const currentUser = users[currentPostDetail?.user_id];

  return (
    <>
      {(loading || loadingPost) && <Loading />}

      <div className="flex justify-center items-center w-full h-screen bg-black">
        {currentPostDetail && (
          <div className="flex items-center justify-center transition-all duration-300 relative">
            <div className={`bg-black rounded-lg overflow-hidden transition-all duration-300 ${
              isRecipeOpen || isCommentOpen
                ? 'h-[90vh] max-w-[600px] w-auto'
                : 'h-[90vh] max-w-[600px] w-auto'
            }`}>
              <VideoPlayer
                currentPost={currentPostDetail}
                currentUser={currentUser}
                isRecipeOpen={isRecipeOpen}
                isCommentOpen={isCommentOpen}
              />
            </div>

            <VideoInteractions
              currentPost={currentPostDetail}
              currentUser={currentUser}
              onRecipeClick={() => {
                setIsRecipeOpen(!isRecipeOpen);
                if (!isRecipeOpen) setIsCommentOpen(false);
              }}
              onCommentClick={() => {
                setIsCommentOpen(!isCommentOpen);
                if (!isCommentOpen) setIsRecipeOpen(false);
              }}
              onUpdatePost={updatePostData}
            />
          </div>
        )}

        {posts.length > 0 && (
          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30">
            <div className="flex flex-col justify-center items-center space-y-4">
              <button
                onClick={handlePrevious}
                className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-orange-500 flex items-center justify-center transition-colors backdrop-blur-sm"
                disabled={loadingPost}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-orange-500 flex items-center justify-center transition-colors backdrop-blur-sm"
                disabled={loadingPost}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}