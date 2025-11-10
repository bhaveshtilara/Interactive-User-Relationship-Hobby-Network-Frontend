import React, { useEffect, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import { useGraph } from '../../context/GraphContext';
import {
  LowScoreNode,
  HighScoreNode,
  VeryHighScoreNode,
} from './CustomNodes';

const nodeTypes = {
  LowScoreNode: LowScoreNode,
  HighScoreNode: HighScoreNode,
  VeryHighScoreNode: VeryHighScoreNode,
};

const GraphCanvasInternal = () => {
  const { state, fetchData, linkUsers, selectNode, updateUser } = useGraph();
  const { isLoading } = state;
  const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);
  const reactFlowInstance = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        linkUsers(params.source, params.target);
      }
    },
    [linkUsers]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setNodes(state.nodes);
    setEdges(state.edges);
  }, [state.nodes, state.edges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const hobby = event.dataTransfer.getData('application/x-hobby');
      if (!hobby) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const targetNode = reactFlowInstance
        .getNodes()
        .find(
          (node) =>
            position.x >= node.position.x &&
            position.x <= node.position.x + (node.width || 0) &&
            position.y >= node.position.y &&
            position.y <= node.position.y + (node.height || 0)
        );

      if (targetNode) {
        const newHobbies = new Set(targetNode.data.hobbies as string[]);
        newHobbies.add(hobby);

        updateUser(targetNode.id, {
          hobbies: Array.from(newHobbies),
        });
      }
    },
    [reactFlowInstance, updateUser]
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
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgesChange={onEdgesChange}
        onDragOver={onDragOver}
        onDrop={onDrop}
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

const GraphCanvas = () => (
  <ReactFlowProvider>
    <GraphCanvasInternal />
  </ReactFlowProvider>
);

export default GraphCanvas;