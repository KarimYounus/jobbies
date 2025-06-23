import React, { useState, useRef } from 'react';
import Icon from '@mdi/react';
import { mdiClose, mdiFileCheck } from '@mdi/js';

interface DropZoneProps {
  onFileDrop: (filePath: string) => void;
  onFileRemove: () => void;
  acceptedFileTypes: string[];
  previewPath?: string | null;
  icon: string;
  className?: string;
  promptText?: string;
  fileTypePrompt?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  onFileDrop,
  onFileRemove,
  acceptedFileTypes,
  previewPath,
  icon,
  className = '',
  promptText = 'Drag & drop a file or click to select',
  fileTypePrompt = 'Any file type',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const filePath = (file as any).path;
      onFileDrop(filePath);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      const isAccepted = acceptedFileTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (isAccepted) {
        const filePath = (file as any).path;
        onFileDrop(filePath);
      } else {
        alert(`Invalid file type. Please drop one of the following: ${acceptedFileTypes.join(', ')}`);
      }
      e.dataTransfer.clearData();
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFileRemove();
  };

  const handleZoneClick = () => {
    // Don't open file dialog if there's already a file,
    // the user should use the remove button first.
    if (!previewPath) {
      inputRef.current?.click();
    }
  };

  const isImage = acceptedFileTypes.includes('image/*');

  return (
    <div
      onClick={handleZoneClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex justify-center rounded-lg border-2 border-dashed px-6 py-10 ${
        isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
      } transition-colors duration-200 ease-in-out ${previewPath ? '' : 'cursor-pointer'} ${className}`}
    >
      {previewPath ? (
        <div className="relative group">
          {isImage ? (
            <img
              src={previewPath}
              alt="File Preview"
              className="h-48 w-auto rounded-md object-cover"
            />
          ) : (
            <div className="h-48 w-full flex flex-col items-center justify-center bg-gray-100 rounded-md p-4">
              <Icon path={mdiFileCheck} size={3} className="text-green-500" />
              <p className="text-sm text-gray-700 mt-2 text-center break-all">{previewPath.split('\\').pop()}</p>
            </div>
          )}
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icon path={mdiClose} size={0.7} />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Icon path={icon} size={2} className="mx-auto text-gray-400" />
          <p className="mt-1 text-sm text-gray-600">{promptText}</p>
          <p className="text-xs text-gray-500">{fileTypePrompt}</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        accept={acceptedFileTypes.join(',')}
        className="hidden"
      />
    </div>
  );
};

export default DropZone;
