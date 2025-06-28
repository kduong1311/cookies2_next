// components/shop/ProductList.js
import ProductCard from "./ProductCard";

export default function ProductList({ products = [] }) {
  if (!products.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No products available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} data={product} />
      ))}
    </div>
  );
}