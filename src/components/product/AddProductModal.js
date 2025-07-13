import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Save, 
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

import ProductBasicInfo from "./ProductBasicInfo";
import ProductImages from "./ProductImages";
import ProductVariants from "./ProductVariants";

const AddProductModal = ({ open, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    shop_id: "d1aa87d9-7b59-4a5e-8d18-79b2f682f311" // Hardcoded
  });

  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([
    {
      color: "",
      size: "",
      material: "",
      price: 0,
      image_url: "",
      stock_quantity: 0,
      sku: ""
    }
  ]);

  const steps = [
    { title: "Thông tin cơ bản", component: "basic" },
    { title: "Hình ảnh", component: "images" },
    { title: "Biến thể", component: "variants" }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch("http://103.253.145.7:3003/api/categories");
        const data = await response.json();
        if (data.status === "success") {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setProduct({
        name: "",
        description: "",
        price: 0,
        category_id: "",
        shop_id: "d1aa87d9-7b59-4a5e-8d18-79b2f682f311"
      });
      setImages([]);
      setVariants([
        {
          color: "",
          size: "",
          material: "",
          price: 0,
          image_url: "",
          stock_quantity: 0,
          sku: ""
        }
      ]);
      setSubmitStatus(null);
    }
  }, [open]);

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return product.name.trim() !== "" && product.category_id !== "" && product.price > 0;
      case 1:
        return images.length > 0;
      case 2:
        return variants.length > 0 && variants.every(v => v.price > 0);
      default:
        return true;
    }
  };

  const canProceed = validateStep(currentStep);

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const productData = {
        ...product,
        images,
        variants: variants.map(variant => ({
          ...variant,
          sku: variant.sku || null,
          stock_quantity: variant.stock_quantity || null
        }))
      };

      const response = await fetch("http://103.253.145.7:3003/api/products", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus('success');
        setTimeout(() => {
          onSuccess?.(result.data);
          onClose?.();
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi tạo sản phẩm");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProductBasicInfo
            product={product}
            setProduct={setProduct}
            categories={categories}
            isLoading={loadingCategories}
          />
        );
      case 1:
        return (
          <ProductImages
            images={images}
            setImages={setImages}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        );
      case 2:
        return (
          <ProductVariants
            variants={variants}
            setVariants={setVariants}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
    if (!isOpen) onClose?.();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 text-white overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Thêm sản phẩm mới
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  index === currentStep
                    ? "bg-orange-500 text-white shadow-lg"
                    : index < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-1 bg-gray-600 mx-2 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Nội dung bước hiện tại */}
        <div className="flex-1 overflow-y-auto px-4">
          {renderCurrentStep()}
        </div>

        {/* Trạng thái submit */}
        {submitStatus && (
          <div className={`flex items-center gap-2 mt-4 px-4 py-2 rounded-md mx-4 my-2
            ${submitStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>
              {submitStatus === 'success' ? 'Tạo sản phẩm thành công!' : 'Tạo sản phẩm thất bại. Vui lòng thử lại.'}
            </span>
          </div>
        )}

        {/* Nút điều hướng */}
        <div className="flex justify-between items-center mt-4 px-4 pb-4 border-t border-gray-700 pt-4">
          <button
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
            className="text-sm text-gray-400 hover:text-white disabled:opacity-50"
          >
            ← Quay lại
          </button>

          <div className="flex items-center gap-4">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition 
                  ${canProceed ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
              >
                Tiếp →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 flex items-center gap-2 text-sm font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Xác nhận
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
