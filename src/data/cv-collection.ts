import { CurriculumVitae } from '../types/job-application-types';

export const cvCollection: CurriculumVitae[] = [
  {
    id: 'cv1',
    name: 'Standard Tech CV',
    imagePreviewPath: 'src/assets/images/cv.png',
    pdfPath: 'src/assets/images/cv.png',
    date: '2025-05-20',
    notes: 'General purpose CV for software engineering roles.'
  },
  {
    id: 'cv2',
    name: 'Design-Focused CV',
    imagePreviewPath: 'src/assets/images/cv.png',
    pdfPath: 'src/assets/images/cv.png',
    date: '2025-06-10',
    notes: 'CV tailored for UI/UX and frontend roles.'
  }
];
