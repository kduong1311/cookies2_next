import React from 'react';
import SavedCard from './SaveCard';

const SavedGrid = ({ savedItems, viewMode }) => {
  return (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {savedItems.map((item) => (
        <SavedCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default SavedGrid;