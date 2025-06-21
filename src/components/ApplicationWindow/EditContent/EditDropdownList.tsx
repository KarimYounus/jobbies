import React from "react";
import { motion } from "framer-motion";

interface EditDropdownListProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onSelect: (option: string) => void;
}

const EditDropdownList: React.FC<EditDropdownListProps> = ({
  label,
  name,
  value,
  options,
  onSelect,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div>
      <h3 className="text-lg font-semibold text-black">{label}</h3>
      <motion.select
        className="mt-1 block w-full px-3 py-2 bg-white text-black rounded-md shadow-sm outline-none focus:shadow-lg sm:text-sm"
        name={name}
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          borderColor: isFocused ? "#34a0a4" : "#d1d5db", // Gray 300
          borderWidth: isFocused ? "4px" : "1px",
        }}
        transition={{ duration: 0.2 }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </motion.select>
    </div>
  );
};
export default EditDropdownList;
