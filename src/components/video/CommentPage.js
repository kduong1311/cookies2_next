"use client";
import { useEffect, useState } from "react";
import { Heart, Send, MoreHorizontal, Reply, Trash2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export default function CommentPage({ postId }) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usersMap, setUsersMap] = useState({});
  const { user: loggedInUser } = useAuth();

  const fetchCommentsAndUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://103.253.145.7:8080/api/posts/${postId}`);
      if (!res.ok) throw new Error("Failed to load comments.");
      const data = await res.json();
      if (data.status !== "success") throw new Error("Server responded with an error.");
      const fetchedComments = data.data?.comments || [];

      const userIds = [...new Set(fetchedComments.map(c => c.user_id))];
      const userFetches = userIds.map(async (id) => {
        try {
          const userRes = await fetch(`http://103.253.145.7:8080/api/users/${id}`);
          if (!userRes.ok) throw new Error("Failed to load user information.");
          const userData = await userRes.json();
          console.log("user", userData)
          return { id, data: userData };
        } catch (err) {
          console.error(`Error fetching user ${id}:`, err);
          return { id, data: null };
        }
      });

      const usersData = await Promise.all(userFetches);
      const newUsersMap = {};
      usersData.forEach(({ id, data }) => {
        if (data) {
          newUsersMap[id] = data;
        }
      });
      setUsersMap(newUsersMap);

      const commentMap = {};
      const rootComments = [];

      fetchedComments.forEach(c => {
        const now = new Date();
        const commentTime = new Date(c.created_at);
        const diffMinutes = Math.abs((now - commentTime) / 1000 / 60);
        const timeDisplay = diffMinutes <= 5 ? "Now" : commentTime.toLocaleString();

        commentMap[c.comment_id] = {
          id: c.comment_id,
          userId: c.user_id,
          username: loggedInUser?.user_id === c.user_id
            ? "you"
            : newUsersMap[c.user_id]?.username || "unknown",
          avatar: newUsersMap[c.user_id]?.avatar_url || "https://res.cloudinary.com/da9rooi9r/image/upload/v1752864494/zyznfxs9jabfjnmvr0or.png",
          content: c.content,
          likes: c.likes_count || 0,
          time: timeDisplay,
          replies: [],
          parentId: c.parent_comment_id,
        };
      });

      Object.values(commentMap).forEach(comment => {
        if (comment.parentId && commentMap[comment.parentId]) {
          commentMap[comment.parentId].replies.push(comment);
        } else {
          rootComments.push(comment);
        }
      });

      rootComments.sort((a, b) => new Date(b.time) - new Date(a.time));

      const sortReplies = (comments) => {
        comments.forEach(comment => {
          if (comment.replies && comment.replies.length > 0) {
            comment.replies.sort((a, b) => new Date(a.time) - new Date(b.time));
            sortReplies(comment.replies);
          }
        });
      };

      sortReplies(rootComments);
      setComments(rootComments);

    } catch (err) {
      console.error("Fetch comments error:", err);
      setError("An error occurred while loading comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) return;
    fetchCommentsAndUsers();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const requestBody = {
        content: newComment,
        parent_comment_id: replyTo || null,
      };

      const res = await fetch(`http://103.253.145.7:8080/api/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Server response:", errorData);
        throw new Error("Failed to submit comment.");
      }

      const data = await res.json();
      if (data.status !== "success") throw new Error("Server returned an error.");

      const newCommentObj = {
        id: data.data.comment_id,
        userId: loggedInUser?.user_id,
        username: "you",
        avatar: loggedInUser?.avatar_url || "https://res.cloudinary.com/da9rooi9r/image/upload/v1752864494/zyznfxs9jabfjnmvr0or.png",
        content: data.data.content,
        likes: 0,
        time: "Now",
        replies: [],
        parentId: replyTo,
      };

      setComments((prev) => {
        if (replyTo) {
          const addReply = (comments) =>
            comments.map((c) => {
              if (c.id === replyTo) {
                return { ...c, replies: [...c.replies, newCommentObj] };
              } else if (c.replies?.length) {
                return { ...c, replies: addReply(c.replies) };
              }
              return c;
            });
          return addReply(prev);
        } else {
          return [newCommentObj, ...prev];
        }
      });

      setNewComment("");
      setReplyTo(null);
    } catch (err) {
      console.error("Add comment error:", err);
      alert("An error occurred while submitting the comment.");
    }
  };

  const handleLike = async (commentId) => {
    try {
      const likeRecursive = (comments) => comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        } else if (comment.replies?.length) {
          return { ...comment, replies: likeRecursive(comment.replies) };
        }
        return comment;
      });
      setComments(likeRecursive(comments));

      const res = await fetch(`http://103.253.145.7:3001/api/posts/${postId}/comments/${commentId}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const revertLike = (comments) => comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes - 1 };
          } else if (comment.replies?.length) {
            return { ...comment, replies: revertLike(comment.replies) };
          }
          return comment;
        });
        setComments(revertLike(comments));
        throw new Error("Failed to like comment.");
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`http://103.253.145.7:8080/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete.");

      const deleteRecursive = (comments) => comments
        .map(comment => {
          if (comment.id === commentId) return null;
          if (comment.replies?.length) {
            return { ...comment, replies: deleteRecursive(comment.replies).filter(Boolean) };
          }
          return comment;
        })
        .filter(Boolean);

      setComments(prev => deleteRecursive(prev));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete the comment.");
    }
  };

  const renderComment = (comment, level = 0) => (
    <div key={comment.id} className="p-4 border-b border-gray-700 hover:bg-gray-800/50 transition-colors" style={{ marginLeft: level * 20 }}>
      <div className="flex gap-3">
        <img
          src={comment.avatar}
          alt={comment.username}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            e.target.src = "https://ui-avatars.com/api/?name=?&background=random";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">
              {comment.username}
            </span>
            <span className="text-gray-400 text-xs">
              {comment.time}
            </span>
          </div>
          <p className="text-gray-200 text-sm mb-2 leading-relaxed">
            {comment.content}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => handleLike(comment.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart size={14} />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => setReplyTo(comment.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Reply size={14} />
              <span>Reply</span>
            </button>
            {comment.userId === loggedInUser?.user_id && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            )}
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
          {comment.replies?.length > 0 && (
            <div className="mt-3">
              {comment.replies.map(child => renderComment(child, level + 1))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading comments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Comments</h2>
        <div className="text-sm text-gray-400">
          {comments.length} comments
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-b border-gray-700">
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <img
            src={loggedInUser?.avatar_url || "https://ui-avatars.com/api/?name=?&background=random"}
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "https://ui-avatars.com/api/?name=?&background=random";
            }}
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "Reply to comment..." : "Write a comment..."}
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        {replyTo && (
          <div className="text-sm text-gray-400 mt-2">
            Replying... <button onClick={() => setReplyTo(null)} className="underline">Cancel</button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No comments yet
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}
