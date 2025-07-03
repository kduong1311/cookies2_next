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
      const res = await fetch(`http://103.253.145.7:3001/api/posts/${postId}`);
      if (!res.ok) throw new Error("Không thể tải bình luận.");
      const data = await res.json();
      if (data.status !== "success") throw new Error("Lỗi phản hồi từ server.");
      const fetchedComments = data.data?.comments || [];

      const userIds = [...new Set(fetchedComments.map(c => c.user_id))];
      const userFetches = userIds.map(async (id) => {
        const userRes = await fetch(`http://103.253.145.7:3000/api/users/${id}`);
        if (!userRes.ok) throw new Error("Không thể tải thông tin người dùng.");
        const userData = await userRes.json();
        return { id, data: userData };
      });
      const usersData = await Promise.all(userFetches);
      const newUsersMap = {};
      usersData.forEach(({ id, data }) => newUsersMap[id] = data);
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
          avatar: newUsersMap[c.user_id]?.avatar_url || "https://ui-avatars.com/api/?name=?&background=random",
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

      setComments(rootComments.reverse());
    } catch (err) {
      console.error("Fetch comments error:", err);
      setError("Đã có lỗi khi tải bình luận.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) return;
    fetchCommentsAndUsers();
  }, [postId, loggedInUser]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`http://103.253.145.7:3001/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          parent_comment_id: replyTo || null,
        }),
      });
      if (!res.ok) throw new Error("Không thể gửi bình luận.");
      setNewComment("");
      setReplyTo(null);
      await fetchCommentsAndUsers();
    } catch (err) {
      console.error("Add comment error:", err);
      alert("Đã có lỗi khi gửi bình luận.");
    }
  };

  const handleLike = (commentId) => {
    const likeRecursive = (comments) => comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      } else if (comment.replies?.length) {
        return { ...comment, replies: likeRecursive(comment.replies) };
      }
      return comment;
    });
    setComments(likeRecursive(comments));
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`http://103.253.145.7:3001/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa thất bại.");
      await fetchCommentsAndUsers();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Không thể xóa bình luận.");
    }
  };

  const renderComment = (comment, level = 0) => (
    <div key={comment.id} className="p-4 border-b border-gray-700 hover:bg-gray-800/50 transition-colors" style={{ marginLeft: level * 20 }}>
      <div className="flex gap-3">
        <img
          src={comment.avatar}
          alt={comment.username}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
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
              <span>Trả lời</span>
            </button>
            {comment.userId === loggedInUser?.user_id && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={14} />
                <span>Xóa</span>
              </button>
            )}
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
          {comment.replies?.length > 0 && comment.replies.map(child => renderComment(child, level + 1))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Đang tải bình luận...
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
        <h2 className="text-xl font-bold text-white">Bình luận</h2>
        <div className="text-sm text-gray-400">
          {comments.length} bình luận
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-b border-gray-700">
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <img
            src={loggedInUser?.avatar_url || "https://ui-avatars.com/api/?name=?&background=random"}
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "Trả lời bình luận..." : "Viết bình luận..."}
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
            Đang trả lời... <button onClick={() => setReplyTo(null)} className="underline">Hủy</button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        {comments.map((comment) => renderComment(comment))}
      </div>  
    </div>
  );
}
