"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Bell,
  BellOff,
  Heart,
  MessageSquare,
  UserPlus,
  CheckCircle,
  Circle,
  ShoppingCart,
} from "lucide-react";

export default function TopNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `http://103.253.145.7:8080/api/users/${user.user_id}`, {withCredentials: true}
      );
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchNotifications = async () => {
    if (!user?.user_id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        "http://103.253.145.7:3005/api/notifications",
        {
          params: {
            user_id: user.user_id,
            limit: 20,
            offset: 0,
          },
        }
      );
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `http://103.253.145.7:3005/api/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === notificationId
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!user?.user_id) return;

      await axios.patch(
        "http://103.253.145.7:3005/api/notifications/read-all",
        { user_id: user.user_id },
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchNotifications();
  }, [user?.user_id]);

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.notification_id);
    }

    if (
      notification.reference_type === "post" &&
      notification.reference_id
    ) {
      router.push(`/post/${notification.reference_id}`);
    };

    if (
      notification.reference_type === "order"
    ) {
      router.push(`/profile/${user?.user_id}/my_orders`);
    }

    if (
      notification.type === "new_post"
    ) {
      router.push(`/profile/${notification.reference_id}`);
    }

    setShowNotifications(false);
  };

  const handleAvatarClick = () => {
    if (user?.user_id) {
      router.push(`/profile/${user.user_id}`);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Now";
    if (diffInMinutes < 60) return `${diffInMinutes} Last min`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} last hour`;
    return `${Math.floor(diffInMinutes / 1440)} last day`;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      like: <Heart className="w-4 h-4 text-white" />,
      follow: <UserPlus className="w-4 h-4 text-white" />,
      comment: <MessageSquare className="w-4 h-4 text-white" />,
      order: <ShoppingCart className="w-4 h-4 text-white" />,
      default: <Circle className="w-4 h-4 text-white" />,
    };

    const bgColor = {
      like: "bg-red-500",
      follow: "bg-blue-500",
      comment: "bg-green-500",
      order: "bg-gray-500",
      default: "bg-gray-500",
    };

    const icon = icons[type] || icons.default;
    const bg = bgColor[type] || bgColor.default;

    return (
      <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
    );
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const defaultAvatar =
    "https://img.freepik.com/premium-photo/male-female-profile-avatar-user-avatars-gender-icons_1020867-75099.jpg";

  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) fetchNotifications();
            }}
            className="p-2 bg-orange-500 rounded-full transition-all duration-200 relative hover:bg-orange-600 hover:scale-105 shadow-lg"
          >
            <Bell className="text-white w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-[420px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
              >

                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-orange-600">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-lg">
                      Notification
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-white/80 hover:text-white text-sm underline transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-gray-400 mt-2">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BellOff className="text-gray-400 w-6 h-6" />
                      </div>
                      <p className="text-gray-400 font-medium">
                        Have no new notification
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        New notification will be here
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.notification_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() =>
                            handleNotificationClick(notification)
                          }
                          className={`p-4 cursor-pointer transition-all duration-200 relative`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p
                                    className={`text-sm font-medium ${
                                      !notification.is_read
                                        ? "text-gray-900 dark:text-white"
                                        : "text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p
                                    className={`text-sm mt-1 ${
                                      !notification.is_read
                                        ? "text-gray-600 dark:text-gray-400"
                                        : "text-gray-500 dark:text-gray-500"
                                    }`}
                                  >
                                    {notification.content}
                                  </p>
                                  <div className="flex items-center mt-2 space-x-2">
                                    <p className="text-xs text-gray-400">
                                      {formatTime(notification.created_at)}
                                    </p>
                                    {notification.count > 1 && (
                                      <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                                        {notification.count} people
                                      </span>
                                    )}
                                  </div>
                                </div>

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

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="w-full text-center text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium transition-colors py-1"
                    >
                      Close
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={handleAvatarClick}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 hover:border-orange-600 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <img
              src={user.avatar_url || defaultAvatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
          </button>

          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>

          {userDetails?.is_verified && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
