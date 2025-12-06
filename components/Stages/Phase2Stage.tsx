import React, { useState } from 'react';
import { ArrowRight, Box, Cpu, AlertTriangle } from 'lucide-react';
import { NodeStatus } from '../../types';

interface Phase2StageProps {
  onComplete: () => void;
}

const INITIAL_NODES: NodeStatus[] = [
  { id: '1', type: 'input', label: 'Input Data', status: 'verified', x: 50, y: 150 },
  { id: '2', type: 'input', label: 'Weights', status: 'verified', x: 50, y: 250 },
  { id: '3', type: 'op', label: 'MatMul', status: 'verified', x: 200, y: 200 },
  { id: '4', type: 'op', label: 'Bias Add', status: 'verified', x: 350, y: 200 },
  { id: '5', type: 'op', label: 'ReLU', status: 'verified', x: 500, y: 200 },
  { id: '6', type: 'op', label: 'MatMul (Layer 2)', status: 'diverged', x: 650, y: 200 }, // The culprit
  { id: '7', type: 'output', label: 'Loss Calc', status: 'disputed', x: 800, y: 200 },
];

const Phase2Stage: React.FC<Phase2StageProps> = ({ onComplete }) => {
  const [nodes, setNodes] = useState<NodeStatus[]>(INITIAL_NODES);
  const [checked, setChecked] = useState(false);

  const verifyGraph = () => {
    // Reveal that node 6 is the source of divergence
    setChecked(true);
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-7xl mx-auto w-full relative z-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold text-coffee-100 mb-2">Phase 2: Graph Analysis</h2>
            <p className="text-coffee-300 max-w-2xl text-lg">
            Inside the divergent step, the Referee checks the input and output hashes of each operator in the Computational Graph.
            </p>
        </div>
        {!checked ? (
            <button 
                onClick={verifyGraph}
                className="bg-verde-600 hover:bg-verde-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center space-x-2"
            >
                <Cpu size={20} />
                <span>Verify Operators</span>
            </button>
        ) : (
            <button 
                onClick={onComplete}
                className="bg-coffee-200 hover:bg-white text-coffee-900 px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(224,209,201,0.3)] transition-colors flex items-center space-x-2 animate-pulse"
            >
                <span>Analyze Root Cause</span>
                <ArrowRight size={20} />
            </button>
        )}
      </div>

      <div className="flex-1 bg-coffee-800/40 backdrop-blur-md rounded-2xl border border-coffee-700/50 relative overflow-hidden flex items-center justify-center shadow-inner">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

        {/* SVG Graph Visualization */}
        <svg width="100%" height="100%" viewBox="0 0 900 400" className="absolute inset-0">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#5e4a42" />
            </marker>
            <marker id="arrow-error" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
            </marker>
          </defs>
          
          {/* Edges */}
          <line x1="80" y1="150" x2="170" y2="190" stroke="#5e4a42" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="80" y1="250" x2="170" y2="210" stroke="#5e4a42" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="230" y1="200" x2="320" y2="200" stroke="#5e4a42" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="380" y1="200" x2="470" y2="200" stroke="#5e4a42" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="530" y1="200" x2="620" y2="200" stroke={checked ? "#ef4444" : "#5e4a42"} strokeWidth="2" markerEnd={checked ? "url(#arrow-error)" : "url(#arrow)"} strokeDasharray={checked ? "5,5" : ""} className="transition-all duration-1000" />
          <line x1="680" y1="200" x2="770" y2="200" stroke={checked ? "#ef4444" : "#5e4a42"} strokeWidth="2" markerEnd={checked ? "url(#arrow-error)" : "url(#arrow)"} className="transition-all duration-1000 delay-100" />
        </svg>

        {nodes.map((node) => {
            let borderColor = 'border-coffee-600';
            let bgColor = 'bg-coffee-900';
            let textColor = 'text-coffee-400';
            let icon = <Box size={24} className="text-coffee-500" />;

            if (checked) {
                if (node.status === 'verified') {
                    borderColor = 'border-verde-700/50';
                    bgColor = 'bg-verde-900/10';
                    icon = <div className="text-verde-500 font-bold">✓</div>;
                    textColor = 'text-verde-200/50';
                } else if (node.status === 'diverged') {
                    borderColor = 'border-red-500';
                    bgColor = 'bg-red-900/20';
                    icon = <AlertTriangle size={24} className="text-red-500" />;
                    textColor = 'text-red-200';
                } else if (node.status === 'disputed') {
                    borderColor = 'border-orange-500/50';
                    bgColor = 'bg-orange-900/10';
                    icon = <div className="text-orange-500 font-bold">?</div>;
                    textColor = 'text-orange-200';
                }
            }

            return (
                <div 
                    key={node.id}
                    className={`absolute flex flex-col items-center justify-center w-28 h-28 border-2 rounded-2xl transition-all duration-700 ${borderColor} ${bgColor} shadow-lg z-10`}
                    style={{ left: node.x, top: node.y - 56 }} // Adjust for center
                >
                    <div className="mb-2">{icon}</div>
                    <span className={`text-xs font-bold text-center px-2 leading-tight ${textColor}`}>{node.label}</span>
                    {checked && node.status === 'diverged' && (
                        <div className="absolute -top-14 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce whitespace-nowrap">
                            Divergence Source
                        </div>
                    )}
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default Phase2Stage;