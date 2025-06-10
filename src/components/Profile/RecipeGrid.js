import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeGrid = ({ recipes, viewMode }) => {
  return (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;