
import React, { useState, useEffect } from 'react';
import { fetchLatestThreats, CyberThreat } from '../services/geminiService';

const ThreatFeed: React.FC = () => {
  const [threats, setThreats] = useState<CyberThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadThreats = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchLatestThreats();
      setThreats(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreats();
  }, []);

  return (
    <div className="glass-panel border-red-500/20 rounded-2xl p-6 bg-red-500/5 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <h3 className="font-orbitron text-xs font-bold text-red-500 uppercase tracking-widest">Global_Threat_Monitor</h3>
        </div>
        <button 
          onClick={loadThreats}
          disabled={loading}
          className="text-[10px] font-mono-tech text-gray-500 hover:text-red-400 transition-colors uppercase"
        >
          {loading ? 'Scanning...' : '[ Re-Scan ]'}
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="py-10 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
            <span className="text-[10px] font-mono-tech text-red-900/60 uppercase animate-pulse">Syncing with neural net...</span>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <span className="text-xs font-mono-tech text-red-400 uppercase">Uplink Interrupted.</span>
          </div>
        ) : threats.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-xs font-mono-tech text-emerald-400 uppercase">Registry Clear. No active threats.</span>
          </div>
        ) : (
          threats.map((threat, idx) => (
            <div key={idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0 group">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                  threat.severity === 'Critical' ? 'bg-red-500 text-white border-red-500' : 
                  threat.severity === 'High' ? 'border-red-500 text-red-500' : 'border-yellow-500 text-yellow-500'
                }`}>
                  {threat.severity}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors line-clamp-1">
                {threat.title}
              </h4>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-3 line-clamp-2 italic font-light">
                {threat.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {threat.sources.map((source, sIdx) => (
                  <a 
                    key={sIdx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[9px] font-mono-tech text-cyan-600 hover:text-cyan-400 underline uppercase tracking-tighter"
                  >
                    [ Source_{sIdx + 1} ]
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="bg-black/40 p-3 rounded-lg flex items-center justify-between overflow-hidden">
          <div className="text-[9px] font-mono-tech text-red-900 uppercase whitespace-nowrap animate-marquee">
            ESTABLISHING SECURE CONNECTION... PING: 24MS... PACKET LOSS: 0.01%... UPDATING THREAT REGISTRY...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatFeed;
