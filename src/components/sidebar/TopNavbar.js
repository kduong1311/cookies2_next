"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Bạn có 1 tin nhắn mới", time: "2 phút trước" },
    { id: 2, message: "Video của bạn đã được like", time: "5 phút trước" },
    { id: 3, message: "Có người bắt đầu follow bạn", time: "10 phút trước" },
    { id: 4, message: "Bình luận mới về bài viết của bạn", time: "15 phút trước" },
    { id: 5, message: "Bạn đã nhận được lời mời kết bạn", time: "30 phút trước" },
    { id: 6, message: "Bạn có thông báo mới từ hệ thống", time: "1 giờ trước" },
    { id: 7, message: "Lịch sự kiện sắp tới đã được cập nhật", time: "2 giờ trước" },
    { id: 8, message: "Bạn được gắn thẻ trong một bài viết", time: "3 giờ trước" },
    { id: 9, message: "Một người đã chấp nhận lời mời kết bạn", time: "5 giờ trước" },
    { id: 10, message: "Tin nhắn từ quản trị viên", time: "Hôm qua" },
  ]);

  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-orange rounded-full transition-colors duration-200 relative"
          >
            <svg
              width="20"
              height="20"
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
            {/* Notification badge */}
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
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
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 cursor-pointer"
                    >
                      <p className="text-white text-sm">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange hover:border-gray-400 transition-colors duration-200">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>
          {/* Online status indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
