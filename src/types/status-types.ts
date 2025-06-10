// StatusItem type definition
// This interface describes the structure of a status item used in the job tracking application.
export interface StatusItem {
  text: string;
  color: string;
}

// Default status items for initial state
export const defaultStatusItems = new Set<StatusItem>([
  { text: "Applied", color: "bg-blue-500" },
  { text: "Interview", color: "bg-yellow-500" },
  { text: "Rejected", color: "bg-red-500" },
  { text: "Offer", color: "bg-green-500" },
  { text: "Archived", color: "bg-gray-500" }
]);

// Helper function to get status item by text (identifier)
export const getStatusByText = (text: string): StatusItem | undefined => {
  return Array.from(defaultStatusItems).find(item => item.text === text);
};

// Helper function to check if a status exists
export const statusExists = (text: string): boolean => {
  return Array.from(defaultStatusItems).some(item => item.text === text);
};