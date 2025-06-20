import { useRef, useState } from 'react';
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';
import React from 'react';

interface ImageUploadProps {
  label: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  type?: 'avatar' | 'logo' | 'cover';
  disabled?: boolean;
}

const ImageUpload = ({ label, onChange, className = '', type = 'avatar', disabled = false }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return false;
    }

    if (file.size > maxSize) {
      alert('Image size should be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File | null) => {
    if (file && validateFile(file)) {
      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else if (!file) {
      setPreview(null);
      onChange(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getUploadAreaClasses = () => {
    const baseClasses = `
      relative border-2 border-dashed rounded-lg overflow-hidden
      transition-all duration-300 cursor-pointer group
    `;

    const sizeClasses = type === 'cover' ? 'h-32 w-full' : 'h-24 w-24 mx-auto';

    const stateClasses = preview ? 'border-solid border-primary/50' : isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50';

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${sizeClasses} ${stateClasses} ${disabledClasses}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="block text-sm font-medium text-foreground">{label}</Label>

      <div
        className={getUploadAreaClasses()}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <>
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={e => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            {isDragging ? <Upload className="w-6 h-6 mb-1" /> : <ImageIcon className="w-6 h-6 mb-1" />}
            <span className="text-xs text-center px-2">{isDragging ? 'Drop image here' : 'Click to upload'}</span>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" disabled={disabled} />

      <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
    </div>
  );
};

export default ImageUpload;
