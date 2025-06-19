import React from "react";
import { motion } from "framer-motion";

interface EditTextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditTextArea: React.FC<EditTextAreaProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div>
      <h3 className="text-lg font-semibold text-black">{label}</h3>
      <motion.textarea
        transition={{ delay: 0.4, duration: 0.2 }}
        animate={{
            borderColor: isFocused ? "#34a0a4" : "#d1d5db", // Gray 300
        }}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => {
            setIsFocused(true);
        }}
        onBlur={() => {
            setIsFocused(false);
        }}
        rows={8}
        className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default EditTextArea;
