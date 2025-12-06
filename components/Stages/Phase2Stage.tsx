import React, { useState } from 'react';
import { ArrowRight, Box, Cpu, AlertTriangle } from 'lucide-react';
import { NodeStatus } from '../../types';

interface Phase2StageProps {
  onComplete: () => void;
}

// Coordinates are now centered: x is center-x, y is center-y
const NODE_WIDTH = 112; // w-28 = 7rem = 112px
const NODE_HEIGHT = 112; 
const HALF_W = NODE_WIDTH / 2;

const INITIAL_NODES: NodeStatus[] = [
  // Layer 1
  { id: '1', type: 'input', label: 'Input Data', status: 'verified', x: 150, y: 120 },
  { id: '2', type: 'input', label: 'Weights', status: 'verified', x: 150, y: 280 },
  
  // Layer 2
  { id: '3', type: 'op', label: 'MatMul', status: 'verified', x: 350, y: 200 },
  
  // Layer 3
  { id: '4', type: 'op', label: 'Bias Add', status: 'verified', x: 550, y: 200 },
  
  // Layer 4
  { id: '5', type: 'op', label: 'ReLU', status: 'verified', x: 750, y: 200 },
  
  // Layer 5 (New row to fit) - actually let's just make it a linear flow with one branch
  // Let's re-arrange to fit nicely in 1000px width.
  // Flow: Inputs (1,2) -> MatMul(3) -> Bias(4) -> ReLU(5) -> MatMul2(6) -> Loss(7)
  // That's too long. Let's stack 6 and 7 below 4 and 5? Or just make the graph simpler for visual clarity.
  // Simpler graph: Inputs -> MatMul -> Bias -> ReLU -> Loss. 
  // Let's stick to the list but compress x spacing.
  
  // Revised Compact Layout
  // Inputs
  { id: 'input1', type: 'input', label: 'Input', status: 'verified', x: 100, y: 150 },
  { id: 'input2', type: 'input', label: 'Weights', status: 'verified', x: 100, y: 300 },
  
  // Ops
  { id: 'op1', type: 'op', label: 'MatMul', status: 'verified', x: 280, y: 225 },
  { id: 'op2', type: 'op', label: 'Bias Add', status: 'verified', x: 460, y: 225 },
  { id: 'op3', type: 'op', label: 'ReLU', status: 'verified', x: 640, y: 225 },
  
  // Divergence
  { id: 'op4', type: 'op', label: 'MatMul L2', status: 'diverged', x: 820, y: 225 }, 
  
  // Output
  // { id: 'out', type: 'output', label: 'Loss', status: 'disputed', x: 1000, y: 225 } // Too wide?
]; 

// Actually, let's just keep the divergent node as the last one shown for simplicity in this view
// or wrap it.
// Let's use the layout from previous code but fixed coordinates.
const FIXED_NODES: NodeStatus[] = [
    { id: '1', type: 'input', label: 'Input Data', status: 'verified', x: 120, y: 140 },
    { id: '2', type: 'input', label: 'Weights', status: 'verified', x: 120, y: 310 },
    { id: '3', type: 'op', label: 'MatMul', status: 'verified', x: 320, y: 225 },
    { id: '4', type: 'op', label: 'Bias Add', status: 'verified', x: 520, y: 225 },
    { id: '5', type: 'op', label: 'ReLU', status: 'verified', x: 720, y: 225 },
    { id: '6', type: 'op', label: 'MatMul L2', status: 'diverged', x: 920, y: 225 },
];


const Phase2Stage: React.FC<Phase2StageProps> = ({ onComplete }) => {
  const [nodes, setNodes] = useState<NodeStatus[]>(FIXED_NODES);
  const [checked, setChecked] = useState(false);

  const verifyGraph = () => {
    setChecked(true);
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-[1400px] mx-auto w-full relative z-10">
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

      {/* Container for the Graph */}
      <div className="flex-1 bg-coffee-800/40 backdrop-blur-md rounded-2xl border border-coffee-700/50 relative overflow-x-auto overflow-y-hidden shadow-inner flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        
        {/* Inner container with fixed size to ensure alignment */}
        <div className="relative w-[1100px] h-[450px]">
            {/* SVG Graph Visualization - No ViewBox for 1:1 Pixel Mapping */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="24" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#5e4a42" />
                </marker>
                <marker id="arrow-error" markerWidth="10" markerHeight="10" refX="24" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                </marker>
            </defs>
            
            {/* Edges connecting centers */}
            {/* Input 1 -> MatMul: (120 + 56, 140) -> (320 - 56, 225) roughly */}
            {/* Actually we draw from edge to edge. 
                Node 1 Right Edge: 120 + 56 = 176. y=140.
                Node 3 Left Edge: 320 - 56 = 264. y=225.
            */}
            <line x1="176" y1="140" x2="264" y2="225" stroke="#5e4a42" strokeWidth="2" markerEnd="url(#arrow)" />
            
            {/* Input 2 -> MatMul: (176, 310) -> (264, 225) */}
            <line x1="176" y1="310" x2="264" y2="225" stroke="#5e4a42" strokeWidth="2" markerEnd="url(#arrow)" />
            
            {/* MatMul -> Bias: (320 + 56, 225) -> (520 - 56, 225) => 376 -> 464 */}
            <line x1="376" y1="225" x2="464" y2="225" stroke="#5e4a42" strokeWidth="2" markerEnd="url(#arrow)" />
            
            {/* Bias -> ReLU: (520 + 56, 225) -> (720 - 56, 225) => 576 -> 664 */}
            <line x1="576" y1="225" x2="664" y2="225" stroke="#5e4a42" strokeWidth="2" markerEnd="url(#arrow)" />
            
            {/* ReLU -> MatMul L2: (720 + 56, 225) -> (920 - 56, 225) => 776 -> 864 */}
            <line 
                x1="776" y1="225" x2="864" y2="225" 
                stroke={checked ? "#ef4444" : "#5e4a42"} 
                strokeWidth="2" 
                markerEnd={checked ? "url(#arrow-error)" : "url(#arrow)"} 
                strokeDasharray={checked ? "5,5" : ""}
                className="transition-all duration-1000"
            />
            
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
                    }
                }

                // x and y are centers. We need top-left for absolute positioning.
                // w=28 (7rem) = 112px. h=28 = 112px.
                const left = node.x - 56;
                const top = node.y - 56;

                return (
                    <div 
                        key={node.id}
                        className={`absolute flex flex-col items-center justify-center w-28 h-28 border-2 rounded-2xl transition-all duration-700 ${borderColor} ${bgColor} shadow-lg z-10`}
                        style={{ left: left, top: top }} 
                    >
                        <div className="mb-2">{icon}</div>
                        <span className={`text-xs font-bold text-center px-2 leading-tight ${textColor}`}>{node.label}</span>
                        {checked && node.status === 'diverged' && (
                            <div className="absolute -top-12 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce whitespace-nowrap">
                                Divergence Source
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default Phase2Stage;
