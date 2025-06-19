import React from "react";
import { motion } from "framer-motion";

interface EditTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const EditTextField: React.FC<EditTextFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div>
      <h3 className="text-lg font-semibold text-black">{label}</h3>
      <motion.input
        transition={{ delay: 0.4, duration: 0.2 }}
        animate={{
            borderColor: isFocused ? "#34a0a4" : "#d1d5db", // Gray 300
        }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => {
            setIsFocused(true);
        }}
        onBlur={() => {
            setIsFocused(false);
        }}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-100 text-black rounded-md shadow-sm focus:outline-none focus:shadow-lg sm:text-sm"
      />
    </div>
  );
};

export default EditTextField;
