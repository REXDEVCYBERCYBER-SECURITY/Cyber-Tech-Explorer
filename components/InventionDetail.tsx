
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Invention } from '../types';
import { generateDeterministicAIData } from '../utils/aiAnalytics';

interface Props {
  inventions: Invention[];
  onUpdateNotes: (id: string, notes: string) => void;
}

const InventionDetail: React.FC<Props> = ({ inventions, onUpdateNotes }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invention = inventions.find(inv => inv.id === id);
  const [notes, setNotes] = useState(invention?.notes || '');

  useEffect(() => {
    if (!invention) {
      navigate('/');
    } else {
      setNotes(invention.notes || '');
    }
  }, [invention, id, navigate]);

  if (!invention) return null;

  const aiData = generateDeterministicAIData(invention.id, invention.name);

  const handleSaveNotes = () => {
    onUpdateNotes(invention.id, notes);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <Link to="/" className="text-gray-500 hover:text-cyan-400 font-mono-tech text-xs uppercase tracking-widest flex items-center gap-2">
          &lt; Return to Registry
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Pane: Core Details */}
        <div className="space-y-10">
          <div className="glass-panel p-8 rounded-2xl border-cyan-500/20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-mono-tech text-cyan-500 uppercase px-3 py-1 border border-cyan-500/30 rounded-full">{invention.category}</span>
              <span className={`text-[10px] font-mono-tech px-3 py-1 border rounded-full uppercase font-bold ${
                invention.status === 'Classified' ? 'border-red-500 text-red-500' : 'border-cyan-500 text-cyan-400'
              }`}>{invention.status}</span>
            </div>
            
            <h1 className="font-orbitron text-5xl font-black text-white neon-text-cyan mb-6 leading-tight uppercase italic tracking-tighter">
              {invention.name}
            </h1>
            
            <p className="text-gray-300 text-lg font-light leading-relaxed mb-8 italic">
              "{invention.description}"
            </p>

            <div className="flex flex-wrap gap-2">
              {invention.tags.map(tag => (
                <span key={tag} className="text-xs bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded text-cyan-300 font-mono-tech uppercase">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border-white/5 space-y-6">
            <h3 className="font-orbitron text-xs font-bold text-gray-500 uppercase tracking-widest">Spectral Diagnostics</h3>
            <DetailStat label="Quantum Stability" value={invention.quantumStability} color="bg-cyan-500" />
            <DetailStat label="Energy Output" value={invention.energyOutput} color="bg-purple-500" />
            <DetailStat label="Cybernetic Synchronization" value={invention.cyberSync} color="bg-emerald-500" />
          </div>
        </div>

        {/* Right Pane: AI & Research */}
        <div className="space-y-10">
          <div className="glass-panel p-8 rounded-2xl border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <h3 className="font-orbitron text-xs font-bold text-purple-400 uppercase tracking-widest">AI Tactical Analysis</h3>
            </div>

            <div className="flex justify-between items-center mb-6 bg-black/40 p-4 rounded-xl border border-purple-500/10">
              <span className="text-xs font-mono-tech text-gray-400">Heuristic Confidence Level</span>
              <span className="text-xl font-black text-purple-400 font-mono-tech">{aiData.confidence}%</span>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] text-gray-500 uppercase font-mono-tech tracking-widest">Recommended Mitigation Protocols</h4>
              <div className="grid grid-cols-1 gap-3">
                {aiData.suggestions.map((s, i) => (
                  <div key={i} className="bg-black/30 border-l-2 border-purple-500 p-4 rounded-r-lg text-sm text-purple-200/80 font-mono-tech flex items-center gap-4">
                    <span className="text-purple-500 font-bold">EX-{i+1}</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="font-orbitron text-xs font-bold text-emerald-400 uppercase tracking-widest">Researcher Field Notes</h3>
            </div>
            
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Input field research observations, anomaly reports, or resonance data..."
              className="w-full bg-black/50 border border-emerald-500/20 rounded-xl p-6 font-mono-tech text-emerald-100 text-sm focus:outline-none focus:border-emerald-500/60 min-h-[180px] transition-all mb-4 placeholder:text-emerald-900/40"
            />
            
            <button 
              onClick={handleSaveNotes}
              className="w-full py-3 bg-emerald-600/10 border border-emerald-600/40 text-emerald-400 font-mono-tech text-xs uppercase tracking-[0.3em] hover:bg-emerald-600/20 transition-all rounded-lg"
            >
              [ Sync_Notes_to_Core ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailStat = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div>
    <div className="flex justify-between text-xs uppercase font-mono-tech text-gray-400 mb-2">
      <span>{label}</span>
      <span className="font-bold text-white">{value}%</span>
    </div>
    <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.1)]`} 
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default InventionDetail;
