import React, { useState, useEffect } from 'react';
import { Server, User, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface DelegationStageProps {
  onComplete: () => void;
}

const DelegationStage: React.FC<DelegationStageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), 1000)); // Start processing
    timers.push(setTimeout(() => setStep(2), 3500)); // Finish processing
    timers.push(setTimeout(() => setStep(3), 4500)); // Detect conflict
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-16 relative z-10">
      <div className="text-center space-y-4 animate-fade-in-up">
        <h2 className="text-4xl font-bold text-coffee-100">The Problem: Untrusted Delegation</h2>
        <p className="text-coffee-300 max-w-lg mx-auto text-lg">
          A client (you) sends an expensive ML job to two different servers.
          We need to ensure they return the correct result.
        </p>
      </div>

      <div className="relative w-full max-w-5xl flex justify-between items-center">
        
        {/* SVG Connection Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible">
          {step >= 1 && (
            <>
              {/* Line to Server A (Top) */}
              <line 
                x1="3rem" y1="50%" 
                x2="calc(100% - 3.5rem)" y2="16%" 
                className="stroke-coffee-600 animate-draw"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1000"
              />
              {/* Line to Server B (Bottom) */}
              <line 
                x1="3rem" y1="50%" 
                x2="calc(100% - 3.5rem)" y2="84%" 
                className="stroke-coffee-600 animate-draw"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1000"
              />
            </>
          )}
        </svg>

        {/* Client */}
        <div className="flex flex-col items-center z-20 group">
          <div className="w-24 h-24 bg-gradient-to-br from-coffee-700 to-coffee-800 rounded-2xl flex items-center justify-center shadow-xl border border-coffee-600 group-hover:scale-105 transition-transform duration-500 group-hover:border-verde-500/50">
            <User size={48} className="text-coffee-200 group-hover:text-verde-200 transition-colors" />
          </div>
          <p className="mt-4 font-bold text-coffee-200 bg-coffee-800/80 px-4 py-1 rounded-full border border-coffee-700">Client</p>
        </div>

        {/* Servers Container */}
        <div className="flex flex-col space-y-32">
          
          {/* Server A (Honest) */}
          <div className="flex items-center space-x-6 relative group">
             <div className="flex flex-col items-center z-10">
                <div className={`w-28 h-28 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-2xl ${step >= 2 ? 'border-verde-800/50 bg-verde-900/10 shadow-verde-900/20' : 'border-coffee-700 bg-coffee-800'}`}>
                  {step === 1 ? (
                    <div className="w-10 h-10 border-4 border-verde-500/50 border-t-verde-400 rounded-full animate-spin"></div>
                  ) : step >= 2 ? (
                    <CheckCircle size={48} className="text-verde-500" />
                  ) : (
                    <Server size={48} className="text-coffee-500" />
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-coffee-400 group-hover:text-verde-400 transition-colors">Server A (Honest)</p>
             </div>
             
             {step >= 2 && (
               <div className="bg-coffee-800/80 backdrop-blur-md p-4 rounded-xl border border-verde-900/50 animate-fade-in-up shadow-xl transform translate-x-2">
                 <p className="text-[10px] text-coffee-500 uppercase tracking-widest mb-1">Output Hash</p>
                 <code className="text-verde-200/90 font-mono text-lg">0x7f...a1</code>
               </div>
             )}
          </div>

          {/* Server B (Malicious/Buggy) */}
          <div className="flex items-center space-x-6 relative group">
             <div className="flex flex-col items-center z-10">
                <div className={`w-28 h-28 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-2xl ${step >= 2 ? 'border-red-900/50 bg-red-900/10 shadow-red-900/20' : 'border-coffee-700 bg-coffee-800'}`}>
                  {step === 1 ? (
                    <div className="w-10 h-10 border-4 border-red-800/60 border-t-transparent rounded-full animate-spin"></div>
                  ) : step >= 2 ? (
                    <AlertTriangle size={48} className="text-red-500/80" />
                  ) : (
                    <Server size={48} className="text-coffee-500" />
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-coffee-400 group-hover:text-red-400 transition-colors">Server B (Disputed)</p>
             </div>

             {step >= 2 && (
               <div className="bg-coffee-800/80 backdrop-blur-md p-4 rounded-xl border border-red-900/30 animate-fade-in-up shadow-xl transform translate-x-2">
                 <p className="text-[10px] text-coffee-500 uppercase tracking-widest mb-1">Output Hash</p>
                 <code className="text-red-200/90 font-mono text-lg">0x3b...c9</code>
               </div>
             )}
          </div>

        </div>
      </div>

      {step >= 3 && (
        <div className="animate-float absolute bottom-12">
           <div className="bg-coffee-800/95 backdrop-blur-xl border border-coffee-600 text-coffee-100 px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 max-w-md mx-auto ring-1 ring-coffee-700">
             <div className="flex items-center space-x-3 text-2xl font-bold text-coffee-100">
               <AlertTriangle className="text-red-400" />
               <span>DISPUTE DETECTED</span>
             </div>
             <p className="text-coffee-300 text-center">Output hashes do not match. A Referee is needed to arbitrate.</p>
             <button 
               onClick={onComplete}
               className="mt-2 w-full bg-verde-600 hover:bg-verde-500 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-verde-500/50"
             >
               <span>Start Verde Protocol</span>
               <ArrowRight size={20} />
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default DelegationStage;