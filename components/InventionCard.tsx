
import React from 'react';
import { Link } from 'react-router-dom';
import { Invention } from '../types';
import { generateDeterministicAIData } from '../utils/aiAnalytics';

interface Props {
  invention: Invention;
  onResonate?: (id: string) => void;
}

const InventionCard: React.FC<Props> = ({ invention, onResonate }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Experimental': return 'text-yellow-400 border-yellow-400';
      case 'Prototype': return 'text-blue-400 border-blue-400';
      case 'Stable': return 'text-green-400 border-green-400';
      case 'Classified': return 'text-red-500 border-red-500';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const aiData = generateDeterministicAIData(invention.id, invention.name);

  return (
    <div className="glass-panel p-6 rounded-lg transition-all hover:neon-border group flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <Link to={`/invention/${invention.id}`} className="block flex-1">
            <h3 className="font-orbitron text-xl font-bold neon-text-cyan group-hover:neon-text-purple transition-colors line-clamp-1">
              {invention.name}
            </h3>
          </Link>
          <span className={`text-[10px] border px-2 py-0.5 rounded uppercase font-bold tracking-widest ml-2 ${getStatusColor(invention.status)}`}>
            {invention.status}
          </span>
        </div>
        
        <p className="text-gray-400 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
          {invention.description}
        </p>

        <div className="space-y-3 mb-6">
          <StatBar label="Stability" value={invention.quantumStability} color="bg-cyan-500" />
          <StatBar label="Output" value={invention.energyOutput} color="bg-purple-500" />
          <StatBar label="Sync" value={invention.cyberSync} color="bg-emerald-500" />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {invention.tags.map(tag => (
            <span key={tag} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-mono-tech uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 mt-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase font-mono-tech">AI Confidence</span>
            <span className="text-xs font-bold font-mono-tech text-cyan-400">{aiData.confidence}%</span>
          </div>
          <button 
            onClick={() => onResonate?.(invention.id)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-200 transition-colors"
          >
             <span className="text-xs font-bold">{invention.resonance || 0}</span>
             <span className="text-lg">◈</span>
          </button>
        </div>
        
        <Link 
          to={`/invention/${invention.id}`}
          className="w-full block py-2 text-center text-[10px] font-mono-tech text-cyan-500 border border-cyan-500/20 rounded hover:bg-cyan-500/10 transition-all uppercase tracking-widest"
        >
          [ View_Detailed_Analysis ]
        </Link>
      </div>
    </div>
  );
};

const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div>
    <div className="flex justify-between text-[9px] uppercase font-mono-tech text-gray-500 mb-0.5">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default InventionCard;
