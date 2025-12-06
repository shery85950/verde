import React, { useState } from 'react';
import { SimulationPhase } from './types';
import DelegationStage from './components/Stages/DelegationStage';
import Phase1Stage from './components/Stages/Phase1Stage';
import Phase2Stage from './components/Stages/Phase2Stage';
import RepOpsStage from './components/Stages/RepOpsStage';
import ChatBot from './components/ChatBot';
import { Play } from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<SimulationPhase>(SimulationPhase.INTRO);

  const nextPhase = () => {
    switch (phase) {
      case SimulationPhase.INTRO:
        setPhase(SimulationPhase.DELEGATION);
        break;
      case SimulationPhase.DELEGATION:
        setPhase(SimulationPhase.DISPUTE_PHASE_1);
        break;
      case SimulationPhase.DISPUTE_PHASE_1:
        setPhase(SimulationPhase.DISPUTE_PHASE_2);
        break;
      case SimulationPhase.DISPUTE_PHASE_2:
        setPhase(SimulationPhase.REPOPS);
        break;
      case SimulationPhase.REPOPS:
        setPhase(SimulationPhase.INTRO);
        break;
      default:
        setPhase(SimulationPhase.INTRO);
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case SimulationPhase.INTRO:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-10 p-6 z-10 relative">
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-8xl font-bold text-coffee-100 tracking-tighter drop-shadow-2xl">
                VERDE
              </h1>
              <div className="h-1.5 w-32 bg-verde-500 mx-auto rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            </div>
            
            <div className="bg-coffee-800/60 backdrop-blur-md border border-coffee-700 p-8 rounded-2xl max-w-2xl shadow-2xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <p className="text-xl text-coffee-200 leading-relaxed">
                How do you trust Machine Learning results from untrusted servers? 
                <br/>
                Explore the <span className="text-verde-400 font-bold">Verde</span> protocol and <span className="text-verde-400 font-bold">RepOps</span> in this interactive simulation.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
               <button 
                 onClick={nextPhase}
                 className="group relative bg-verde-600 hover:bg-verde-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] transition-all hover:scale-105 flex items-center space-x-3 overflow-hidden border border-verde-500/50"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                 <Play size={24} fill="currentColor" />
                 <span>Start Simulation</span>
               </button>
            </div>
            
            <div className="mt-12 text-sm text-coffee-500 font-mono animate-fade-in-up" style={{animationDelay: '0.3s'}}>
               Research by Gensyn AI, NYU, and a16z crypto.
            </div>
          </div>
        );
      case SimulationPhase.DELEGATION:
        return <DelegationStage onComplete={nextPhase} />;
      case SimulationPhase.DISPUTE_PHASE_1:
        return <Phase1Stage onComplete={nextPhase} />;
      case SimulationPhase.DISPUTE_PHASE_2:
        return <Phase2Stage onComplete={nextPhase} />;
      case SimulationPhase.REPOPS:
        return <RepOpsStage onComplete={nextPhase} />;
      default:
        return <div>Unknown Phase</div>;
    }
  };

  return (
    <div className="h-screen w-screen bg-coffee-900 text-coffee-100 flex flex-col overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-coffee-800/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-verde-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
      </div>

      {/* Top Navigation / Progress */}
      {phase !== SimulationPhase.INTRO && (
        <div className="h-20 border-b border-coffee-800 flex items-center justify-between px-8 bg-coffee-900/80 backdrop-blur-md z-40">
           <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-verde-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
             <div className="font-bold text-coffee-100 tracking-wider text-lg">VERDE</div>
           </div>
           
           <div className="flex flex-col items-center space-y-2">
             <div className="flex space-x-3">
               {[
                 SimulationPhase.DELEGATION, 
                 SimulationPhase.DISPUTE_PHASE_1, 
                 SimulationPhase.DISPUTE_PHASE_2,
                 SimulationPhase.REPOPS
               ].map((p, i) => {
                 const isActive = p === phase;
                 const isPast = [
                   SimulationPhase.DELEGATION, 
                   SimulationPhase.DISPUTE_PHASE_1, 
                   SimulationPhase.DISPUTE_PHASE_2,
                   SimulationPhase.REPOPS
                 ].indexOf(phase) > i;
                 
                 return (
                   <div key={p} className={`h-1.5 rounded-full transition-all duration-500 ${isActive ? 'w-12 bg-verde-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : isPast ? 'w-8 bg-verde-900' : 'w-8 bg-coffee-800'}`} />
                 )
               })}
             </div>
             <div className="text-xs text-coffee-500 font-mono tracking-widest uppercase">
               {phase.replace(/_/g, ' ')}
             </div>
           </div>

           <div className="w-20"></div> {/* Spacer for balance */}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {renderPhase()}
      </main>

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default App;