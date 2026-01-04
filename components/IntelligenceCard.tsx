
import React from 'react';
import { IntelligenceReport } from '../types';

interface Props {
  report: IntelligenceReport;
  onPublish?: (id: string) => void;
  onResonate?: (id: string) => void;
}

const IntelligenceCard: React.FC<Props> = ({ report, onPublish, onResonate }) => {
  const getRatingColor = (rating: number) => {
    if (rating > 80) return 'text-emerald-400';
    if (rating > 50) return 'text-cyan-400';
    return 'text-red-400';
  };

  return (
    <div className="glass-panel p-6 rounded-xl border-white/5 hover:border-cyan-500/50 transition-all flex flex-col justify-between group h-full">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-mono-tech text-cyan-500 uppercase tracking-widest">{report.category}</span>
          <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${report.status === 'Published' ? 'border-emerald-500 text-emerald-500' : 'border-yellow-500 text-yellow-500'}`}>
            {report.status}
          </span>
        </div>
        <h3 className="font-orbitron text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {report.title}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-4 leading-relaxed font-light mb-6">
          {report.content}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase font-mono-tech">Security Rating</span>
            <span className={`text-sm font-bold font-mono-tech ${getRatingColor(report.securityRating)}`}>{report.securityRating}%</span>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-gray-500 uppercase font-mono-tech">Resonance</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-white">{report.resonance}</span>
              <button 
                onClick={() => onResonate?.(report.id)}
                className="text-cyan-400 hover:scale-125 transition-transform"
              >
                ◈
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {report.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[8px] bg-white/5 px-2 py-1 rounded text-gray-500 uppercase border border-white/5">{tag}</span>
            ))}
          </div>
          {report.status === 'Draft' && onPublish && (
            <button 
              onClick={() => onPublish(report.id)} 
              className="text-[10px] font-mono-tech text-emerald-400 hover:text-emerald-300 hover:underline uppercase tracking-tighter"
            >
              [ Publish_Asset ]
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceCard;
