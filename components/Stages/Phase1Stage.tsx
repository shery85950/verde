import React, { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface Phase1StageProps {
  onComplete: () => void;
}

const TOTAL_STEPS = 16;
// Divergence happens at step 10
const DIVERGENCE_POINT = 10;

const Phase1Stage: React.FC<Phase1StageProps> = ({ onComplete }) => {
  const [range, setRange] = useState<[number, number]>([0, TOTAL_STEPS]);
  const [history, setHistory] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const [found, setFound] = useState(false);

  const midpoint = Math.floor((range[0] + range[1]) / 2);

  const handleBisect = () => {
    if (checking || found) return;
    setChecking(true);

    // Simulate network delay for referee check
    setTimeout(() => {
      const isMatch = midpoint < DIVERGENCE_POINT;
      
      setHistory(prev => [
        ...prev, 
        `Referee checked Step ${midpoint}: ${isMatch ? 'MATCH ✅' : 'MISMATCH ❌'}`
      ]);

      if (isMatch) {
        // Divergence is in the right half
        setRange([midpoint, range[1]]);
      } else {
        // Divergence is in the left half (or at midpoint)
        setRange([range[0], midpoint]);
      }
      setChecking(false);
    }, 800);
  };

  useEffect(() => {
    if (range[1] - range[0] <= 1) {
      setFound(true);
    }
  }, [range]);

  return (
    <div className="flex flex-col h-full p-6 max-w-6xl mx-auto w-full relative z-10 overflow-hidden">
      <div className="mb-6 text-center shrink-0">
        <h2 className="text-3xl font-bold text-coffee-100 mb-2">Phase 1: Binary Search Verification</h2>
        <p className="text-coffee-300 max-w-2xl mx-auto text-lg">
          The referee uses binary search on checkpoints to efficiently find the exact training step where execution diverged.
        </p>
      </div>

      {/* Visualization of Steps */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-0">
        
        <div className="flex w-full justify-between items-end px-2 h-32 relative shrink-0">
          {/* Connecting line */}
          <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-coffee-800 z-0"></div>

          {Array.from({ length: TOTAL_STEPS + 1 }).map((_, i) => {
            const inRange = i >= range[0] && i <= range[1];
            
            let barColor = 'bg-coffee-800'; // Default
            let height = 'h-8';
            let opacity = 'opacity-40';

            if (inRange) {
                barColor = 'bg-verde-600';
                height = 'h-12';
                opacity = 'opacity-100';
            }

            if (found && i === range[0]) {
                barColor = 'bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
                height = 'h-16';
            } else if (found && i < range[0]) {
                barColor = 'bg-coffee-600/50';
            }
            
            if (i === midpoint && !found) {
                barColor = 'bg-verde-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]';
                height = 'h-16';
                opacity = 'opacity-100';
            }
            
            return (
              <div key={i} className={`flex flex-col items-center space-y-3 group relative z-10 transition-all duration-500 ${opacity}`}>
                {i === midpoint && !found && <div className="text-verde-400 font-bold text-xs absolute -top-8 animate-bounce">CHECK</div>}
                
                <div 
                  className={`w-2 rounded-full transition-all duration-300 ${barColor} ${height}`} 
                />
                <span className={`text-[10px] font-mono ${inRange ? 'text-coffee-300' : 'text-coffee-700'}`}>{i}</span>
                
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-coffee-800 text-coffee-200 text-xs p-2 rounded border border-coffee-600 z-20 whitespace-nowrap">
                  Step {i}: {i < DIVERGENCE_POINT ? 'Consistent' : 'Divergent'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-xl shrink-0 pb-4">
          <div className="bg-coffee-800/50 backdrop-blur-sm p-5 rounded-2xl border border-coffee-700 w-full shadow-lg flex flex-col max-h-[200px]">
            <h3 className="text-sm font-bold text-coffee-400 mb-2 uppercase tracking-wider flex items-center gap-2 shrink-0">
                <Search size={14} /> Referee Log
            </h3>
            <div className="overflow-y-auto space-y-2 font-mono text-xs text-coffee-300 pr-2 scrollbar-thin scrollbar-thumb-coffee-700 flex-1">
              {history.length === 0 && <p className="opacity-40 italic">Waiting to start verification process...</p>}
              {history.map((h, i) => (
                <div key={i} className="border-b border-coffee-700/50 pb-1 flex items-center gap-2">
                    <span className="text-coffee-500">{(i+1).toString().padStart(2, '0')}</span>
                    {h}
                </div>
              ))}
              {found && (
                <div className="text-verde-100 font-bold pt-2 bg-verde-900/30 p-2 rounded border border-verde-500/30 text-center mt-2">
                  ✓ DISPUTE RESOLVED: Divergence found at Step {range[0]}
                </div>
              )}
            </div>
          </div>

          {!found ? (
             <button
             onClick={handleBisect}
             disabled={checking}
             className="bg-verde-600 hover:bg-verde-500 disabled:bg-coffee-800 disabled:text-coffee-600 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center space-x-3 w-full justify-center"
           >
             {checking ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : (
               <Search size={20} />
             )}
             <span>Audit Step {midpoint}</span>
           </button>
          ) : (
            <button
            onClick={onComplete}
            className="bg-coffee-200 hover:bg-white text-coffee-950 px-10 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(224,209,201,0.3)] transition-all flex items-center space-x-3 animate-pulse w-full justify-center"
          >
            <span>Enter Phase 2</span>
            <ArrowRight size={20} />
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Phase1Stage;
