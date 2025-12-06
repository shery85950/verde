import React, { useState } from 'react';
import { RefreshCw, CheckCircle, Calculator, ChevronRight, Cpu, AlertTriangle } from 'lucide-react';

interface RepOpsStageProps {
  onComplete: () => void;
}

const RepOpsStage: React.FC<RepOpsStageProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('problem');

  return (
    <div className="flex flex-col h-full p-8 max-w-6xl mx-auto w-full relative z-10">
      <div className="mb-8 text-center flex-shrink-0">
        <h2 className="text-3xl font-bold text-coffee-100 mb-2">The Root Cause: Hardware Non-Determinism</h2>
        <p className="text-coffee-300 max-w-2xl mx-auto text-lg">
          Why did the "MatMul" diverge? Floating point addition is not associative. 
          Different hardware architectures sum parallel threads in different orders.
        </p>
      </div>

      <div className="flex justify-center mb-10 flex-shrink-0">
        <div className="bg-coffee-800 p-1.5 rounded-xl inline-flex shadow-inner border border-coffee-700">
          <button 
            onClick={() => setActiveTab('problem')}
            className={`px-8 py-3 rounded-lg transition-all font-medium ${activeTab === 'problem' ? 'bg-coffee-600 text-coffee-100 shadow-lg' : 'text-coffee-500 hover:text-coffee-200'}`}
          >
            The Problem
          </button>
          <button 
            onClick={() => setActiveTab('solution')}
            className={`px-8 py-3 rounded-lg transition-all font-medium ${activeTab === 'solution' ? 'bg-verde-600 text-white shadow-lg font-bold' : 'text-coffee-500 hover:text-coffee-200'}`}
          >
            The RepOps Solution
          </button>
        </div>
      </div>

      <div className="flex-1 bg-coffee-800/30 backdrop-blur-md border border-coffee-700/50 rounded-3xl shadow-xl relative overflow-hidden flex flex-col">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center scrollbar-thin scrollbar-thumb-coffee-600 scrollbar-track-transparent">
            {activeTab === 'problem' ? (
            <div className="w-full max-w-3xl space-y-8 animate-fade-in-up my-auto">
                <div className="flex items-center justify-between text-xl font-mono bg-coffee-900/50 p-6 rounded-xl border border-coffee-700">
                    <span>A = <span className="text-blue-300">1.0e20</span></span>
                    <span>B = <span className="text-red-300">-1.0e20</span></span>
                    <span>C = <span className="text-coffee-300">3.14</span></span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-coffee-900 p-8 rounded-2xl border border-coffee-700 relative overflow-hidden group hover:border-coffee-500 transition-colors">
                    <h4 className="text-coffee-400 mb-6 flex items-center gap-2 font-bold"><Cpu size={18}/> GPU 1 (Order A)</h4>
                    <div className="font-mono space-y-3 text-lg">
                        <p className="text-coffee-500">(A + B) + C</p>
                        <p className="text-coffee-400">= (0) + 3.14</p>
                        <div className="h-px bg-coffee-800 my-2"></div>
                        <p className="text-2xl text-verde-400 font-bold">= 3.14</p>
                    </div>
                    </div>

                    <div className="bg-coffee-900 p-8 rounded-2xl border border-coffee-700 relative overflow-hidden group hover:border-red-900 transition-colors">
                    <h4 className="text-coffee-400 mb-6 flex items-center gap-2 font-bold"><Cpu size={18}/> GPU 2 (Order B)</h4>
                    <div className="font-mono space-y-3 text-lg">
                        <p className="text-coffee-500">A + (B + C)</p>
                        <p className="text-coffee-400">= 1.0e20 + (-1.0e20)</p>
                        <p className="text-sm text-red-300/60 italic">* 3.14 lost in precision</p>
                        <div className="h-px bg-coffee-800 my-2"></div>
                        <p className="text-2xl text-red-400 font-bold">= 0.00</p>
                    </div>
                    </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-center text-red-200 flex items-center justify-center gap-3">
                    <AlertTriangle size={20} />
                    <span className="font-medium">Different results for mathematically equivalent operations break verification.</span>
                </div>
            </div>
            ) : (
                <div className="w-full max-w-3xl space-y-8 animate-fade-in-up my-auto">
                    <div className="text-center space-y-4">
                        <h3 className="text-3xl font-bold text-coffee-100 flex items-center justify-center gap-3">
                            <RefreshCw className="text-verde-400" size={32} />
                            Enter RepOps
                        </h3>
                        <p className="text-coffee-300 text-lg max-w-xl mx-auto">
                            RepOps forces a deterministic execution graph, ensuring summations happen in a fixed order regardless of hardware parallelism.
                        </p>
                    </div>

                    <div className="bg-coffee-900 p-8 rounded-2xl border border-verde-500/30 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-2 h-full bg-verde-500"></div>
                        <h4 className="text-coffee-200 mb-6 font-bold flex items-center gap-2 text-lg">
                            <Calculator size={24} className="text-verde-500"/> Enforced Execution Graph
                        </h4>
                        
                        <div className="flex items-center justify-around font-mono text-xl">
                            <div className="p-4 bg-coffee-800 rounded-lg text-coffee-300">A</div>
                            <ChevronRight className="text-coffee-600"/>
                            <div className="p-4 bg-coffee-800 rounded-lg text-coffee-300">B</div>
                            <div className="text-xs text-coffee-500 uppercase tracking-widest font-bold">Accumulator</div>
                            <div className="p-4 bg-coffee-800 rounded-lg text-coffee-300">C</div>
                            <ChevronRight className="text-verde-400"/>
                            <div className="text-3xl font-bold text-coffee-100 drop-shadow-md">3.14</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-verde-900/10 p-5 rounded-xl border border-verde-500/20 text-center text-verde-200 font-mono">
                            <CheckCircle className="inline mr-2 mb-1" size={18}/>
                            GPU 1 Output: 3.14
                        </div>
                        <div className="bg-verde-900/10 p-5 rounded-xl border border-verde-500/20 text-center text-verde-200 font-mono">
                            <CheckCircle className="inline mr-2 mb-1" size={18}/>
                            GPU 2 Output: 3.14
                        </div>
                    </div>

                    <button 
                        onClick={onComplete}
                        className="w-full mt-4 bg-coffee-200 hover:bg-white text-coffee-950 px-8 py-4 rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(224,209,201,0.3)] transition-all flex items-center justify-center space-x-3 transform hover:-translate-y-1"
                    >
                        <span>Finish Simulation</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RepOpsStage;