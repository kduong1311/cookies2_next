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
      title: 'High-Quality HD Videos',
      description: 'Each video is filmed in 4K with multiple angles so you can follow every cooking step easily.'
    },
    {
      icon: ChefHat,
      title: 'Detailed Recipes',
      description: 'Each ingredient, seasoning, and cooking time is clearly noted—perfect for beginners.'
    },
    {
      icon: MessageCircle,
      title: 'Interactive Community',
      description: 'Share your results, exchange experiences, and get feedback from fellow food lovers.'
    },
    {
      icon: Award,
      title: 'Professional Chefs',
      description: 'Our chefs are experienced in both Vietnamese and international cuisine.'
    }
  ];

  const achievements = [
    { year: '2020', title: 'Our Beginning', desc: 'Launched our first 10 cooking videos' },
    { year: '2021', title: 'First Milestone', desc: 'Reached 10,000 subscribers and opened our first shop' },
    { year: '2022', title: 'Scaling Up', desc: 'Partnered with over 50 trusted brands' },
    { year: '2023', title: 'Awards & Recognition', desc: 'Top 10 most loved cooking channels' },
    { year: '2024', title: 'Thriving Community', desc: 'Over 50K active members' }
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
            A space where food lovers connect, share unique recipes, and explore a colorful world of cuisine.
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
                Started with a passion for cooking and a desire to share family recipes, we built a warm online space for learning, sharing, and discovering culinary wonders.
              </p>
              <p className="text-lg mb-6">
                From our first videos filmed in a cozy kitchen, we’ve grown into a large community with thousands of global recipes. Each video tells a story about culture, tradition, and love.
              </p>
              <p className="text-lg">
                We believe cooking is a language of love, and every meal is a chance to connect. Let’s turn every dish into a memorable moment together!
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
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Journey</h2>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Get in Touch</h2>
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
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600">123 Culinary Street, District 1, Ho Chi Minh City</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Opening Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mon - Fri</span>
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
                    💡 We are happy to answer any questions about recipes or our products!!
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Follow Us</h3>
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
        <h2 className="text-3xl font-bold mb-4">Join our community today!</h2>
        <p className="text-xl mb-6 opacity-90">
          Discover thousands of unique recipes and connect with fellow cooking enthusiasts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Watch Latest Video
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
          onClick={() => {router.push("/shop")}}>
            <ShoppingCart className="w-5 h-5" />
            Visit Our Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
