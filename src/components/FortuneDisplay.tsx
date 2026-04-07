import { motion } from 'motion/react';
import { Sparkles, RefreshCw, ExternalLink } from 'lucide-react';

interface FortuneDisplayProps {
  fortune: string;
  onReset: () => void;
  txHash?: string;
}

export function FortuneDisplay({ fortune, onReset, txHash }: FortuneDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      className="max-w-md w-full p-10 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-amber-500/10 rounded-2xl ring-1 ring-amber-500/20">
            <Sparkles className="w-10 h-10 text-amber-500" />
          </div>
        </div>
        
        <p className="text-3xl font-black text-white mb-10 italic leading-tight tracking-tight">
          "{fortune}"
        </p>

        <div className="space-y-4">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            Get Another
          </button>

          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[10px] text-gray-500 hover:text-amber-500 uppercase tracking-[0.2em] font-bold transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Verified Onchain
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
