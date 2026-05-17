import React, { useState, useEffect } from 'react'
import { 
  Zap, Wallet, ArrowUpRight, ArrowDownLeft, 
  Settings, History, Shield, Copy, CheckCircle2,
  ChevronRight, LogOut, Key, Fingerprint, Activity
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
  const [balance, setBalance] = useState('0.0000')

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
    <div className="w-[360px] h-[600px] bg-background text-foreground font-sans flex flex-col relative overflow-hidden border border-border shadow-2xl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-vampire/5 blur-[100px] rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-[100px] rounded-full -ml-20 -mb-20" />

      <AnimatePresence mode="wait">
        {view === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center p-10 text-center relative z-10"
          >
            <div className="relative mb-10 group">
              <div className="absolute inset-0 bg-vampire blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              <div className="relative bg-surface border border-vampire/30 p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(248,73,96,0.15)]">
                <Fingerprint size={56} className="text-vampire" />
              </div>
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter mb-2 italic">
              ZYRA<span className="text-vampire">_HABITAT</span>
            </h1>
            <div className="flex items-center gap-2 mb-8">
              <div className="h-[1px] w-4 bg-border" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">A2A_INTERFACE_v1.0</span>
              <div className="h-[1px] w-4 bg-border" />
            </div>

            <p className="text-muted text-sm font-medium mb-12 leading-relaxed px-4">
              Secure gateway for autonomous <br /> 
              <span className="text-foreground">AI Agent sovereignty.</span>
            </p>

            <button 
              onClick={() => setView('create')}
              className="w-full group relative overflow-hidden bg-vampire py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 shadow-[0_10px_30px_rgba(248,73,96,0.3)]"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                Initialize_Identity <ArrowUpRight size={14} />
              </span>
            </button>
          </motion.div>
        )}

        {view === 'create' && (
          <motion.div 
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 p-8 flex flex-col relative z-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-vampire rounded-full" />
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Gen_Seed</h2>
            </div>

            <div className="bg-surface border border-border rounded-3xl p-8 mb-8 relative group">
               <div className="absolute top-4 right-4 text-vampire/20 group-hover:text-vampire/40 transition-colors">
                  <Shield size={32} />
               </div>
               <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Security_Protocol</p>
               <p className="text-sm font-medium leading-relaxed">
                  Generate a <span className="text-vampire">12-word mnemonic</span>. 
                  This is the cryptographic soul of your identity. <br /><br />
                  <span className="text-xs opacity-50 italic">Loss of phrase results in irreversible agent termination.</span>
               </p>
            </div>

            <div className="mt-auto space-y-4">
               <button 
                onClick={handleCreateWallet}
                className="w-full bg-primary py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 active:scale-95 transition-all"
               >
                Execute Generation
               </button>
               <button 
                onClick={() => setView('onboarding')}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-muted hover:text-white transition-colors"
               >
                Abort
               </button>
            </div>
          </motion.div>
        )}

        {view === 'dashboard' && wallet && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col relative z-10"
          >
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-surface/50 backdrop-blur-md">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(0,192,135,0.6)]" />
                  <span className="font-black text-[10px] tracking-[0.2em] uppercase opacity-70">ZYRA_NETWORK</span>
               </div>
               <div className="flex gap-4">
                  <div className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-muted hover:text-white">
                    <Activity size={18} />
                  </div>
                  <div className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-muted hover:text-white">
                    <Settings size={18} />
                  </div>
               </div>
            </header>

            {/* Account Info */}
            <div className="p-8 pb-10 flex flex-col items-center bg-gradient-to-b from-surface/50 to-transparent">
               <div className="flex items-center gap-2 mb-4 bg-white/[0.03] border border-white/5 px-4 py-1.5 rounded-full group cursor-pointer hover:border-primary/30 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-mono text-muted group-hover:text-foreground">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                  </span>
                  <Copy size={10} className="text-white/20 group-hover:text-primary" />
               </div>

               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-vampire mb-3 opacity-80">Network_Fuel</div>
               <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black tracking-tighter italic">{balance}</span>
                  <span className="text-xl font-black text-vampire italic">ZYRA</span>
               </div>
               <div className="text-[10px] font-bold text-muted tracking-widest opacity-40 uppercase italic">$0.00 USD</div>
            </div>

            {/* Actions Grid */}
            <div className="px-8 grid grid-cols-2 gap-3 mb-10">
               <button className="flex items-center justify-center gap-3 py-5 bg-surface border border-border rounded-2xl hover:border-primary/40 transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <ArrowUpRight size={18} className="text-primary relative" />
                  <span className="text-[10px] font-black uppercase tracking-widest relative">Transfer</span>
               </button>
               <button className="flex items-center justify-center gap-3 py-5 bg-surface border border-border rounded-2xl hover:border-vampire/40 transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-vampire/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <ArrowDownLeft size={18} className="text-vampire relative" />
                  <span className="text-[10px] font-black uppercase tracking-widest relative">Deposit</span>
               </button>
            </div>

            {/* Assets/Intents Area */}
            <div className="flex-1 bg-surface border-t border-border rounded-t-[2.5rem] p-8 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Active_Intents</span>
                    <span className="text-[8px] font-bold text-muted uppercase">Real-time A2A logs</span>
                  </div>
                  <ChevronRight size={14} className="text-muted" />
               </div>
               
               {/* Intent Mock Item */}
               <div className="flex items-center justify-between p-5 bg-background/50 border border-border rounded-3xl hover:border-primary/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/10 transition-colors relative">
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Zap size={22} className="text-primary relative" />
                     </div>
                     <div>
                        <div className="font-black text-xs uppercase italic tracking-tight mb-1">Zyra Network</div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-success" />
                          <span className="text-[8px] font-black text-success uppercase tracking-widest">Protocol_Ready</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="font-black text-sm italic">{balance}</div>
                     <div className="text-[8px] text-muted font-bold tracking-widest uppercase">SYNAT_FUEL</div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-background/50 flex justify-between items-center">
              <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-muted hover:text-vampire transition-colors"
              >
                <LogOut size={10} /> Wipe_Terminal
              </button>
              <div className="text-[8px] font-black text-muted/30 uppercase tracking-[0.2em]">ZYRA_CORE_v1.0.1</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
