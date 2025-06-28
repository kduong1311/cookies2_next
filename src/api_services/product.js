import { Currency } from "lucide-react";

// api_services/product.js
const API_BASE_URL = 'http://103.253.145.7:3003/api';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      currency: product.currency,
      stock_quantity: product.stock_quantity,
      image: Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : "https://res.cloudinary.com/da9rooi9r/image/upload/v1751081884/d05pk7j6cmrp4x60uynf.png",
      rating: product.rating,
      description: product.description,
      total_sale: product.total_sale,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const product = await response.json();
    
    // Transform single product data
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      currency: product.currency,
      stock_quantity: product.stock_quantity,
      image: Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : "/default-image.jpg",
      rating: product.rating,
      description: product.description,
      total_sale: product.total_sale
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};