import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import VideoGrid from './VideoGrid';
import RecipeGrid from './RecipeGrid';
import SavedGrid from './SaveGrid';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('videos');
  const [viewMode, setViewMode] = useState('grid');

  // Mock data
  const userProfile = {
    coverImage: 'https://marketplace.canva.com/EAEmBit3KfU/3/0/1600w/canva-black-flatlay-photo-motivational-finance-quote-facebook-cover-ZsKh4J6p4s8.jpg',
    avatar: 'https://marketplace.canva.com/EAEmBit3KfU/3/0/1600w/canva-black-flatlay-photo-motivational-finance-quote-facebook-cover-ZsKh4J6p4s8.jpg',
    name: 'Minh Châu',
    username: '@minh_chau_cook',
    bio: 'Đầu bếp nghiệp dư yêu thích chia sẻ những món ăn ngon từ khắp nơi trên thế giới 🍳👨‍🍳',
    followers: 15420,
    following: 892,
    totalVideos: 127,
    totalRecipes: 89,
    isOnline: true
  };

  const videos = [
    {
      id: 1,
      thumbnail: '/api/placeholder/300/200',
      title: 'Cách làm Phở Bò truyền thống',
      duration: '12:45',
      views: '25.2K',
      likes: 1250
    },
    {
      id: 2,
      thumbnail: '/api/placeholder/300/200',
      title: 'Bánh Mì Việt Nam chuẩn vị',
      duration: '8:30',
      views: '18.7K',
      likes: 890
    },
    {
      id: 3,
      thumbnail: '/api/placeholder/300/200',
      title: 'Bún Chả Hà Nội đậm đà',
      duration: '15:20',
      views: '32.1K',
      likes: 2100
    },
    {
      id: 4,
      thumbnail: '/api/placeholder/300/200',
      title: 'Chè Ba Màu mát lạnh',
      duration: '10:15',
      views: '12.5K',
      likes: 650
    },
    {
      id: 5,
      thumbnail: '/api/placeholder/300/200',
      title: 'Gỏi Cuốn tôm thịt',
      duration: '6:45',
      views: '22.8K',
      likes: 1180
    },
    {
      id: 6,
      thumbnail: '/api/placeholder/300/200',
      title: 'Cà Ri Gà đậm đà',
      duration: '18:30',
      views: '28.9K',
      likes: 1550
    }
  ];

  const recipes = [
    {
      id: 1,
      image: '/api/placeholder/300/200',
      title: 'Phở Bò Hà Nội',
      difficulty: 'Khó',
      time: '3 giờ',
      rating: 4.8,
      saves: 520
    },
    {
      id: 2,
      image: '/api/placeholder/300/200',
      title: 'Bánh Cuốn Hà Nội',
      difficulty: 'Trung bình',
      time: '1.5 giờ',
      rating: 4.6,
      saves: 340
    },
    {
      id: 3,
      image: '/api/placeholder/300/200',
      title: 'Chả Cá Lã Vọng',
      difficulty: 'Dễ',
      time: '45 phút',
      rating: 4.9,
      saves: 680
    },
    {
      id: 4,
      image: '/api/placeholder/300/200',
      title: 'Nem Nướng Nha Trang',
      difficulty: 'Trung bình',
      time: '2 giờ',
      rating: 4.7,
      saves: 420
    },
    {
      id: 5,
      image: '/api/placeholder/300/200',
      title: 'Bún Bò Huế cay nồng',
      difficulty: 'Khó',
      time: '2.5 giờ',
      rating: 4.9,
      saves: 750
    },
    {
      id: 6,
      image: '/api/placeholder/300/200',
      title: 'Cao Lầu Hội An',
      difficulty: 'Trung bình',
      time: '1 giờ',
      rating: 4.5,
      saves: 380
    }
  ];

  const savedItems = [
    {
      id: 1,
      type: 'video',
      thumbnail: '/api/placeholder/300/200',
      title: 'Cách làm Sushi Nhật Bản',
      author: 'Chef Takeshi',
      duration: '20:15'
    },
    {
      id: 2,
      type: 'recipe',
      image: '/api/placeholder/300/200',
      title: 'Pizza Margherita chuẩn Ý',
      author: 'Maria Rossi',
      time: '30 phút'
    },
    {
      id: 3,
      type: 'video',
      thumbnail: '/api/placeholder/300/200',
      title: 'Dimsum Hồng Kông',
      author: 'Chef Wong',
      duration: '15:45'
    },
    {
      id: 4,
      type: 'recipe',
      image: '/api/placeholder/300/200',
      title: 'Pad Thai truyền thống',
      author: 'Chef Somchai',
      time: '25 phút'
    },
    {
      id: 5,
      type: 'video',
      thumbnail: '/api/placeholder/300/200',
      title: 'Ramen Tonkotsu đậm đà',
      author: 'Chef Yamamoto',
      duration: '25:30'
    },
    {
      id: 6,
      type: 'recipe',
      image: '/api/placeholder/300/200',
      title: 'Croissant Pháp bơ thơm',
      author: 'Chef Pierre',
      time: '4 giờ'
    }
  ];

  return (
    <div className="w-full h-full bg-gray-800 max-h-[90vh] overflow-y-auto rounded-2xl hide-scrollbar">
      {/* Header với nút back */}
      <div className="sticky top-0 z-10 bg-gray-800 shadow-sm px-4 py-3 flex items-center border-b">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back</span>
        </button>
        <h2 className="text-lg font-semibold">Profile</h2>
      </div>
      
      <ProfileHeader userProfile={userProfile} />
      
      <ProfileTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="px-4 py-6">
        {activeTab === 'videos' && (
          <VideoGrid videos={videos} viewMode={viewMode} />
        )}

        {activeTab === 'recipes' && (
          <RecipeGrid recipes={recipes} viewMode={viewMode} />
        )}

        {activeTab === 'saved' && (
          <SavedGrid savedItems={savedItems} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;