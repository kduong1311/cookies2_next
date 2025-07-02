"use client";
import { useState } from 'react';
import { Search, Eye, Heart, ChefHat, Clock, Play, X, Loader2 } from 'lucide-react';
import ModalVideoPlayer from '@/components/video/modalVideoPlayer';
import InlineLoading from '@/components/LoadingInline';

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState("");

  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`http://103.253.145.7:3001/api/posts/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.status === "success") {
        setResults(data.data || []);
      } else {
        setError("Không thể tìm kiếm. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSearchResults(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Auto search khi user gõ (debounce)
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        fetchSearchResults(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header với Search Bar */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm món ăn, công thức..."
                value={query}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-full border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-white placeholder-gray-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Loading State */}
        {loading && (
  <div className="flex justify-center items-center py-12 space-x-3">
    <InlineLoading />
    <span className="text-gray-400">Đang tìm kiếm...</span>
  </div>
)}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => fetchSearchResults(query)}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 mb-2">Không tìm thấy kết quả cho: {query}</p>
            <p className="text-gray-500 text-sm">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Tìm thấy {results.length} kết quả cho: {query}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((video) => (
                <div
                  key={video.post_id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden">
                    {/* Video Thumbnail */}
                    <video 
                      src={video.media[0]?.url} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      muted
                      preload="metadata"
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="text-white" size={32} />
                    </div>

                    {/* Duration Badge */}
                    {video.cooking_time > 0 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        <Clock size={10} className="inline mr-1" />
                        {video.cooking_time}m
                      </div>
                    )}

                    {/* Stats Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            <span>{video.views_count || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <Heart size={12} className="mr-1" />
                            <span>{video.likes_count || 0}</span>
                          </div>
                        </div>
                        {video.has_recipe && (
                          <ChefHat size={12} className="text-orange-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="mt-2 space-y-1">
                    <h3 className="text-white text-sm font-medium line-clamp-2 leading-tight">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-1">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Default State */}
        {!query && !loading && (
          <div className="text-center py-16">
            <Search className="mx-auto mb-4 text-gray-600" size={64} />
            <h2 className="text-xl font-semibold mb-2">Tìm kiếm món ăn yêu thích</h2>
            <p className="text-gray-400">Nhập tên món ăn hoặc công thức để bắt đầu tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Modal Video Player */}
      {selectedVideo && (
        <ModalVideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}