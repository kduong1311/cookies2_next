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
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      currency: product.currency,
      stock_quantity: product.stock_quantity,
      images: images, // <-- Trả về mảng URL
      rating: product.rating,
      description: product.description,
      total_sale: product.total_sales,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

