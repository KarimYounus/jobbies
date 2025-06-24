import React, { useState, useEffect } from "react";
import { CurriculumVitae } from "../../../../types/job-application-types";
import EditTextField from "../EditTextField";
import EditTextArea from "../EditTextArea";
import AnimatedButton from "../../../General/AnimatedButton";
import {
  mdiCloseCircle,
  mdiTextBoxCheck,
  mdiImage,
  mdiFilePdfBox,
} from "@mdi/js";
import DropZone from "../../../General/DropZone";
import { cvHandler } from "../../../../data/CVHandler";

interface CreateNewCVProps {
  onSave: (cv: CurriculumVitae) => void;
  onCancel: () => void;
}

const CreateNewCV: React.FC<CreateNewCVProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageFileDrop = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  const handleImageFileRemove = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const handlePdfFileDrop = (file: File) => {
    setPdfFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPdfPreviewUrl(previewUrl);
  };

  const handlePdfFileRemove = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    setPdfFile(null);
    setPdfPreviewUrl(null);
  };

  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [imagePreviewUrl, pdfPreviewUrl]);
  const handleSave = async () => {
    if (!name || !imageFile) {
      alert("CV Name and Image Preview are required.");
      return;
    }

    setIsLoading(true);
    try {
      const cvData: Omit<CurriculumVitae, "imagePreviewPath" | "pdfPath"> = {
        id: `cv_${Date.now()}`,
        name,
        date,
        notes: notes || undefined,
      };

      const newCV = await cvHandler.createCVWithFiles(
        cvData,
        imageFile,
        pdfFile || undefined
      );
      onSave(newCV);
    } catch (error) {
      console.error("Failed to create CV:", error);
      alert("Failed to create CV. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Create New CV</h3>
      <EditTextField
        label="CV Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          CV Image Preview
        </label>{" "}
        <DropZone
          onFileDrop={handleImageFileDrop}
          onFileRemove={handleImageFileRemove}
          acceptedFileTypes={["image/*"]}
          previewUrl={imagePreviewUrl}
          icon={mdiImage}
          promptText="Drag & drop an image or click to select"
          fileTypePrompt="PNG, JPG, GIF"
          className="mt-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          CV PDF (Optional)
        </label>{" "}
        <DropZone
          onFileDrop={handlePdfFileDrop}
          onFileRemove={handlePdfFileRemove}
          acceptedFileTypes={["application/pdf"]}
          previewUrl={pdfPreviewUrl}
          icon={mdiFilePdfBox}
          promptText="Drag & drop a PDF or click to select"
          fileTypePrompt="PDF only"
          className="mt-2 py-4"
        />
      </div>

      <EditTextField
        label="Date"
        name="date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <EditTextArea
        label="Notes (Optional)"
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <AnimatedButton
          onClick={onCancel}
          className="bg-red-200 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition-colors"
          caption="Cancel"
          icon={mdiCloseCircle}
        />{" "}
        <AnimatedButton
          onClick={handleSave}
          className="bg-green-200 text-white px-4 py-2 rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50"
          caption={isLoading ? "Saving..." : "Save CV"}
          icon={mdiTextBoxCheck}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateNewCV;
