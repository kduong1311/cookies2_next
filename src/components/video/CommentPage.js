"use client";
import { useState } from "react";
import { Heart, Send, MoreHorizontal, Reply } from "lucide-react";

export default function CommentPage() {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "foodlover123",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c64c8fae?w=40&h=40&fit=crop&crop=faces",
      content: "Món này trông ngon quá! Có thể chia sẻ công thức không?",
      likes: 12,
      time: "2 giờ trước",
      replies: [
        {
          id: 11,
          username: "chef_master",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces",
          content: "Tôi sẽ đăng công thức chi tiết sau nhé!",
          likes: 5,
          time: "1 giờ trước"
        }
      ]
    },
    {
      id: 2,
      username: "cooking_enthusiast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=faces",
      content: "Tôi đã thử làm theo cách này và kết quả rất tuyệt vời!",
      likes: 8,
      time: "4 giờ trước",
      replies: []
    },
    {
      id: 3,
      username: "healthy_eater",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces",
      content: "Có thể thay thế bằng nguyên liệu organic không?",
      likes: 3,
      time: "6 giờ trước",
      replies: []
    }
  ]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        username: "you",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=faces",
        content: newComment,
        likes: 0,
        time: "Vừa xong",
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleLike = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

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
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=faces"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
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
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
            {/* Main Comment */}
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
                  <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                    <Reply size={14} />
                    <span>Trả lời</span>
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-11 mt-3 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <img
                      src={reply.avatar}
                      alt={reply.username}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-xs">
                          {reply.username}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {reply.time}
                        </span>
                      </div>
                      <p className="text-gray-200 text-xs mb-1 leading-relaxed">
                        {reply.content}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Heart size={12} />
                          <span>{reply.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                          <Reply size={12} />
                          <span>Trả lời</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}