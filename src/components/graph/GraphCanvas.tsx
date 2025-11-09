import { useEffect, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { useGraph } from '../../context/GraphContext';

// 1. Import all THREE custom nodes
import {
  LowScoreNode,
  HighScoreNode,
  VeryHighScoreNode,
} from './CustomNodes';

// 2. (*** THE NEW FIX ***)
// Define the nodeTypes object *outside* the component,
// at the top level of the module.
// This ensures it is only created ONCE.
const nodeTypes = {
  LowScoreNode: LowScoreNode,
  HighScoreNode: HighScoreNode,
  VeryHighScoreNode: VeryHighScoreNode,
};

const GraphCanvas = () => {
  const { state, fetchData } = useGraph();
  const { isLoading } = state;
  const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setNodes(state.nodes);
    setEdges(state.edges);
  }, [state.nodes, state.edges, setNodes, setEdges]);

  // We no longer define nodeTypes inside the component
  // const nodeTypes = useMemo(...) <-- REMOVED

  if (isLoading && state.nodes.length === 0) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="main-graph"
        nodeTypes={nodeTypes} // <-- This now references the constant defined outside
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;