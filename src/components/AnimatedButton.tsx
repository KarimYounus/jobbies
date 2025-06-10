import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Icon from "@mdi/react";

interface AnimatedButtonProps {
    icon: string;
    onClick: () => void;
    caption: string;
    className?: string;
    captionPosition?: "left" | "right";
    disabled?: boolean;
    iconClassName?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    icon,
    onClick,
    caption,
    className = "p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer",
    captionPosition = "left",
    disabled = false,
    iconClassName = "text-gray-600",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        layout
        onClick={onClick}
        className={`${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
        whileHover={{ scale: 1.5, rotate: 360 }}
      >
        <Icon path={icon} size={1} className={`${iconClassName}`} />
      </motion.button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{
              opacity: 0,
              x: captionPosition === "left" ? 10 : -10,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: captionPosition === "left" ? 10 : -10,
              scale: 0.8,
            }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`absolute top-1/2 transform -translate-y-1/2 z-10 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none ${
              captionPosition === "left" ? "right-full mr-2" : "left-full ml-2"
            }`}
          >
            {caption}

            {/* Arrow pointing to button */}
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 w-0 h-0 ${
                captionPosition === "left"
                  ? "left-full border-l-4 border-l-gray-800 border-t-2 border-b-2 border-t-transparent border-b-transparent"
                  : "right-full border-r-4 border-r-gray-800 border-t-2 border-b-2 border-t-transparent border-b-transparent"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedButton;
