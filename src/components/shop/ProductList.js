import ProductCard from "./ProductCard";
import { fetchPost } from "@/api_services/test_post";

const products = [
  { id: 1, name: "Pig drinking cup", price: 150000, rating: 3.4, sell: 4000, image: "/CookingImage/195cd62e37e6246c35b3190d17b1f6f8.jpg" },
  { id: 2, name: "Glass kettle", price: 250000, rating: 3.4, sell: 4000, image: "/CookingImage/am.jpg" },
  { id: 3, name: "Electric stove", price: 150000, rating: 3.4, sell: 4000, image: "/CookingImage/bep.jpg" },
  { id: 4, name: "Japanese knife", price: 250000, rating: 3.4, sell: 4000, image: "/CookingImage/knife.jpg" },
  { id: 5, name: "Kitchen knife set", price: 150000, rating: 3.4, sell: 4000, image: "/CookingImage/knifeCollection.jpg" },
  { id: 6, name: "Ladle set", price: 250000, rating: 3.4, sell: 4000, image: "/CookingImage/muoi.png" },
  { id: 7, name: "Pan", price: 150000, rating: 3.4, sell: 4000, image: "/CookingImage/pan.jpg" },
  { id: 8, name: "Stainless Steel Pot", price: 250000, rating: 3.4, sell: 4000, image: "/CookingImage/xo.png" },
];

export default function ProductList({ onProductClick, posts}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {posts.slice(0,10).map((post) => (
        <div
          key={post.id}
          onClick={() => onProductClick(post.id)}
          className="cursor-pointer"
        >
          <ProductCard data={post} />
        </div>
      ))}
    </div>
  );
}
