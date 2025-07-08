"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function TopNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications từ API
  const fetchNotifications = async () => {
    if (!user?.user_id) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://103.253.145.7:3005/api/notifications?user_id=${user.user_id}&limit=20&offset=0`, {
          method: "GET",
          credentials: "include"
        }
      );
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications khi component mount
  useEffect(() => {
    fetchNotifications();
  }, [user?.user_id]);

  // Format thời gian
  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  // Xử lý click vào avatar để chuyển sang profile
  const handleAvatarClick = () => {
    if (user?.user_id) {
      router.push(`/profile/${user.user_id}`);
    }
  };

  // Xử lý click vào notification
  const handleNotificationClick = async (notification) => {
    // Đánh dấu đã đọc (nếu có API)
    // await markAsRead(notification.notification_id);
    
    // Chuyển hướng dựa trên type và reference
    if (notification.reference_type === 'post' && notification.reference_id) {
      router.push(`/post/${notification.reference_id}`);
    }
    
    setShowNotifications(false);
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                fetchNotifications(); // Refresh notifications khi mở
              }
            }}
            className="p-2 bg-orange rounded-full transition-colors duration-200 relative hover:bg-orange-600"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                fill="currentColor"
              />
            </svg>
            {/* Notification badge - chỉ hiện nếu có thông báo chưa đọc */}
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.filter(n => !n.is_read).length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-[400px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-3 border-b border-gray-700 bg-orange-tw">
                  <h3 className="font-medium text-white">Thông báo</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="p-4 text-center text-gray-400">
                      Đang tải...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      Không có thông báo nào
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.notification_id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 cursor-pointer transition-colors ${
                          !notification.is_read ? 'bg-gray-750' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {notification.title}
                            </p>
                            <p className="text-gray-300 text-sm mt-1">
                              {notification.content}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {formatTime(notification.created_at)}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-700 bg-gray-800">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="w-full text-center text-orange text-sm hover:text-orange-400 transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button 
            onClick={handleAvatarClick}
            className="w-15 h-15 rounded-full overflow-hidden border-2 border-orange hover:border-gray-400 transition-colors duration-200"
          >
            <img
              src={user?.avatar_url}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}