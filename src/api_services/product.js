import { Currency } from "lucide-react";

// api_services/product.js
const API_BASE_URL = 'http://103.253.145.7:3003/api';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    console.log("API response:", data);

    // Ở đây data.data là mảng sản phẩm
    const productsArray = Array.isArray(data.data) ? data.data : [];

    return productsArray.map((product) => ({
      id: product.product_id,
      name: product.name,
      price: parseFloat(product.price),
      sale_price: product.sale_price,
      currency: product.currency,
      stock_quantity: product.stock_quantity,
      image:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0].image_url
          : "https://res.cloudinary.com/da9rooi9r/image/upload/v1751081884/d05pk7j6cmrp4x60uynf.png",
      rating: parseFloat(product.rating),
      description: product.description,
      total_sale: product.total_sales,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    console.log(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const jsonResponse = await response.json();
    const product = jsonResponse.data;

    const images = Array.isArray(product.images) && product.images.length > 0
      ? product.images.map(img => img.image_url) // <-- Lấy danh sách image_url
      : ["https://res.cloudinary.com/da9rooi9r/image/upload/v1751081884/d05pk7j6cmrp4x60uynf.png"];

    return {
      id: product.product_id,
      shop_id: product.shop_id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      currency: product.currency,
      stock_quantity: product.stock_quantity,
      rating: product.rating,
      description: product.description,
      total_sale: product.total_sales,
      images: images,
      // ✅ Thêm các trường quan trọng
      variants: product.variants || [],
      categories: product.categories || [],
      slug: product.slug,
      sku: product.sku,
      weight: product.weight,
      weight_unit: product.weight_unit,
      dimensions: product.dimensions,
      condition_status: product.condition_status,
      is_featured: product.is_featured,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const searchProducts = async (query) => {
  const res = await fetch(`http://103.253.145.7:3003/api/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error("Failed to search products");
  }
  const data = await res.json();
  console.log("search:", data)
  return data.data || []; // tuỳ vào cấu trúc trả về
};


