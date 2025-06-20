import React, { useState } from 'react';
import { CurriculumVitae } from '../../../types/job-application-types';
import EditTextField from './EditTextField';
import EditTextArea from './EditTextArea';

interface CreateNewCVProps {
  onSave: (cv: CurriculumVitae) => void;
  onCancel: () => void;
}

const CreateNewCV: React.FC<CreateNewCVProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [imagePreviewPath, setImagePreviewPath] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const filePath = (file as any).path;
      setImagePreviewPath(filePath);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const filePath = (file as any).path;
      setPdfPath(filePath);
    }
  };

  const handleSave = () => {
    if (!name || !imagePreviewPath) {
      alert('CV Name and Image Preview are required.');
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
      <EditTextField label="CV Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700">CV Image Preview</label>
        <input type="file" onChange={handleImageUpload} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
        {imagePreviewPath && <p className="text-sm text-gray-500 mt-1">Selected: {imagePreviewPath}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">CV PDF (Optional)</label>
        <input type="file" onChange={handlePdfUpload} accept=".pdf" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
        {pdfPath && <p className="text-sm text-gray-500 mt-1">Selected: {pdfPath}</p>}
      </div>

      <EditTextField label="Date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <EditTextArea label="Notes (Optional)" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

      <div className="flex justify-end space-x-3 pt-4">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save CV</button>
      </div>
    </div>
  );
};

export default CreateNewCV;
