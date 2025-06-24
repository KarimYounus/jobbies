import { useState, useEffect } from "react";

/**
 * Custom hook to convert CV image paths to browser-accessible data URLs.
 * Handles the conversion from file system paths to base64 data URLs via Electron IPC.
 */
export const useCVImageUrl = (imagePath?: string): string | null => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imagePath) {
      setImageUrl(null);
      return;
    }

    // If it's already a data URL or web URL, use it directly
    if (imagePath.startsWith("data:") || imagePath.startsWith("http")) {
      setImageUrl(imagePath);
      return;
    }

    // If it's a legacy path (e.g., 'src/assets/images/cv.png'), handle it
    if (imagePath.startsWith("src/")) {
      // For legacy paths, construct the public path
      setImageUrl(`/${imagePath}`);
      return;
    }

    // For CV assets paths, convert via Electron IPC
    const loadImageUrl = async () => {
      setIsLoading(true);
      try {
        if (window.electronAPI) {
          const dataUrl = await window.electronAPI.getCVImageUrl(imagePath);
          setImageUrl(dataUrl);
        } else {
          // Fallback for web environment (development)
          console.warn(
            "Electron API not available, using path directly:",
            imagePath
          );
          setImageUrl(imagePath);
        }
      } catch (error) {
        console.error("Failed to load CV image:", error);
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadImageUrl();
  }, [imagePath]);

  return isLoading ? null : imageUrl;
};
