"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";

export default function ImageUploadPreview({
  label,
  value,
  onChange,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp",
  maxSizeMB = 10,
  disabled = false,
  id,
  error
}) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`El archivo es demasiado grande. Máximo ${maxSizeMB} MB.`);
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}

      {!preview ? (
        <div className="relative">
          <Input
            id={id}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            className="cursor-pointer"
          />
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Upload className="h-3 w-3" />
            <span>Máximo {maxSizeMB}MB - JPEG, PNG, GIF, WEBP</span>
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50">
          <div className="relative w-full h-40">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded"
            />
          </div>
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
            <ImageIcon className="h-3 w-3" />
            <span>
              {value instanceof File ? value.name : 'Imagen cargada'}
            </span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
