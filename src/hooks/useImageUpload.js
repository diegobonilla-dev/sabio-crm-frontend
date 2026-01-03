"use client";

import { useState } from 'react';

// En desarrollo, apuntar al Image Service local (puerto 3002)
const IMAGE_SERVICE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3002'
  : (process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL || 'http://fowokk8sockwkso4swcso0w4.31.97.215.37.sslip.io');

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadSingleImage = async (file, category = 'diagnosticos') => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Validaciones
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10 MB

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no permitido. Solo JPEG, PNG, GIF o WEBP.');
      }

      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 10 MB.');
      }

      // Crear FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', category); // El Image Service espera 'folder', no 'category'

      // Upload usando fetch directo (evita conflicto con baseURL de axiosInstance)
      const token = localStorage.getItem('token');

      const response = await fetch(`${IMAGE_SERVICE_URL}/upload`, {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.NODE_ENV === 'development'
            ? 'local-dev-key-change-in-production'
            : process.env.NEXT_PUBLIC_IMAGE_SERVICE_API_KEY,
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      setUploading(false);
      setProgress(100);
      return data.data; // { url, thumbnail, small, ... }
    } catch (err) {
      setUploading(false);
      setProgress(0);
      const errorMessage = err.response?.data?.message || err.message || 'Error al subir imagen';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const reset = () => {
    setUploading(false);
    setError(null);
    setProgress(0);
  };

  return {
    uploadSingleImage,
    uploading,
    error,
    progress,
    reset
  };
};
