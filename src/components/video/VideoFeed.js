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
  setCurrentPostId
}) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState({}); // Lưu toàn bộ dữ liệu post chi tiết
  const [refreshPost, setRefreshPost] = useState(false);
  const { user } = useAuth();

  function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

  // Fetch posts và user data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://103.253.145.7:3001/api/posts', {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.status === 'success') {
          const shuffledPosts = shuffleArray(data.data);
          setPosts(shuffledPosts);

          // Fetch chi tiết từng post để lấy thông tin like
          const postDetailPromises = shuffledPosts.map(async (post) => {
            try {
              const res = await fetch(`http://103.253.145.7:3001/api/posts/${post.post_id}`, {
                method: "GET",
                credentials: 'include'
              });
              return res.json();
            } catch (error) {
              console.error('Error fetching post details:', error);
              return { status: 'error', data: post }; // Fallback về data cơ bản nếu có lỗi
            }
          });

          const postDetails = await Promise.all(postDetailPromises);
          const newPostData = {};
          postDetails.forEach(detail => {
            if (detail.status === 'success') {
              newPostData[detail.data.post_id] = detail.data;
            }
          });
          setPostData(newPostData);

          // Fetch user data
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
            usersMap[userId] = userData || null;
          });
          setUsers(usersMap);

          if (shuffledPosts.length > 0) {
            const randomIndex = Math.floor(Math.random() * shuffledPosts.length);
            setCurrentPostIndex(randomIndex);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Polling để cập nhật dữ liệu post hiện tại
  useEffect(() => {
    if (posts.length === 0) return;

    const currentPostId = posts[currentPostIndex]?.post_id;
    if (!currentPostId) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`http://103.253.145.7:3001/api/posts/${currentPostId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          setPostData(prev => ({
            ...prev,
            [currentPostId]: data.data
          }));
        }
      } catch (error) {
        console.error('Error polling post data:', error);
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [currentPostIndex, posts]);

  const updatePostInList = useCallback((updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.post_id === updatedPost.post_id) {
          return {
            ...post,
            likes_count: Math.max(0, updatedPost.likes_count ?? post.likes_count ?? 0),
            comments_count: updatedPost.comments_count ?? post.comments_count ?? 0,
            shares_count: updatedPost.shares_count ?? post.shares_count ?? 0
          };
        }
        return post;
      })
    );

    setPostData(prev => ({
      ...prev,
      [updatedPost.post_id]: {
        ...prev[updatedPost.post_id],
        ...updatedPost,
        likes_count: Math.max(0, updatedPost.likes_count ?? 0),
        likes: updatedPost.likes || prev[updatedPost.post_id]?.likes || []
      }
    }));
  }, []);

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentPostIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPostIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
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
  }, [posts.length]);

  useEffect(() => {
    if (posts.length > 0 && currentPostIndex >= 0) {
      const currentPost = posts[currentPostIndex];
      setCurrentPostId(currentPost?.post_id);
      setRefreshPost(true);
    }
  }, [currentPostIndex, posts, setCurrentPostId]);


  useEffect(() => {
  const currentPost = posts[currentPostIndex];
  if (!currentPost) return;

  const increaseView = async () => {
    try {
      await fetch(`http://103.253.145.7:3001/api/posts/${currentPost.post_id}/view`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Failed to increase view count:', error);
    }
  };

  increaseView();
}, [currentPostIndex]);

  const currentPost = posts.length > 0 ? posts[currentPostIndex] : null;
  const currentPostDetail = currentPost ? (postData[currentPost.post_id] || currentPost) : null;
  const currentUserData = currentPost ? users[currentPost.user_id] : null;

  return (
    <>
      {loading && <Loading />}

      <div className="flex justify-center items-center w-full h-screen bg-black">
        {posts.length > 0 && (
          <div className="flex items-center justify-center transition-all duration-300 relative">
            <div
              className={`bg-black rounded-lg overflow-hidden transition-all duration-300 ${
                isRecipeOpen || isCommentOpen
                  ? 'h-[95vh] max-w-[600px] w-auto'
                  : 'h-[95vh] max-w-[600px] w-auto'
              }`}
            >
              <VideoPlayer
                currentPost={currentPostDetail}
                currentUser={currentUserData}
                isRecipeOpen={isRecipeOpen}
                isCommentOpen={isCommentOpen}
              />
            </div>

            <VideoInteractions
              currentPost={currentPostDetail}
              refreshPost={refreshPost}
              setRefreshPost={setRefreshPost}
              onRecipeClick={() => {
                setIsRecipeOpen(!isRecipeOpen);
                if (!isRecipeOpen) setIsCommentOpen(false);
              }}
              onCommentClick={() => {
                setIsCommentOpen(!isCommentOpen);
                if (!isCommentOpen) setIsRecipeOpen(false);
              }}
              onUpdatePost={updatePostInList}
            />
          </div>
        )}

        {posts.length > 0 && (
          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30">
            <div className="flex flex-col justify-center items-center space-y-4">
              <button
                onClick={handlePrevious}
                className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-orange-500 flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-orange-500 flex items-center justify-center transition-colors backdrop-blur-sm"
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
