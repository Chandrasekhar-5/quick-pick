import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
}

export default function ToggleButton({ isOn, onToggle, label }: ToggleButtonProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <button
        onClick={onToggle}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
          isOn ? "bg-emerald-500" : "bg-gray-300"
        )}
      >
        <motion.div
          animate={{ x: isOn ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
