import { useEffect } from 'react'; // <-- 1. Import useMemo
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { useGraph } from '../../context/GraphContext';

// 2. Import our new custom nodes
import { LowScoreNode, HighScoreNode } from './CustomNodes';

// 3. Define the nodeTypes *outside* the component
// This fixes the React Flow warning
const nodeTypes = {
  LowScoreNode: LowScoreNode,
  HighScoreNode: HighScoreNode,
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
        nodeTypes={nodeTypes} // <-- 4. Pass the nodeTypes here
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;