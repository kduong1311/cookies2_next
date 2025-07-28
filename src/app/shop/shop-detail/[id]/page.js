"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ChevronLeft, Star, MapPin, Phone, Mail,
  Store, Package, Search, Grid, List
} from "lucide-react";

import ProductList from "@/components/shop/ProductList";

export default function ShopPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params.id;

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");

  // Load shop + products
  useEffect(() => {
    const loadShopData = async () => {
      try {
        setLoading(true);

        const shopRes = await axios.get(
          `http://103.253.145.7:8080/api/shops/${shopId}`,
          { withCredentials: true }
        );

        const shopResult = shopRes.data;

        if (shopResult.status !== "success") {
          throw new Error("Shop API returned error status");
        }

        const shopData = shopResult.data;
        const formattedShop = {
          id: shopData.shop_id,
          name: shopData.name,
          description: shopData.description,
          avatar: shopData.logo_url || "https://res.cloudinary.com/da9rooi9r/image/upload/v1751130040/Logo_lt0d2t.png",
          cover_image: shopData.cover_photo_url || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop",
          rating: parseFloat(shopData.rating || 0),
          total_reviews: shopData.total_reviews || 0,
          total_products: 0,
          followers: 0,
          address: `${shopData.address || ''}${shopData.city ? ', ' + shopData.city : ''}${shopData.country ? ', ' + shopData.country : ''}${shopData.postal_code ? ' ' + shopData.postal_code : ''}`.trim().replace(/^,\s*/, ''),
          phone: shopData.contact_phone,
          email: shopData.contact_email,
          established_date: shopData.created_at,
          is_verified: shopData.is_verified,
          business_registration: shopData.business_registration,
          status: shopData.status
        };

        const productsRes = await axios.get(
          `http://103.253.145.7:8080/api/products/shop/${shopId}`,
          { withCredentials: true }
        );

        const productsResult = productsRes.data;
        let productsData = [];

        if (productsResult.status === "success") {
          if (productsResult.data?.status === "success" && productsResult.data?.data) {
            productsData = productsResult.data.data;
          } else if (Array.isArray(productsResult.data)) {
            productsData = productsResult.data;
          } else if (Array.isArray(productsResult.data?.products)) {
            productsData = productsResult.data.products;
          }
        }

        formattedShop.total_products = productsData.length;
        setShop(formattedShop);
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        toast.error(`Failed to load shop data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      loadShopData();
    } else {
      toast.error("No shop ID provided");
      setLoading(false);
    }
  }, [shopId]);

  // Get categories
  const getCategories = () => {
    const categories = new Set();
    products.forEach(product => {
      if (product.categories && product.categories.length > 0) {
        product.categories.forEach(cat => categories.add(cat.name));
      }
    });
    return Array.from(categories);
  };

  // Filter + Sort
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product =>
        product.categories && product.categories.some(cat => cat.name === selectedCategory)
      );
    }

    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
        break;
      case "price_high":
        filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
        break;
      case "rating":
        filtered.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      case "name":
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Format for ProductList
  const transformedProducts = filteredProducts.map(product => ({
    id: product.product_id,
    name: product.name,
    price: parseFloat(product.price || 0),
    sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
    image: product.images?.[0]?.image_url || product.images?.[0] || "https://res.cloudinary.com/da9rooi9r/image/upload/v1751130040/Logo_lt0d2t.png",
    rating: parseFloat(product.rating || 0),
    total_reviews: product.total_reviews || 0,
    stock_quantity: product.stock_quantity || 0,
    is_featured: product.is_featured || false,
    categories: product.categories || [],
    slug: product.slug
  }));

  if (loading) {
    return (
      <div className="bg-black-cs text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div>Loading shop...</div>
          <div className="text-sm text-gray-400 mt-2">Shop ID: {shopId}</div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="bg-black-cs text-white min-h-screen px-4 py-6">
        <button onClick={() => router.back()} className="flex items-center mb-6 text-gray-400 hover:text-white">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <div className="text-center py-8 text-red-500">Shop not found</div>
      </div>
    );
  }

  const categories = getCategories();

  return (
    <div className="bg-black-cs text-white min-h-screen">
      {/* Header */}
      <div className="px-4 py-6">
        <button onClick={() => router.back()} className="flex items-center mb-6 text-gray-400 hover:text-white">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Cover */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={shop.cover_image} alt={shop.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 -mt-16 relative z-10">
          <div className="flex-shrink-0">
            <img src={shop.avatar} alt={shop.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black-cs object-cover" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{shop.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm">{shop.rating.toFixed(1)} ({shop.total_reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Package className="w-4 h-4" />
                <span>{shop.total_products} products</span>
              </div>
              {shop.is_verified && (
                <div className="flex items-center gap-1 text-sm text-green-400">
                  <Store className="w-4 h-4" />
                  <span>Verified Shop</span>
                </div>
              )}
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{shop.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
              {shop.address && (
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{shop.address}</span></div>
              )}
              {shop.phone && (
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{shop.phone}</span></div>
              )}
              {shop.email && (
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{shop.email}</span></div>
              )}
              {shop.established_date && (
                <div className="flex items-center gap-2"><Store className="w-4 h-4" /><span>Since {new Date(shop.established_date).getFullYear()}</span></div>
              )}
              {shop.business_registration && (
                <div className="flex items-center gap-2"><Package className="w-4 h-4" /><span>Reg: {shop.business_registration}</span></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 pb-6">
        <div className="border-t border-gray-800 pt-6">
          <h2 className="text-xl font-bold mb-6">Products ({filteredProducts.length})</h2>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="default">Default</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="name">Name A-Z</option>
            </select>

            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {transformedProducts.length > 0 ? (
            <ProductList products={transformedProducts} viewMode={viewMode} />
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No products found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
