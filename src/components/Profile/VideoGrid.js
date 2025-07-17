import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, viewMode }) => {
  return (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {videos.map((video) => (
        <VideoCard key={video.post_id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;