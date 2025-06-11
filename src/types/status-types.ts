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

// Available colors for status items - centralized color management
export const statusColors = [
  "bg-blue-500",
  "bg-yellow-500", 
  "bg-red-500",
  "bg-green-500",
  "bg-gray-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500"
] as const;

// Helper function to get color display name
export const getColorDisplayName = (colorClass: string): string => {
  const colorMap: Record<string, string> = {
    "bg-blue-500": "Blue",
    "bg-yellow-500": "Yellow",
    "bg-red-500": "Red", 
    "bg-green-500": "Green",
    "bg-gray-500": "Gray",
    "bg-purple-500": "Purple",
    "bg-indigo-500": "Indigo",
    "bg-pink-500": "Pink",
    "bg-orange-500": "Orange",
    "bg-teal-500": "Teal"
  };
  return colorMap[colorClass] || "Unknown";
};