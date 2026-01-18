import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = ({ images = [], onChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState(images);

  const handleImageUrlAdd = (url) => {
    if (!url) return;

    if (imageUrls.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }

    const newImages = [...imageUrls, url];
    setImageUrls(newImages);
    onChange(newImages);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (imageUrls.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      // Upload to ImgBB (free image hosting)
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);

          // Using ImgBB API (you can replace with your own backend upload endpoint)
          const response = await fetch(
            'https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY',
            {
              method: 'POST',
              body: formData,
            }
          );

          const data = await response.json();
          if (data.success) {
            return data.data.url;
          }
          throw new Error('Upload failed');
        })
      );

      const newImages = [...imageUrls, ...uploadedUrls];
      setImageUrls(newImages);
      onChange(newImages);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please use image URLs instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Image URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            id="imageUrlInput"
            placeholder="https://example.com/image.jpg"
            className="input-field flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleImageUrlAdd(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const input = document.getElementById('imageUrlInput');
              handleImageUrlAdd(input.value.trim());
              input.value = '';
            }}
            className="btn-primary px-4"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Paste image URL from Imgur, Unsplash, or any direct image link
        </p>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or Upload Images
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading || imageUrls.length >= maxImages}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB ({imageUrls.length}/{maxImages} images)
            </p>
          </label>
        </div>
        <p className="text-xs text-yellow-600 mt-2">
          Note: File upload requires ImgBB API key. Please use image URLs for now.
        </p>
      </div>

      {/* Image Preview Grid */}
      {imageUrls.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images ({imageUrls.length})
          </label>
          <div className="grid grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border-2 border-gray-200"
              >
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}

            {/* Add more placeholder */}
            {imageUrls.length < maxImages && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-xs">Add more</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            First image will be used as primary product image. Drag to reorder (coming soon).
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
