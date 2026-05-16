import React, { useState, useEffect } from 'react'
import { 
  Zap, Wallet, ArrowUpRight, ArrowDownLeft, 
  Settings, History, Shield, Copy, CheckCircle2,
  ChevronRight, LogOut, Key
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mnemonicGenerate, cryptoWaitReady } from '@polkadot/util-crypto'
import { Keyring } from '@polkadot/keyring'

// --- Storage Helper ---
const saveWallet = (seed: string, address: string) => {
  localStorage.setItem('zyra_seed', seed)
  localStorage.setItem('zyra_address', address)
}

const getWallet = () => {
  const seed = localStorage.getItem('zyra_seed')
  const address = localStorage.getItem('zyra_address')
  return seed && address ? { seed, address } : null
}

const App = () => {
  const [wallet, setWallet] = useState<{ seed: string, address: string } | null>(null)
  const [view, setView] = useState<'onboarding' | 'dashboard' | 'create'>('onboarding')
  const [balance, setBalance] = useState('0.00')

  useEffect(() => {
    const saved = getWallet()
    if (saved) {
      setWallet(saved)
      setView('dashboard')
    }
  }, [])

  const handleCreateWallet = async () => {
    await cryptoWaitReady()
    const mnemonic = mnemonicGenerate()
    const keyring = new Keyring({ type: 'sr25519' })
    const pair = keyring.addFromUri(mnemonic)
    
    const newWallet = { seed: mnemonic, address: pair.address }
    setWallet(newWallet)
    saveWallet(mnemonic, pair.address)
    setView('dashboard')
  }

  return (
    <div className="w-[360px] h-[600px] bg-background text-white flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan/10 blur-3xl rounded-full" />

      <AnimatePresence mode="wait">
        {view === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="bg-gradient-to-br from-primary to-secondary p-5 rounded-[2rem] mb-10 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <Zap size={48} fill="white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-4 italic uppercase">ZYRA<span className="text-primary">CHAIN</span></h1>
            <p className="text-muted text-sm font-medium mb-12 leading-relaxed">
              Your sovereign gateway to the <br /> agentic economy.
            </p>
            <button 
              onClick={() => setView('create')}
              className="w-full bg-primary py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </motion.div>
        )}

        {view === 'create' && (
          <motion.div 
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 p-8"
          >
            <h2 className="text-2xl font-black italic mb-6">Create_Wallet</h2>
            <div className="bg-surface border border-white/5 rounded-3xl p-6 mb-8">
               <Shield className="text-primary mb-4" size={32} />
               <p className="text-sm font-medium text-muted leading-relaxed">
                  We will generate a 12-word recovery phrase. This phrase is the only way to recover your wallet.
               </p>
            </div>
            <button 
              onClick={handleCreateWallet}
              className="w-full bg-primary py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] mt-auto"
            >
              Generate Seed Phrase
            </button>
          </motion.div>
        )}

        {view === 'dashboard' && wallet && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <header className="p-6 flex items-center justify-between border-b border-white/5">
               <div className="flex items-center gap-2 italic">
                  <Zap size={16} className="text-primary" />
                  <span className="font-black text-xs tracking-tighter uppercase">Zyra_Mainnet</span>
               </div>
               <div className="flex gap-4 opacity-50">
                  <History size={18} className="hover:text-white cursor-pointer" />
                  <Settings size={18} className="hover:text-white cursor-pointer" />
               </div>
            </header>

            {/* Account Info */}
            <div className="p-8 flex flex-col items-center">
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Total_Balance</div>
               <div className="text-5xl font-black tracking-tighter mb-4 italic">
                  {balance} <span className="text-primary text-2xl not-italic">ZYRA</span>
               </div>
               <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                  <span className="text-[10px] font-mono text-muted group-hover:text-white">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}
                  </span>
                  <Copy size={12} className="text-white/20 group-hover:text-primary" />
               </div>
            </div>

            {/* Actions */}
            <div className="px-8 grid grid-cols-2 gap-4 mb-10">
               <button className="flex flex-col items-center gap-3 p-6 bg-surface border border-white/5 rounded-[2rem] hover:border-primary/50 transition-all group">
                  <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform">
                     <ArrowUpRight size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Send</span>
               </button>
               <button className="flex flex-col items-center gap-3 p-6 bg-surface border border-white/5 rounded-[2rem] hover:border-cyan/50 transition-all group">
                  <div className="p-3 bg-cyan/20 rounded-xl text-cyan group-hover:scale-110 transition-transform">
                     <ArrowDownLeft size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Receive</span>
               </button>
            </div>

            {/* Assets List */}
            <div className="flex-1 bg-surface/30 rounded-t-[3rem] border-t border-white/5 p-8">
               <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Active_Assets</span>
                  <ChevronRight size={14} className="text-white/20" />
               </div>
               
               <div className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                        <Zap size={24} className="text-primary" />
                     </div>
                     <div>
                        <div className="font-black text-sm uppercase italic tracking-tight">Zyra Token</div>
                        <div className="text-[10px] text-muted font-bold tracking-widest">ZYRA_NETWORK</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="font-black italic">{balance}</div>
                     <div className="text-[10px] text-success font-bold tracking-widest">STABLE</div>
                  </div>
               </div>
            </div>

            {/* Bottom Logout for Demo */}
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="p-4 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/10 hover:text-red-500 transition-colors"
            >
              <LogOut size={12} /> Wipe Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
