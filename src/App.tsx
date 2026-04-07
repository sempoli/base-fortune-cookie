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
  const [pendingFortune, setPendingFortune] = useState<string | null>(null);
  const [isBroken, setIsBroken] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [claimsToday, setClaimsToday] = useState(0);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read claims from contract
  const { data: userCookies, refetch: refetchCookies } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: FORTUNE_COOKIE_ABI,
    functionName: 'getUserCookies',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && (CONTRACT_ADDRESS as string) !== "0x0000000000000000000000000000000000000000",
    }
  });

  useEffect(() => {
    if (userCookies !== undefined) {
      // Count cookies from the last 24 hours
      const now = Math.floor(Date.now() / 1000);
      const dayInSeconds = 24 * 60 * 60;
      const recentCookies = (userCookies as any[]).filter(c => Number(c.timestamp) > now - dayInSeconds);
      setClaimsToday(recentCookies.length);
    }
  }, [userCookies]);

  useEffect(() => {
    if (isConfirmed && pendingFortune) {
      setFortune(pendingFortune);
      setIsBroken(true);
      setIsBreaking(false);
      setPendingFortune(null);
      refetchCookies();
    }
  }, [isConfirmed, pendingFortune, refetchCookies]);

  const handleBreak = async () => {
    if (claimsToday >= 5) {
      return;
    }

    const randomFortune = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];

    if ((CONTRACT_ADDRESS as string) === "0x0000000000000000000000000000000000000000") {
      setIsBreaking(true);
      setTimeout(() => {
        setFortune(randomFortune);
        setIsBroken(true);
        setIsBreaking(false);
        setClaimsToday(prev => prev + 1);
      }, 2000);
      return;
    }

    try {
      setPendingFortune(randomFortune);
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FORTUNE_COOKIE_ABI,
        functionName: 'crackCookie',
        args: [randomFortune],
      } as any);
      setIsBreaking(true);
    } catch (e) {
      console.error(e);
      setIsBreaking(false);
      setPendingFortune(null);
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

      <header className="relative z-10 p-6 flex justify-between items-center max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase italic leading-none">Base Cookie</h1>
            <p className="text-[10px] text-amber-500/60 font-mono uppercase tracking-widest mt-1">Onchain Wisdom</p>
          </div>
        </div>
        
        {isConnected && (
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-gray-400">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <span className="text-[8px] text-green-500 uppercase tracking-widest font-bold">Connected</span>
            </div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto w-full">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center w-full max-w-md"
          >
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 ring-1 ring-amber-500/20">
                  <Wallet className="w-12 h-12 text-amber-500" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tight italic uppercase leading-none">Connect to Base</h2>
                <p className="text-gray-400 text-base mb-10 leading-relaxed">
                  Connect your wallet to claim your daily crypto fortunes. Each prediction is permanently stored on the Base network.
                </p>
                
                <button 
                  onClick={() => config.connectors[0].connect()}
                  className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center space-y-12 w-full">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                {isBroken ? "Your Fortune" : "Daily Cookie"}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                  <span className="text-amber-500 font-mono text-[11px] uppercase tracking-widest font-bold">
                    Claims: {claimsToday} / 5
                  </span>
                </div>
                {isConfirming && (
                  <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                    <span className="text-blue-500 font-mono text-[11px] uppercase tracking-widest font-bold">
                      Mining...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-full flex flex-col items-center">
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
                      disabled={claimsToday >= 5 || isConfirming}
                    />
                    
                    {claimsToday >= 5 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold"
                      >
                        Daily Limit Reached
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <FortuneDisplay 
                    fortune={fortune} 
                    onReset={handleReset} 
                    txHash={hash}
                  />
                )}
              </AnimatePresence>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-400 text-sm w-full max-w-md backdrop-blur-xl"
              >
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="font-medium">
                  {error.message.includes("User rejected") ? "Transaction rejected by user" : "Transaction failed. Please check your balance."}
                </p>
              </motion.div>
            )}

            {/* Recent History Section */}
            {userCookies && (userCookies as any[]).length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-md pt-12 border-t border-white/5"
              >
                <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-6 text-center">Recent Onchain Wisdom</h3>
                <div className="space-y-3">
                  {(userCookies as any[]).slice(-3).reverse().map((cookie, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-xs text-gray-300 italic truncate">"{cookie.prediction}"</p>
                        <p className="text-[8px] text-gray-500 font-mono mt-1 uppercase">
                          {new Date(Number(cookie.timestamp) * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <a 
                        href={`https://basescan.org/address/${CONTRACT_ADDRESS}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-500/20 hover:text-amber-500"
                      >
                        <Sparkles className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
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
