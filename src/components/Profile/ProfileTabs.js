import React from 'react';
import { Grid3X3, List } from 'lucide-react';

const ProfileTabs = ({ activeTab, setActiveTab, viewMode, setViewMode }) => {
  return (
    <div className="bg-gray-900 border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'border-orange-500 text-orange'
                  : 'border-transparent text-gray-600 hover:text-orange-500'
              }`}
            >
              Posted videos
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'recipes'
                  ? 'border-orange-500 text-orange'
                  : 'border-transparent text-gray-600 hover:text-orange-500'
              }`}
            >
              Posted Recipes
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-orange text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-orange text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;