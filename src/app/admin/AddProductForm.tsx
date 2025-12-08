"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      setImageUrl(data.url);
      setImagePreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload file
      handleImageUpload(file);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category"),
      imageUrl: imageUrl || formData.get("imageUrlManual"), // Use uploaded image or manual URL
      stockQuantity: parseInt(formData.get("stockQuantity") as string),
      season: formData.get("season"),
      features: (formData.get("features") as string)
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      // Reset form safely
      if (formRef.current) {
        formRef.current.reset();
      }
      setImageUrl("");
      setImagePreview("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 lg:space-y-8 bg-white/80 p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-amber-100 max-w-3xl mx-auto"
    >
      {error && (
        <div className="rounded-md bg-red-50 p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="text-xs sm:text-sm text-red-700">{error}</div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 sm:mb-4 relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-40 sm:h-48 object-cover rounded-lg border-2 border-amber-200"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setImageUrl("");
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 sm:p-2 hover:bg-red-600 transition shadow-lg"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* File Upload */}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-amber-300 border-dashed rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100 transition">
              <div className="flex flex-col items-center justify-center pt-4 pb-5 sm:pt-5 sm:pb-6">
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-amber-600"></div>
                ) : (
                  <>
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-1 text-xs sm:text-sm text-amber-700 font-semibold">
                      Click to upload image
                    </p>
                    <p className="text-[10px] sm:text-xs text-amber-600">PNG, JPG, or WebP (MAX. 5MB)</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={uploadingImage}
              />
            </label>
          </div>

          {/* Or enter URL manually */}
          <div className="mt-3 sm:mt-4">
            <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-2">Or enter image URL manually</p>
            <input
              type="url"
              name="imageUrlManual"
              className="w-full rounded-lg border border-gray-300 shadow focus:border-amber-500 focus:ring-amber-500 px-3 sm:px-4 py-2 text-xs sm:text-sm"
              placeholder="https://your-image-url.com/image.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Price (£)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            step="0.01"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            placeholder="0.00"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            placeholder="e.g., Hardwood, Kindling"
          />
        </div>
        <div>
          <label htmlFor="stockQuantity" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            id="stockQuantity"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            placeholder="0"
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="season" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Season
          </label>
          <select
            name="season"
            id="season"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
          >
            <option value="all-season">All Season</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            required
            className="w-full rounded-lg border border-gray-300 shadow focus:border-amber-500 focus:ring-amber-500 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base resize-none transition-all duration-150"
            placeholder="Describe the product, features, and benefits..."
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="features" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Features (comma-separated)
          </label>
          <input
            type="text"
            name="features"
            id="features"
            required
            className="w-full rounded-lg border border-gray-300 shadow focus:border-amber-500 focus:ring-amber-500 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-all duration-150"
            placeholder="e.g. Kiln-dried, Ready to burn, Heat-treated"
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg text-base sm:text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Adding Product...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Product
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}