import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Cookie as CookieIcon, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface CookieProps {
  onBreak: () => void;
  isBreaking: boolean;
  isBroken: boolean;
  disabled?: boolean;
}

export function Cookie({ onBreak, isBreaking, isBroken, disabled }: CookieProps) {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <AnimatePresence mode="wait">
        {!isBroken ? (
          <motion.button
            key="cookie"
            onClick={onBreak}
            disabled={disabled || isBreaking}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isBreaking ? {
              rotate: [0, -5, 5, -5, 5, 0],
              scale: [1, 1.1, 1],
              transition: { duration: 0.5, repeat: Infinity }
            } : {}}
            className={cn(
              "relative z-10 p-8 rounded-full bg-amber-100 border-4 border-amber-300 shadow-xl transition-colors",
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-50 cursor-pointer"
            )}
          >
            <CookieIcon className="w-24 h-24 text-amber-600" />
            {isBreaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-32 h-32 text-amber-400 animate-pulse" />
              </motion.div>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="broken"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4"
          >
            <motion.div
              animate={{ x: -40, rotate: -20 }}
              className="p-6 rounded-l-full bg-amber-100 border-4 border-amber-300 border-r-0"
            >
              <CookieIcon className="w-16 h-16 text-amber-600" />
            </motion.div>
            <motion.div
              animate={{ x: 40, rotate: 20 }}
              className="p-6 rounded-r-full bg-amber-100 border-4 border-amber-300 border-l-0"
            >
              <CookieIcon className="w-16 h-16 text-amber-600" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
