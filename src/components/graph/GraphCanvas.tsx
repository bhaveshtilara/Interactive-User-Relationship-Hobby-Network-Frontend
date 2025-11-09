import { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Connection,
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
  const { state, fetchData, linkUsers } = useGraph();
  const { isLoading } = state;
  const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);

const onConnect = useCallback(
    (params: Connection) => {
      // We must have a source and target
      if (params.source && params.target) {
        linkUsers(params.source, params.target);
      }
    },
    [linkUsers] // Dependency
  );
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setNodes(state.nodes);
    setEdges(state.edges);
  }, [state.nodes, state.edges, setNodes, setEdges]);


  if (isLoading && state.nodes.length === 0) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
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