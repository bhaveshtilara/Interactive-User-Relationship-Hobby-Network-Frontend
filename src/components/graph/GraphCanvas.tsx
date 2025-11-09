import { useEffect, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { useGraph } from '../../context/GraphContext';

import {
  LowScoreNode,
  HighScoreNode,
  VeryHighScoreNode,
} from './CustomNodes';


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

  const nodeTypes = useMemo(
    () => ({
      LowScoreNode: LowScoreNode,
      HighScoreNode: HighScoreNode,
      VeryHighScoreNode: VeryHighScoreNode, 
    }),
    []
  );

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
        nodeTypes={nodeTypes} 
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;