import { Handle, Position, type NodeProps } from 'reactflow';
import { type UserNodeData } from '../../types';

const commonStyle: React.CSSProperties = {
  border: '1px solid #777',
  borderRadius: '8px',
  padding: '10px 15px',
  background: '#2a2a2a',
  minWidth: '150px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
};

export function LowScoreNode({ data }: NodeProps<UserNodeData>) {
  return (
    <div style={commonStyle}>
      <Handle type="target" position={Position.Top} />

      <div>
        <strong>{data.label}</strong> (Age: {data.age})
      </div>
      <div style={{ fontSize: '0.8em', color: '#aaa' }}>
        Score: {data.popularityScore}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function HighScoreNode({ data }: NodeProps<UserNodeData>) {
  const highScoreStyle: React.CSSProperties = {
    ...commonStyle,
    background: '#1a4a1a', 
    border: '1px solid #3cff3c',
    boxShadow: '0 0 10px rgba(60, 255, 60, 0.5)',
  };

  return (
    <div style={highScoreStyle}>
      <Handle type="target" position={Position.Top} />

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

export function VeryHighScoreNode({ data }: NodeProps<UserNodeData>) {
  const veryHighScoreStyle: React.CSSProperties = {
    ...commonStyle,
    background: '#4a1a4a', 
    border: '1px solid #ff3cff',
    boxShadow: '0 0 15px rgba(255, 60, 255, 0.7)',
    color: '#f0c1f0',
  };

  return (
    <div style={veryHighScoreStyle}>
      <Handle type="target" position={Position.Top} />

      <div>
        <strong>🚀 {data.label}</strong> (Age: {data.age})
      </div>
      <div style={{ fontSize: '1em', fontWeight: 'bold' }}>
        SCORE: {data.popularityScore}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}