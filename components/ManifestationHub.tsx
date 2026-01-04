
import React, { useState } from 'react';
import { generateInventionVisual } from '../services/geminiService';
import { Invention } from '../types';

interface Props {
  onManifest: (invention: Invention) => void;
}

const ManifestationHub: React.FC<Props> = ({ onManifest }) => {
  const [prompt, setPrompt] = useState('');
  const [isManifesting, setIsManifesting] = useState(false);
  const [lastVisual, setLastVisual] = useState<string | null>(null);

  const handleManifest = async () => {
    if (!prompt) return;
    setIsManifesting(true);
    try {
      const imageUrl = await generateInventionVisual(prompt);
      setLastVisual(imageUrl);
      
      const newInvention: Invention = {
        id: Math.random().toString(36).substr(2, 9),
        name: `Manifestation: ${prompt.split(' ').slice(0, 3).join(' ')}...`,
        description: `Visual manifestation based on neural prompt: "${prompt}"`,
        category: 'Visual Asset',
        tags: ['MANIFESTED', 'VISUAL', 'QUANTUM'],
        status: 'Prototype',
        quantumStability: 85,
        energyOutput: 70,
        cyberSync: 90,
        resonance: 0,
        imageUrl: imageUrl,
        notes: ''
      };
      onManifest(newInvention);
    } catch (err) {
      console.error(err);
    } finally {
      setIsManifesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="glass-panel p-10 rounded-3xl border-cyan-500/20 shadow-[0_0_50px_rgba(0,243,255,0.05)]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl text-cyan-500">🌌</div>
          <div>
            <h2 className="font-orbitron text-3xl font-black text-cyan-400 uppercase italic">Manifestation Hub</h2>
            <p className="text-gray-500 font-mono-tech text-[10px] uppercase tracking-[0.4em]">Molecular Visual Assembly Interface</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6 flex flex-col items-center">
            <div className="relative w-full">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the physical appearance of the quantum tech..."
                className="w-full bg-black/60 border border-cyan-500/20 rounded-2xl p-6 font-mono-tech text-cyan-100 min-h-[200px] focus:outline-none focus:border-cyan-500 transition-all text-sm"
              />
              <div className="absolute bottom-4 right-4 text-[8px] font-mono-tech text-cyan-900 uppercase">
                Neural_Link_Active
              </div>
            </div>
            
            <div className="w-full flex justify-center mt-6">
              <button 
                onClick={handleManifest} 
                disabled={isManifesting || !prompt} 
                className="quantum-btn w-full"
              >
                {isManifesting ? 'Manifesting...' : 'Initiate Manifestation'}
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className={`aspect-square rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center transition-all ${isManifesting ? 'animate-pulse scale-95' : ''}`}>
              {isManifesting ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-b-2 border-cyan-500 rounded-full animate-spin mx-auto" />
                  <div className="text-[10px] font-mono-tech text-cyan-600 uppercase tracking-widest animate-pulse">Scanning Neural Image...</div>
                </div>
              ) : lastVisual ? (
                <img src={lastVisual} alt="Manifestation result" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-10 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-xs font-mono-tech uppercase">Awaiting Neural Signal</p>
                </div>
              )}
            </div>
            {lastVisual && !isManifesting && (
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-3 py-1.5 rounded-lg">
                <div className="text-[8px] font-mono-tech text-cyan-500 uppercase tracking-tighter">Sync_Complete: 99.4%</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManifestationHub;
