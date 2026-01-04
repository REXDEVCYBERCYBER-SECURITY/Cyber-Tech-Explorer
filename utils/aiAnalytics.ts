
export const generateDeterministicAIData = (id: string, name: string) => {
  const seed = id.length + name.length;
  const confidence = 75 + (seed % 21); // 75-95%
  const possibleMitigations = [
    'Implement Layer-3 Encryption',
    'Deploy Quantum Firewalls',
    'Recalibrate Neural Uplink',
    'Enable Bio-metric Verification',
    'Isolate Sub-atomic Core',
    'Monitor Spectral Leakage',
    'Purge Buffer Overflows',
    'Sync Temporal Oscillators'
  ];
  
  const suggestions = possibleMitigations.slice(seed % 4, (seed % 4) + 3);
  
  return { confidence, suggestions };
};
