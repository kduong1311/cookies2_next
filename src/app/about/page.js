"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChefHat, Users, ShoppingCart, Play, Heart, Star, Award, Clock, Camera,
  MessageCircle, Mail, Phone, MapPin, Facebook, Instagram, Youtube
} from 'lucide-react';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('story');
  const router = useRouter();

  const stats = [
    { icon: Users, label: 'Community', value: '50K+', color: 'text-orange-500' },
    { icon: Play, label: 'Recipe Videos', value: '1,200+', color: 'text-green-500' },
    { icon: ShoppingCart, label: 'Products', value: '300+', color: 'text-blue-500' },
    { icon: Heart, label: 'Favorites', value: '100K+', color: 'text-red-500' }
  ];

  const features = [
    {
      icon: Camera,
      title: 'Video HD chất lượng cao',
      description: 'Mỗi video được quay với chất lượng 4K, góc quay đa dạng để bạn dễ dàng theo dõi từng bước nấu ăn'
    },
    {
      icon: ChefHat,
      title: 'Công thức chi tiết',
      description: 'Từng nguyên liệu, gia vị và thời gian nấu đều được ghi chú rõ ràng, dễ hiểu cho người mới bắt đầu'
    },
    {
      icon: MessageCircle,
      title: 'Cộng đồng tương tác',
      description: 'Chia sẻ thành quả, trao đổi kinh nghiệm và nhận feedback từ cộng đồng yêu thích nấu ăn'
    },
    {
      icon: Award,
      title: 'Đầu bếp chuyên nghiệp',
      description: 'Đội ngũ đầu bếp có kinh nghiệm nhiều năm trong ngành, am hiểu ẩm thực Việt và quốc tế'
    }
  ];

  const achievements = [
    { year: '2020', title: 'Khởi đầu hành trình', desc: 'Ra mắt kênh với 10 video đầu tiên' },
    { year: '2021', title: 'Cột mốc đầu tiên', desc: 'Đạt 10,000 subscribers và mở shop đầu tiên' },
    { year: '2022', title: 'Mở rộng quy mô', desc: 'Hợp tác với 50+ thương hiệu uy tín' },
    { year: '2023', title: 'Giải thưởng danh giá', desc: 'Top 10 kênh ẩm thực được yêu thích nhất' },
    { year: '2024', title: 'Cộng đồng lớn mạnh', desc: 'Cộng đồng 50K+ thành viên tích cực' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 bg-gray-800 overflow-y-auto hide-scrollbar h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 rounded-3xl p-8 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
        
        <div className="relative text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-orange">Cook Together</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Nơi kết nối những người yêu thích nấu ăn, chia sẻ công thức độc đáo và khám phá thế giới ẩm thực đầy màu sắc
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group">
            <div className="text-center">
              <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-4 rounded-2xl">
          {[
            { id: 'story', label: 'Our Story', icon: Heart },
            { id: 'features', label: 'Features', icon: Star },
            { id: 'timeline', label: 'Journey', icon: Clock },
            { id: 'contact', label: 'Contact', icon: Mail }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-orange text-white shadow-lg' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="mb-8">
        {activeTab === 'story' && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-lg mb-6">
                Bắt đầu từ niềm đam mê nấu ăn và mong muốn chia sẻ những công thức gia truyền, chúng tôi đã tạo ra một không gian 
                trực tuyến ấm áp nơi mọi người có thể học hỏi, chia sẻ và cùng nhau khám phá thế giới ẩm thực.
              </p>
              <p className="text-lg mb-6">
                Từ những video đầu tiên được quay trong căn bếp nhỏ, chúng tôi đã phát triển thành một cộng đồng lớn với hàng nghìn 
                công thức từ khắp nơi trên thế giới. Mỗi video không chỉ là cách nấu món ăn mà còn là câu chuyện về văn hóa, 
                truyền thống và tình yêu thương.
              </p>
              <p className="text-lg">
                Chúng tôi tin rằng nấu ăn là ngôn ngữ của tình yêu, và mỗi bữa ăn là cơ hội để kết nối với những người thân yêu. 
                Hãy cùng chúng tôi biến mỗi bữa ăn thành một kỷ niệm đáng nhớ!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group">
                <div className={`w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors`}>
                  <feature.icon className="w-6 h-6 text-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Hành trình phát triển</h2>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    {achievement.year}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Kết nối với chúng tôi</h2>
            
            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">contact@cooktogether.vn</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <p className="text-gray-600">+84 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Địa chỉ</p>
                      <p className="text-gray-600">123 Đường Ẩm Thực, Quận 1, TP.HCM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Giờ hoạt động</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thứ 2 - Thứ 6</span>
                    <span className="font-medium text-gray-800">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium text-gray-800">9:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-gray-800">10:00 - 16:00</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Chúng tôi luôn sẵn sàng trả lời câu hỏi về công thức nấu ăn và sản phẩm!
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Theo dõi chúng tôi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
                    <a href="#" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group hover:scale-105">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-500 transition-colors">
                        <Facebook className="w-6 h-6 text-blue-500 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                    <span className="text-xs text-gray-500">45K followers</span>
                    </a>
                    <a href="#" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group hover:scale-105">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-pink-500 transition-colors">
                        <Instagram className="w-6 h-6 text-pink-500 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Instagram</span>
                    <span className="text-xs text-gray-500">32K followers</span>
                    </a>
                    <a href="#" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group hover:scale-105">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-red-500 transition-colors">
                        <Youtube className="w-6 h-6 text-red-500 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">YouTube</span>
                    <span className="text-xs text-gray-500">28K subscribers</span>
                    </a>
                </div>
                </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Tham gia cộng đồng ngay hôm nay!</h2>
        <p className="text-xl mb-6 opacity-90">
          Discover thousands of unique recipes and connect with fellow cooking enthusiasts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Xem video mới nhất
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
          onClick={() => {router.push("/shop")}}>
            <ShoppingCart className="w-5 h-5" />
            Khám phá shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
