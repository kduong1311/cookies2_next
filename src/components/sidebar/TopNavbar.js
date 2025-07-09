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
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details từ API
  const fetchUserDetails = async () => {
    if (!user?.user_id) return;
    
    try {
      const response = await fetch(`http://103.253.145.7:3000/api/users/${user.user_id}`);
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch notifications từ API
  const fetchNotifications = async () => {
    if (!user?.user_id) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://103.253.145.7:3005/api/notifications?user_id=${user.user_id}&limit=20&offset=0`
      );
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://103.253.145.7:3005/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: "include"
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.notification_id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Fetch data khi component mount
  useEffect(() => {
    fetchUserDetails();
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

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        );
    }
  };

  // Xử lý click vào avatar để chuyển sang profile
  const handleAvatarClick = () => {
    if (user?.user_id) {
      router.push(`/profile/${user.user_id}`);
    }
  };

  // Xử lý click vào notification
  const handleNotificationClick = async (notification) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!notification.is_read) {
      await markAsRead(notification.notification_id);
    }
    
    // Chuyển hướng dựa trên type và reference
    if (notification.reference_type === 'post' && notification.reference_id) {
      router.push(`/post/${notification.reference_id}`);
    } else if (notification.reference_type === 'user' && notification.reference_id) {
      router.push(`/profile/${notification.reference_id}`);
    }
    
    setShowNotifications(false);
  };

  // Mark all as read
  const markAllAsRead = async () => {
  try {
    if (!user?.user_id) return;

    await fetch("http://103.253.145.7:3005/api/notifications/read-all", {
      method: 'PATCH',
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.user_id
      })
    });

    // Cập nhật local state
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, is_read: true }))
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const defaultAvatar = "https://img.freepik.com/premium-photo/male-female-profile-avatar-user-avatars-gender-icons_1020867-75099.jpg";

  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                fetchNotifications();
              }
            }}
            className="p-2 bg-orange-500 rounded-full transition-all duration-200 relative hover:bg-orange-600 hover:scale-105 shadow-lg"
          >
            <svg
              width="24"
              height="24"
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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
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
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-[420px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-orange-600">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-lg">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-white/80 hover:text-white text-sm underline transition-colors"
                      >
                        Đánh dấu tất cả đã đọc
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-gray-400 mt-2">Đang tải...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
                        </svg>
                      </div>
                      <p className="text-gray-400 font-medium">Không có thông báo nào</p>
                      <p className="text-gray-500 text-sm mt-1">Thông báo mới sẽ xuất hiện ở đây</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.notification_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ backgroundColor: notification.is_read ? 'rgba(0,0,0,0.02)' : 'rgba(249,115,22,0.05)' }}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 cursor-pointer transition-all duration-200 relative ${
                            !notification.is_read 
                              ? 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${
                                    !notification.is_read 
                                      ? 'text-gray-900 dark:text-white' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className={`text-sm mt-1 ${
                                    !notification.is_read 
                                      ? 'text-gray-600 dark:text-gray-400' 
                                      : 'text-gray-500 dark:text-gray-500'
                                  }`}>
                                    {notification.content}
                                  </p>
                                  <div className="flex items-center mt-2 space-x-2">
                                    <p className="text-xs text-gray-400">
                                      {formatTime(notification.created_at)}
                                    </p>
                                    {notification.count > 1 && (
                                      <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                                        {notification.count} người
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Unread indicator */}
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 ml-2 animate-pulse"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="w-full text-center text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium transition-colors py-1"
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
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 hover:border-orange-600 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <img
              src={userDetails?.avatar_url || defaultAvatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
          </button>
          
          {/* Online status indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          
          {/* Verified badge if user is verified */}
          {userDetails?.is_verified && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}