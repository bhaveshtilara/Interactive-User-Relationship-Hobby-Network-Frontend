import { Handle, Position, type NodeProps } from 'reactflow';
import { type UserNodeData } from '../../types';

// We'll define a common style for both nodes
const commonStyle: React.CSSProperties = {
  border: '1px solid #777',
  borderRadius: '8px',
  padding: '10px 15px',
  background: '#2a2a2a',
  minWidth: '150px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
};

// --- 1. Low Score Node (Score <= 5) ---
export function LowScoreNode({ data }: NodeProps<UserNodeData>) {
  return (
    <div style={commonStyle}>
      {/* A handle for incoming edges (top) */}
      <Handle type="target" position={Position.Top} />

      {/* Node Content */}
      <div>
        <strong>{data.label}</strong> (Age: {data.age})
      </div>
      <div style={{ fontSize: '0.8em', color: '#aaa' }}>
        Score: {data.popularityScore}
      </div>

      {/* A handle for outgoing edges (bottom) */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// --- 2. High Score Node (Score > 5) ---
export function HighScoreNode({ data }: NodeProps<UserNodeData>) {
  // Add a special style for high-score users
  const highScoreStyle: React.CSSProperties = {
    ...commonStyle,
    background: '#1a4a1a', // Greenish background
    border: '1px solid #3cff3c',
    boxShadow: '0 0 10px rgba(60, 255, 60, 0.5)',
  };

  return (
    <div style={highScoreStyle}>
      <Handle type="target" position={Position.Top} />

      {/* Node Content */}
      <div>
        <strong>🌟 {data.label}</strong> (Age: {data.age})
      </div>
      <div style={{ fontSize: '0.9em', color: '#c1f0c1' }}>
        <strong>Score: {data.popularityScore}</strong>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}