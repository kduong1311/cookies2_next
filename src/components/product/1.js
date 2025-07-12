"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader,
  DollarSign,
  Palette,
  Ruler,
  Settings,
  X,
} from "lucide-react";

export default function AddProductModal({ open, onOpenChange, shopId, onSuccess }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("color", color);
    formData.append("size", size);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const res = await fetch(
        `http://103.253.145.7:3000/api/shops/${shopId}/products`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      if (onSuccess) onSuccess(data.data);
      onOpenChange(false);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-gray-900 text-white overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-400">
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <button onClick={() => onOpenChange(false)} className="text-white hover:text-gray-300">
            <X />
          </button>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-500 mb-4">
            <CheckCircle className="w-5 h-5" />
            Product created successfully!
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm mb-1 block">Product Name</label>
              <Input
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Price</label>
              <Input
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Quantity</label>
              <Input
                placeholder="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Color</label>
              <Input
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Size</label>
              <Input
                placeholder="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Category</label>
              <Input
                placeholder="e.g. IT, comic, commerce"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-1 block">Description</label>
            <Textarea
              placeholder="Product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">Image</label>
            <Input type="file" onChange={handleImageChange} accept="image/*" />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-4 w-full max-h-64 object-cover rounded-md"
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin w-5 h-5" />
                Creating...
              </span>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
