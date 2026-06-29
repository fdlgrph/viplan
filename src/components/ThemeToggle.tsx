import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeType } from '../types';

interface ThemeToggleProps {
  theme: ThemeType;
  onChange: (theme: ThemeType) => void;
}

export default function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <motion.button
      id="theme-toggle-btn"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange(theme === 'light' ? 'dark' : 'light')}
      className="p-2.5 rounded-xl glass-panel flex items-center justify-center transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer relative"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-amber-500"
          >
            <Sun className="w-6 h-6" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-blue-400"
          >
            <Moon className="w-6 h-6" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
