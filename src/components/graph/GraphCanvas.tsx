import { useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { useGraph } from '../../context/GraphContext';

// Import the CSS for React Flow (alternative to main.tsx)
// import 'reactflow/dist/style.css';

const GraphCanvas = () => {
  // 1. Get our global state and fetch function
  const { state, fetchData } = useGraph();
  const { isLoading } = state;

  // 2. Setup React Flow's internal state
  const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);

  // 3. Fetch data on initial component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 4. Sync React Flow's state with our global context state
  useEffect(() => {
    setNodes(state.nodes);
    setEdges(state.edges);
  }, [state.nodes, state.edges, setNodes, setEdges]);

  // 5. Show a loading spinner
  if (isLoading && state.nodes.length === 0) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView // Zooms/pans to fit all nodes on load
        className="main-graph"
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;