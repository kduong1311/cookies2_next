import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
  const [allPostIds, setAllPostIds] = useState([]);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postData, setPostData] = useState({});
  const [refreshPost, setRefreshPost] = useState(false);
  const { user } = useAuth();

  const POSTS_PER_BATCH = 3; 
  const PREFETCH_THRESHOLD = 1;

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Fetch all post, only get id
  useEffect(() => {
    if (!user) return;

    const fetchAllPostIds = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://103.253.145.7:8080/api/posts', { withCredentials: true });

        if (data.status === 'success') {
          const shuffledPosts = shuffleArray(data.data);
          setAllPostIds(shuffledPosts);
          
          // Load first batch
          await loadPostBatch(shuffledPosts, 0, POSTS_PER_BATCH);
          
          if (shuffledPosts.length > 0) {
            setCurrentPostIndex(0);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPostIds();
  }, [user]);

  // optimized load batch, fetch song//
  const loadPostBatch = async (postList, startIndex, count) => {
    const postsToLoad = postList.slice(startIndex, startIndex + count);
    if (postsToLoad.length === 0) return;

    setLoadingMore(true);
    
    try {
      // time out for reques
      const fetchWithTimeout = (url, timeout = 8000) => {
        return Promise.race([
          axios.get(url, { withCredentials: true }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      // Fetch song// user data and post data
      const allPromises = postsToLoad.flatMap(post => [
        // Post detail
        fetchWithTimeout(`http://103.253.145.7:8080/api/posts/${post.post_id}`)
          .then(res => ({ type: 'post', postId: post.post_id, data: res.data }))
          .catch(error => ({ type: 'post', postId: post.post_id, error, data: { status: 'error', data: post } })),
        
        // User data
        fetchWithTimeout(`http://103.253.145.7:3000/api/users/${post.user_id}`)
          .then(res => ({ type: 'user', userId: post.user_id, data: res.data }))
          .catch(error => ({ type: 'user', userId: post.user_id, error, data: null }))
      ]);

      // Waite reques complete song2
      const results = await Promise.allSettled(allPromises);
      
      const newPostData = {};
      const newLoadedPosts = [];
      const usersMap = {};

      // handle result
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const { type, postId, userId, data } = result.value;
          
          if (type === 'post' && data.status === 'success') {
            newPostData[postId] = data.data;
            newLoadedPosts.push(data.data);
          } else if (type === 'user') {
            usersMap[userId] = data;
          }
        }
      });

      // sort by default list
      const sortedPosts = postsToLoad
        .map(post => newPostData[post.post_id])
        .filter(Boolean);

      // Update state one time
      setPostData(prev => ({ ...prev, ...newPostData }));
      setLoadedPosts(prev => [...prev, ...sortedPosts]);
      setUsers(prev => ({ ...prev, ...usersMap }));

    } catch (error) {
      console.error('Error loading post batch:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Prefetch background not block ui
  const prefetchNextBatch = useCallback(async () => {
    if (loadedPosts.length >= allPostIds.length || loadingMore) return;
    
    const startIndex = loadedPosts.length;
    const nextBatch = allPostIds.slice(startIndex, startIndex + POSTS_PER_BATCH);
    
    // Background prefetch
    try {
      const promises = nextBatch.map(async (post) => {
        try {
          const [postRes, userRes] = await Promise.all([
            axios.get(`http://103.253.145.7:8080/api/posts/${post.post_id}`, { withCredentials: true }),
            axios.get(`http://103.253.145.7:3000/api/users/${post.user_id}`, { withCredentials: true })
          ]);
          return { post: postRes.data, user: userRes.data, postId: post.post_id, userId: post.user_id };
        } catch (error) {
          return { error, postId: post.post_id, userId: post.user_id };
        }
      });

      const results = await Promise.all(promises);
      
      const newPostData = {};
      const newLoadedPosts = [];
      const usersMap = {};

      results.forEach(result => {
        if (result.post?.status === 'success') {
          newPostData[result.postId] = result.post.data;
          newLoadedPosts.push(result.post.data);
        }
        if (result.user) {
          usersMap[result.userId] = result.user;
        }
      });

      // Update cache
      setPostData(prev => ({ ...prev, ...newPostData }));
      setLoadedPosts(prev => [...prev, ...newLoadedPosts]);
      setUsers(prev => ({ ...prev, ...usersMap }));

    } catch (error) {
      console.error('Background prefetch failed:', error);
    }
  }, [loadedPosts.length, allPostIds.length, allPostIds, loadingMore]);

  // Debounced prefetch
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPostIndex >= loadedPosts.length - PREFETCH_THRESHOLD - 1) {
        prefetchNextBatch();
      }
    }, 1000); //after stop scroll 1s

    return () => clearTimeout(timeoutId);
  }, [currentPostIndex, prefetchNextBatch]);

  // Polling for current post
  useEffect(() => {
    if (loadedPosts.length === 0) return;

    const currentPostId = loadedPosts[currentPostIndex]?.post_id;
    if (!currentPostId) return;

    const intervalId = setInterval(async () => {
      try {
        const { data } = await axios.get(`http://103.253.145.7:3001/api/posts/${currentPostId}`, {
          withCredentials: true,
          timeout: 5000 // 5s timeout
        });

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
  }, [currentPostIndex, loadedPosts]);

  //load more, when need
  const checkAndLoadMore = useCallback(async (newIndex) => {
    if (newIndex >= loadedPosts.length - PREFETCH_THRESHOLD && 
        loadedPosts.length < allPostIds.length && 
        !loadingMore) {
      const startIndex = loadedPosts.length;
      await loadPostBatch(allPostIds, startIndex, POSTS_PER_BATCH);
    }
  }, [loadedPosts.length, allPostIds.length, allPostIds, loadingMore]);

  const updatePostInList = useCallback((updatedPost) => {
    setLoadedPosts(prevPosts =>
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

  const handlePrevious = () => {
    const newIndex = currentPostIndex === 0 ? loadedPosts.length - 1 : currentPostIndex - 1;
    setCurrentPostIndex(newIndex);
    checkAndLoadMore(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentPostIndex === loadedPosts.length - 1 ? 0 : currentPostIndex + 1;
    setCurrentPostIndex(newIndex);
    checkAndLoadMore(newIndex);
  };

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
  }, [loadedPosts.length, currentPostIndex]);

  useEffect(() => {
    if (loadedPosts.length > 0 && currentPostIndex >= 0) {
      const currentPost = loadedPosts[currentPostIndex];
      setCurrentPostId(currentPost?.post_id);
      setRefreshPost(true);
    }
  }, [currentPostIndex, loadedPosts, setCurrentPostId]);

  useEffect(() => {
    const currentPost = loadedPosts[currentPostIndex];
    if (!currentPost) return;
    if (!currentPost?.post_id) return;

    const increaseView = async () => {
      try {
        await axios.post(
          `http://103.253.145.7:8080/api/posts/${currentPost.post_id}/view`,
          {},
          { withCredentials: true, timeout: 3000 }
        );
      } catch (error) {
        console.error('Failed to increase view count:', error);
      }
    };

    increaseView();
  }, [currentPostIndex, loadedPosts]);

  const currentPost = loadedPosts.length > 0 ? loadedPosts[currentPostIndex] : null;
  const currentPostDetail = currentPost ? (postData[currentPost.post_id] || currentPost) : null;
  const currentUserData = currentPost ? users[currentPost.user_id] : null;

  return (
    <>
      {loading && <Loading />}

      <div className="flex justify-center items-center w-full h-screen bg-black">
        {loadedPosts.length > 0 && (
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
              
              {/* Loading indicator - only do on loading */}
              {loadingMore && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                </div>
              )}
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

        {loadedPosts.length > 0 && (
          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30">
            <div className="flex flex-col justify-center items-center space-y-4">
              <button
                onClick={handlePrevious}
                className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-orange-500 flex items-center justify-center transition-colors backdrop-blur-sm"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-orange-500 flex items-center justify-center transition-colors backdrop-blur-sm"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Progress indicator với cache info */}
            <div className="mt-4 text-center">
              <div className="text-white/60 text-xs">
                {currentPostIndex + 1} / {allPostIds.length}
              </div>
              <div className="text-orange-400/60 text-xs mt-1">
                Loaded: {loadedPosts.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}