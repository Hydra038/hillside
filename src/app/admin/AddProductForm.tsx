"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      imageUrl: formData.get("imageUrl"),
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

      event.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white/80 p-8 rounded-2xl shadow-lg border border-amber-100 max-w-3xl mx-auto"
    >
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 flex flex-col items-center">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Product Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            id="imageUrl"
            required
            className="w-2/3 rounded-lg border border-gray-300 shadow focus:border-amber-500 focus:ring-amber-500 px-4 py-2 text-sm transition-all duration-150 mb-2"
            placeholder="https://your-image-url.com/image.jpg"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (£)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            id="stockQuantity"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="season" className="block text-sm font-medium text-gray-700">
            Season
          </label>
          <select
            name="season"
            id="season"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          >
            <option value="all-season">All Season</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
          </select>
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            required
            className="w-2/3 rounded-lg border border-gray-300 shadow focus:border-amber-500 focus:ring-amber-500 px-4 py-2 text-sm resize-none bg-amber-50 transition-all duration-150"
            placeholder="Describe the product, features, and benefits..."
          />
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <label htmlFor="features" className="block text-sm font-medium text-gray-700">
            Features (comma-separated)
          </label>
          <input
            type="text"
            name="features"
            id="features"
            required
            className="w-2/3 rounded-lg border border-gray-300 shadow focus:border-amber-500 focus:ring-amber-500 px-4 py-2 text-sm transition-all duration-150 mb-2"
            placeholder="e.g. Kiln-dried, Ready to burn"
          />
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-2/3 flex justify-center py-3 px-6 rounded-full shadow-lg text-base font-bold text-white bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Adding Product...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Product
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}