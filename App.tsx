
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { performSecurityAudit, synthesizeIntelligence } from './services/geminiService';
import { Invention, SecurityAudit, SuitUpgrade } from './types';
import InventionCard from './components/InventionCard';
import InventionDetail from './components/InventionDetail';

const STORAGE_KEY = 'quantum_cyber_hub_v3';

const INITIAL_UPGRADES: SuitUpgrade[] = [
  {
    id: 'scanner',
    name: 'Neural Vulnerability Scanner',
    description: 'Enhances AI ability to detect hidden backdoors and exploits.',
    level: 1,
    maxLevel: 10,
    cost: 100,
    benefitLabel: 'Audit Depth',
    icon: '🔍'
  },
  {
    id: 'processor',
    name: 'Quantum Logic Processor',
    description: 'Increases the detail and coherence of synthesized reports.',
    level: 1,
    maxLevel: 10,
    cost: 150,
    benefitLabel: 'Synthesis Speed',
    icon: '💎'
  }
];

type SortOrder = 'none' | 'stability-asc' | 'stability-desc';

const App: React.FC = () => {
  const [inventions, setInventions] = useState<Invention[]>([]);
  const [essence, setEssence] = useState(1000);
  const [upgrades, setUpgrades] = useState<SuitUpgrade[]>(INITIAL_UPGRADES);
  
  // UI State
  const [synthPrompt, setSynthPrompt] = useState('');
  const [synthFormat, setSynthFormat] = useState('Tactical Brief');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [auditTarget, setAuditTarget] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAudit, setLastAudit] = useState<SecurityAudit | null>(null);
  const [stabilitySort, setStabilitySort] = useState<SortOrder>('none');

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setInventions(data.inventions || []);
        setEssence(data.essence ?? 1000);
        setUpgrades(data.upgrades || INITIAL_UPGRADES);
      } catch (e) {
        console.error("Storage corruption detected", e);
      }
    }
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inventions, essence, upgrades }));
  }, [inventions, essence, upgrades]);

  // Sorting Logic
  const sortedInventions = useMemo(() => {
    const list = [...inventions];
    if (stabilitySort === 'stability-asc') {
      return list.sort((a, b) => a.quantumStability - b.quantumStability);
    } else if (stabilitySort === 'stability-desc') {
      return list.sort((a, b) => b.quantumStability - a.quantumStability);
    }
    return list;
  }, [inventions, stabilitySort]);

  const handleSynthesize = async () => {
    if (!synthPrompt) return;
    setIsSynthesizing(true);
    try {
      const result = await synthesizeIntelligence(synthPrompt, synthFormat);
      const newInvention: Invention = {
        id: Math.random().toString(36).substr(2, 9),
        name: result.title || 'Untitled Discovery',
        description: result.content || '',
        category: result.category || 'Classified Tech',
        tags: result.tags || ['CYBER', 'QUANTUM'],
        status: 'Prototype',
        quantumStability: Math.floor(Math.random() * 30) + 60,
        energyOutput: Math.floor(Math.random() * 40) + 50,
        cyberSync: Math.floor(Math.random() * 20) + 70,
        resonance: 0,
        notes: ''
      };
      setInventions([newInvention, ...inventions]);
      setSynthPrompt('');
      window.location.hash = '#/'; // Direct redirect to feed
    } catch (e) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleAudit = async () => {
    if (!auditTarget) return;
    setIsAuditing(true);
    setLastAudit(null);
    try {
      const audit = await performSecurityAudit(auditTarget);
      setLastAudit(audit);
      setEssence(prev => prev + 75);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  const resonateInvention = (id: string) => {
    setInventions(prev => prev.map(inv => inv.id === id ? { ...inv, resonance: (inv.resonance || 0) + 1 } : inv));
  };

  const updateNotes = (id: string, notes: string) => {
    setInventions(prev => prev.map(inv => inv.id === id ? { ...inv, notes } : inv));
  };

  return (
    <Router>
      <div className="min-h-screen grid-bg relative selection:bg-cyan-500/30">
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 shadow-[0_0_15px_rgba(0,243,255,1)]" />
        <div className="fixed -bottom-24 -right-24 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="fixed -top-24 -left-24 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        <header className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-10 h-10 border border-cyan-500/50 bg-cyan-500/10 rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.2)]">
               <span className="font-orbitron font-black text-cyan-400">QS</span>
            </div>
            <div>
              <h1 className="font-orbitron text-xl font-black text-white neon-text-cyan tracking-tighter">CYBER HUB</h1>
              <p className="text-[10px] font-mono-tech text-cyan-600 tracking-[0.2em] uppercase">Intelligence CMS v6.2</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6 md:gap-10 font-mono-tech text-xs">
            <NavLink to="/" className={({isActive}) => `uppercase tracking-widest transition-all ${isActive ? 'text-cyan-400 neon-text-cyan' : 'text-gray-500 hover:text-white'}`}>[ Feed ]</NavLink>
            <NavLink to="/auditor" className={({isActive}) => `uppercase tracking-widest transition-all ${isActive ? 'text-red-400' : 'text-gray-500 hover:text-white'}`}>[ Auditor ]</NavLink>
            <NavLink to="/synthesis" className={({isActive}) => `uppercase tracking-widest transition-all ${isActive ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}>[ Synthesis ]</NavLink>
            <NavLink to="/core" className={({isActive}) => `uppercase tracking-widest transition-all ${isActive ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}>[ Core ]</NavLink>
          </nav>

          <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 px-4 py-2 rounded-full">
            <span className="text-cyan-400 text-xs font-mono-tech animate-pulse">◈</span>
            <span className="text-cyan-100 font-orbitron font-bold text-sm">{essence.toLocaleString()}</span>
          </div>
        </header>

        <main className="container mx-auto px-6 py-10 pb-32">
          <Routes>
            <Route path="/" element={
              <div className="animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h2 className="font-orbitron text-4xl font-black text-white uppercase tracking-tighter italic">Discovery Registry</h2>
                    <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-transparent mt-2" />
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono-tech text-gray-500 uppercase tracking-widest">Protocol: Sort_Order</span>
                    <div className="relative group">
                      <select 
                        value={stabilitySort}
                        onChange={(e) => setStabilitySort(e.target.value as SortOrder)}
                        className="bg-black/60 border border-cyan-500/30 text-cyan-400 font-mono-tech text-[11px] px-4 py-2 rounded uppercase tracking-widest focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer pr-10 hover:bg-cyan-500/10 transition-all shadow-[0_0_10px_rgba(0,243,255,0.05)]"
                      >
                        <option value="none">Stability: Default</option>
                        <option value="stability-asc">Stability: Low &rarr; High</option>
                        <option value="stability-desc">Stability: High &rarr; Low</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500 text-[10px]">▼</div>
                    </div>
                  </div>
                </div>
                
                {sortedInventions.length === 0 ? (
                  <div className="glass-panel p-20 rounded-2xl flex flex-col items-center justify-center text-center border-white/5">
                    <div className="text-4xl mb-4 opacity-10 font-orbitron">NO ASSETS DETECTED</div>
                    <p className="text-gray-600 max-w-sm font-mono-tech uppercase text-xs">The repository is currently empty. Use the Synthesis Lab to manifest new technology.</p>
                    <Link to="/synthesis" className="mt-8 px-6 py-2 border border-purple-500/50 text-purple-400 text-xs font-mono-tech hover:bg-purple-500/10 transition-all uppercase">Initiate Synthesis</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedInventions.map(inv => (
                      <InventionCard key={inv.id} invention={inv} onResonate={resonateInvention} />
                    ))}
                  </div>
                )}
              </div>
            } />

            <Route path="/invention/:id" element={<InventionDetail inventions={inventions} onUpdateNotes={updateNotes} />} />

            <Route path="/auditor" element={
              <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                <div className="glass-panel p-10 rounded-3xl border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.05)]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl text-red-500">🛡️</div>
                    <div>
                      <h2 className="font-orbitron text-3xl font-black text-red-500 uppercase italic">Security Auditor</h2>
                      <p className="text-gray-500 font-mono-tech text-[10px] uppercase tracking-[0.4em]">Advanced Vulnerability Scanning Engine</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <textarea 
                      value={auditTarget}
                      onChange={(e) => setAuditTarget(e.target.value)}
                      placeholder="Input code snippet or tech description for deep-layer scanning..."
                      className="w-full bg-black/60 border border-red-500/20 rounded-2xl p-6 font-mono-tech text-red-100 focus:outline-none focus:border-red-500 transition-all min-h-[160px] text-sm"
                    />
                    <button 
                      onClick={handleAudit}
                      disabled={isAuditing || !auditTarget}
                      className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold uppercase tracking-widest disabled:opacity-20 transition-all flex items-center justify-center gap-3"
                    >
                      {isAuditing ? 'Executing Penetration Test...' : 'Execute Audit'}
                    </button>
                  </div>
                  {lastAudit && (
                    <div className="mt-12 space-y-8 animate-in fade-in zoom-in-95">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <AuditWidget label="Risk" value={lastAudit.riskLevel} />
                         <AuditWidget label="Entropy" value={`${lastAudit.encryptionStrength}%`} />
                         <AuditWidget label="Integrity" value={`${lastAudit.integrityScore}%`} />
                      </div>
                      <div className="space-y-4">
                        {lastAudit.vulnerabilities.map((v, i) => (
                          <div key={i} className="bg-red-500/5 border-l-2 border-red-500 p-6 rounded-r-xl">
                            <div className="text-red-400 font-bold text-xs uppercase mb-2">{v.type}</div>
                            <p className="text-gray-300 text-xs mb-3 leading-relaxed">{v.description}</p>
                            <div className="text-emerald-400/80 text-[10px] font-mono-tech">PROTOCOL: {v.mitigation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            } />

            <Route path="/synthesis" element={
              <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                <div className="glass-panel p-10 rounded-3xl border-purple-500/20">
                  <h2 className="font-orbitron text-3xl font-black text-purple-400 uppercase italic mb-8">Synthesis Lab</h2>
                  <div className="flex flex-wrap gap-4 mb-8">
                    {['Tactical Brief', 'Community Post', 'Technical Whitepaper'].map(format => (
                      <button key={format} onClick={() => setSynthFormat(format)} className={`px-4 py-2 text-[10px] font-mono-tech uppercase border transition-all ${synthFormat === format ? 'border-purple-500 bg-purple-500/20 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}>{format}</button>
                    ))}
                  </div>
                  <textarea 
                    value={synthPrompt}
                    onChange={(e) => setSynthPrompt(e.target.value)}
                    placeholder="Describe core tech concepts for manifestation..."
                    className="w-full bg-black/60 border border-purple-500/20 rounded-2xl p-8 font-mono-tech text-purple-100 min-h-[240px] focus:outline-none focus:border-purple-500 transition-all text-sm mb-10"
                  />
                  <button onClick={handleSynthesize} disabled={isSynthesizing || !synthPrompt} className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white font-orbitron font-bold uppercase tracking-widest disabled:opacity-20 transition-all">
                    {isSynthesizing ? 'Manifesting Intelligence...' : 'Manifest Intel Report'}
                  </button>
                </div>
              </div>
            } />

            <Route path="/core" element={
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="font-orbitron text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">Explorer Core</h2>
                  <p className="text-gray-500 font-mono-tech text-xs uppercase tracking-[0.5em]">Neural Link Enhancement Modules</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {upgrades.map(upgrade => (
                    <div key={upgrade.id} className="glass-panel p-10 rounded-3xl border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between group">
                      <div>
                        <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{upgrade.icon}</div>
                        <h3 className="font-orbitron text-2xl font-bold text-white mb-4">{upgrade.name}</h3>
                        <p className="text-gray-400 text-sm mb-8">{upgrade.description}</p>
                        <div className="flex justify-between items-end mb-3">
                          <span className="text-[10px] font-mono-tech text-emerald-400 uppercase font-bold tracking-widest">Lvl {upgrade.level}</span>
                          <span className="text-[10px] font-mono-tech text-gray-500 uppercase">{upgrade.benefitLabel}</span>
                        </div>
                        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 mb-10">
                          <div className="h-full bg-emerald-500" style={{ width: `${(upgrade.level/upgrade.maxLevel)*100}%` }} />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (essence >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
                            setEssence(prev => prev - upgrade.cost);
                            setUpgrades(prev => prev.map(u => u.id === upgrade.id ? {...u, level: u.level + 1, cost: Math.floor(u.cost * 1.6)} : u));
                          }
                        }}
                        disabled={essence < upgrade.cost || upgrade.level >= upgrade.maxLevel}
                        className="w-full py-4 border border-emerald-500/50 text-emerald-400 font-mono-tech text-sm uppercase hover:bg-emerald-500/20 transition-all disabled:opacity-10 rounded-xl"
                      >
                        {upgrade.level >= upgrade.maxLevel ? 'MAXIMIZED' : `Initialize Upgrade: ${upgrade.cost}◈`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            } />
          </Routes>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 glass-panel border-t border-cyan-500/20 px-6 py-3 flex justify-between items-center text-[9px] font-mono-tech text-gray-500 z-50">
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> CORE_SYNC_READY</span>
            <span className="hidden sm:inline">NODES: 1024</span>
            <span className="hidden sm:inline">ASSETS: {inventions.length}</span>
          </div>
          <div className="flex gap-6 items-center">
            <span className="text-cyan-600/60 uppercase">Quantum-Super CMS</span>
            <button 
              onClick={() => { if (window.confirm("RESET ALL HUB DATA?")) { localStorage.removeItem(STORAGE_KEY); window.location.reload(); } }}
              className="text-red-900/40 hover:text-red-600 transition-colors uppercase border-l border-white/5 pl-6"
            >Purge Core</button>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const AuditWidget = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-black/50 p-6 border border-red-500/20 rounded-2xl text-center">
    <div className="text-[10px] text-gray-500 font-mono-tech uppercase mb-2">{label}</div>
    <div className="text-xl font-black text-white">{value}</div>
  </div>
);

export default App;
