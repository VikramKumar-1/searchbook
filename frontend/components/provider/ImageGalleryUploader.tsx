'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Star, Image as ImageIcon, Loader2, Plus, Link as LinkIcon, Sparkles, RefreshCw } from 'lucide-react';
import { convertToWebP } from '@frontend/lib/imageCompressor';

interface ImageGalleryUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxGalleryPhotos?: number;
}

export function ImageGalleryUploader({
  photos = [],
  onChange,
  maxGalleryPhotos = 9,
}: ImageGalleryUploaderProps) {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlTarget, setUrlTarget] = useState<'cover' | 'gallery'>('cover');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const coverPhoto = photos[0] || null;
  const galleryPhotos = photos.slice(1);

  // Upload single cover photo
  const handleUploadCover = async (file: File) => {
    if (!file) return;
    setUploadError('');
    setIsUploadingCover(true);

    try {
      // 1. Convert to HD WebP
      const webpFile = await convertToWebP(file, 1920, 0.88);

      // 2. Upload
      const formData = new FormData();
      formData.append('files', webpFile);

      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!json.success || !json.data?.urls?.[0]) {
        setUploadError(json.error?.message || 'Failed to upload cover photo');
        return;
      }

      const coverUrl = json.data.urls[0];
      // Put cover photo at index 0
      onChange([coverUrl, ...galleryPhotos]);
    } catch {
      setUploadError('Network error uploading cover photo.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Upload multiple gallery photos
  const handleUploadGallery = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadError('');

    const remainingSlots = maxGalleryPhotos - galleryPhotos.length;
    if (remainingSlots <= 0) {
      setUploadError(`You can upload a maximum of ${maxGalleryPhotos} additional gallery photos.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setIsUploadingGallery(true);
    try {
      const webpFiles = await Promise.all(
        filesToUpload.map((f) => convertToWebP(f, 1920, 0.88))
      );

      const formData = new FormData();
      webpFiles.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!json.success) {
        setUploadError(json.error?.message || 'Failed to upload gallery images');
        return;
      }

      const newUrls: string[] = json.data.urls || [];
      if (coverPhoto) {
        onChange([coverPhoto, ...galleryPhotos, ...newUrls]);
      } else {
        // If no cover photo yet, first uploaded image becomes cover
        onChange([...newUrls]);
      }
    } catch {
      setUploadError('Network error uploading gallery photos.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveCover = () => {
    // Remove cover, promote next gallery image or empty
    onChange([...galleryPhotos]);
  };

  const handleRemoveGalleryPhoto = (indexToRemove: number) => {
    const updatedGallery = galleryPhotos.filter((_, i) => i !== indexToRemove);
    if (coverPhoto) {
      onChange([coverPhoto, ...updatedGallery]);
    } else {
      onChange([...updatedGallery]);
    }
  };

  const handleMakeCoverFromGallery = (galleryIndex: number) => {
    const selectedPhoto = galleryPhotos[galleryIndex];
    const restGallery = galleryPhotos.filter((_, i) => i !== galleryIndex);
    if (coverPhoto) {
      onChange([selectedPhoto, coverPhoto, ...restGallery]);
    } else {
      onChange([selectedPhoto, ...restGallery]);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();
    if (urlTarget === 'cover') {
      onChange([url, ...galleryPhotos]);
    } else {
      if (galleryPhotos.length >= maxGalleryPhotos) {
        setUploadError(`Maximum ${maxGalleryPhotos} gallery photos allowed.`);
        return;
      }
      if (coverPhoto) {
        onChange([coverPhoto, ...galleryPhotos, url]);
      } else {
        onChange([url]);
      }
    }
    setUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-6">
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-lg">
          {uploadError}
        </div>
      )}

      {/* ────────────────── SECTION 1: FRONT / COVER PHOTO ────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
              1. Main Front / Card Photo
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              This is the main hero photo that appears on search cards and thumbnail previews.
            </p>
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            Card Cover Photo
          </span>
        </div>

        {/* Cover Photo Display / Uploader Box */}
        {coverPhoto ? (
          <div className="relative rounded-xl overflow-hidden border-2 border-blue-600 aspect-[16/9] sm:aspect-[21/9] max-h-56 bg-gray-100 shadow-sm group">
            <img
              src={coverPhoto}
              alt="Front Cover Photo"
              className="w-full h-full object-cover object-center"
            />

            {/* Overlay Badge */}
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-white" />
              Main Card Cover
            </div>

            {/* Action Bar on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="bg-white text-gray-900 text-xs font-semibold px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Front Photo
              </button>
              <button
                type="button"
                onClick={handleRemoveCover}
                className="bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => coverInputRef.current?.click()}
            className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/30 hover:bg-blue-50/60 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              {isUploadingCover ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <p className="text-xs font-bold text-gray-900">
              {isUploadingCover ? 'Optimizing & Uploading Cover...' : 'Click to Upload Main Front Photo'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Upload the best front angle of your flat, room or service (Auto WebP HD)
            </p>
          </div>
        )}

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleUploadCover(e.target.files[0]);
          }}
        />
      </div>

      {/* ────────────────── SECTION 2: GALLERY PHOTOS ────────────────── */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-gray-700" />
              2. Additional Gallery Photos (Interior, Washroom, Kitchen, Balcony)
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload multiple photos to give customers a complete virtual tour of the property.
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {galleryPhotos.length} / {maxGalleryPhotos} photos
          </span>
        </div>

        {/* Gallery Multi-upload Dropzone */}
        {galleryPhotos.length < maxGalleryPhotos && (
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-100/50 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center"
          >
            <input
              ref={galleryInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleUploadGallery(e.target.files);
              }}
            />
            <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mb-1.5">
              {isUploadingGallery ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </div>
            <p className="text-xs font-semibold text-gray-800">
              {isUploadingGallery ? 'Uploading gallery photos...' : 'Add Gallery Photos (Select Multiple)'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Bedrooms, Kitchen, Living Room, Washroom, Balcony, Amenities
            </p>
          </div>
        )}

        {/* Gallery Grid */}
        {galleryPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {galleryPhotos.map((url, idx) => (
              <div
                key={idx}
                className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-[4/3] shadow-2xs"
              >
                <img
                  src={url}
                  alt={`Gallery photo ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => handleMakeCoverFromGallery(idx)}
                    className="bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Set as Main Front Photo"
                  >
                    Make Front
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryPhoto(idx)}
                    className="p-1.5 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-colors cursor-pointer"
                    title="Delete photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ────────────────── SECTION 3: URL INPUT TOGGLE ────────────────── */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlInput ? 'Hide link uploader' : 'Add image via direct URL link'}
        </button>
      </div>

      {showUrlInput && (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
          <div className="flex gap-2">
            <select
              value={urlTarget}
              onChange={(e) => setUrlTarget(e.target.value as 'cover' | 'gallery')}
              className="px-2.5 py-2 text-xs border border-gray-300 rounded-md bg-white font-medium text-gray-700"
            >
              <option value="cover">Set as Front Photo</option>
              <option value="gallery">Add to Gallery</option>
            </select>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste photo link (e.g. https://images.unsplash.com/...)"
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
