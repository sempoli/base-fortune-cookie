/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { config } from './lib/web3';
import { Cookie } from './components/Cookie';
import { FortuneDisplay } from './components/FortuneDisplay';
import { PREDICTIONS, FORTUNE_COOKIE_ABI, CONTRACT_ADDRESS } from './constants';
import { Sparkles, Wallet, AlertCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { base } from 'wagmi/chains';

const queryClient = new QueryClient();

function FortuneApp() {
  const { address, isConnected } = useAccount();
  const [fortune, setFortune] = useState<string | null>(null);
  const [isBroken, setIsBroken] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [claimsToday, setClaimsToday] = useState(0);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read claims from contract
  const { data: contractClaims, refetch: refetchClaims } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: FORTUNE_COOKIE_ABI,
    functionName: 'getClaimsToday',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    }
  });

  useEffect(() => {
    if (contractClaims !== undefined) {
      setClaimsToday(Number(contractClaims));
    }
  }, [contractClaims]);

  useEffect(() => {
    if (isConfirmed) {
      const randomFortune = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];
      setFortune(randomFortune);
      setIsBroken(true);
      setIsBreaking(false);
      refetchClaims();
    }
  }, [isConfirmed, refetchClaims]);

  const handleBreak = async () => {
    if (claimsToday >= 5) {
      alert("You've reached your daily limit of 5 fortunes!");
      return;
    }

    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setIsBreaking(true);
      setTimeout(() => {
        const randomFortune = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];
        setFortune(randomFortune);
        setIsBroken(true);
        setIsBreaking(false);
        setClaimsToday(prev => prev + 1);
      }, 2000);
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FORTUNE_COOKIE_ABI,
        functionName: 'claimFortune',
      } as any);
      setIsBreaking(true);
    } catch (e) {
      console.error(e);
      setIsBreaking(false);
    }
  };

  const handleReset = () => {
    setFortune(null);
    setIsBroken(false);
    setIsBreaking(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-amber-500 selection:text-black flex flex-col">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 p-4 flex justify-between items-center max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 rounded-lg shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-lg font-black tracking-tight uppercase italic">Base Cookie</h1>
        </div>
        
        {isConnected && (
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-gray-400">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center w-full"
          >
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
              <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-3xl font-black mb-3 tracking-tight italic uppercase">Connect to Base</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Connect your Coinbase Wallet to claim your daily crypto fortunes on the Base network.
              </p>
              
              <button 
                onClick={() => config.connectors[0].connect()}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
              >
                Connect Wallet
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center space-y-10 w-full">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                {isBroken ? "Your Fortune" : "Daily Cookie"}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <span className="text-amber-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                  Claims: {claimsToday} / 5
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!fortune ? (
                <motion.div
                  key="cookie-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  <Cookie
                    onBreak={handleBreak}
                    isBreaking={isBreaking || isConfirming}
                    isBroken={isBroken}
                    disabled={claimsToday >= 5}
                  />
                  {claimsToday >= 5 && (
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                      Limit Reached. Come back tomorrow!
                    </div>
                  )}
                </motion.div>
              ) : (
                <FortuneDisplay fortune={fortune} onReset={handleReset} />
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs w-full"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-medium">
                  {error.message.includes("User rejected") ? "Transaction rejected" : "Something went wrong. Check your balance."}
                </p>
              </motion.div>
            )}

            {isConfirming && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                  <span className="text-amber-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                    Mining on Base...
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Please wait a few seconds</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="relative z-10 p-6 text-center">
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-medium">
          Powered by Base • Built for Coinbase Wallet
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={base} apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}>
          <FortuneApp />
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
