import React, { useState } from "react";
import { CurriculumVitae } from "../../../../types/job-application-types";
import EditTextField from "../EditTextField";
import EditTextArea from "../EditTextArea";
import AnimatedButton from "../../../General/AnimatedButton";
import { mdiCloseCircle, mdiTextBoxCheck, mdiImage, mdiFilePdfBox } from "@mdi/js";
import DropZone from "../../../General/DropZone";

interface CreateNewCVProps {
  onSave: (cv: CurriculumVitae) => void;
  onCancel: () => void;
}

const CreateNewCV: React.FC<CreateNewCVProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [imagePreviewPath, setImagePreviewPath] = useState("");
  const [pdfPath, setPdfPath] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!name || !imagePreviewPath) {
      alert("CV Name and Image Preview are required.");
      return;
    }
    const newCV: CurriculumVitae = {
      id: `cv_${Date.now()}`,
      name,
      imagePreviewPath,
      pdfPath: pdfPath || undefined,
      date,
      notes: notes || undefined,
    };
    onSave(newCV);
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
        </label>
        <DropZone
          onFileDrop={setImagePreviewPath}
          onFileRemove={() => setImagePreviewPath("")}
          acceptedFileTypes={["image/*"]}
          previewPath={imagePreviewPath}
          icon={mdiImage}
          promptText="Drag & drop an image or click to select"
          fileTypePrompt="PNG, JPG, GIF"
          className="mt-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          CV PDF (Optional)
        </label>
        <DropZone
          onFileDrop={setPdfPath}
          onFileRemove={() => setPdfPath("")}
          acceptedFileTypes={["application/pdf"]}
          previewPath={pdfPath}
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
          />
          <AnimatedButton
            onClick={handleSave}
            className="bg-green-200 text-white px-4 py-2 rounded-lg hover:bg-green-300 transition-colors"
            caption="Save CV"
            icon={mdiTextBoxCheck}
          />
      </div>
    </div>
  );
};

export default CreateNewCV;
