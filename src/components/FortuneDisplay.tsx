import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface FortuneDisplayProps {
  fortune: string;
  onReset: () => void;
}

export function FortuneDisplay({ fortune, onReset }: FortuneDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md w-full p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-center"
    >
      <div className="mb-6 flex justify-center">
        <Sparkles className="w-12 h-12 text-amber-400" />
      </div>
      
      <p className="text-2xl font-medium text-white mb-8 italic">
        "{fortune}"
      </p>

      <button
        onClick={onReset}
        className="flex items-center gap-2 mx-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95"
      >
        <RefreshCw className="w-5 h-5" />
        Get Another
      </button>
    </motion.div>
  );
}
