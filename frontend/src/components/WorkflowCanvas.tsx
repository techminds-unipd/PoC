import { useRef, useCallback } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    Controls,
    useReactFlow,
    Background,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
} from '@xyflow/react';

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import '@xyflow/react/dist/style.css';

interface WorkflowCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange<Node>;
    onEdgesChange: OnEdgesChange<Edge>;
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

let id = 0;
const getId = () => `dndnode_${id++}`;
 
const DnDFlow = ({nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges}: WorkflowCanvasProps) => {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [nodeType] = useDnD();
 
  const onConnect = useCallback(
    (params:any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
 
  const onDragOver = useCallback((event:any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
 
  const onDrop = useCallback(
    (event:any) => {
      event.preventDefault();
 
      // check if the dropped element is valid
      if (!nodeType) {
        return;
      }
 
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: Node = {
        id: getId(),
        type: `${nodeType}`,
        position,
        data: { label: `${nodeType} node` },
      };
 
      setNodes((nds: Node[]) => nds.concat(newNode));
    },
    [screenToFlowPosition, nodeType],
  );
 
  return (
    <div style={{width: "100%", height: "100%", display: "flex"}}>
      <Sidebar />
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '90vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          style={{ backgroundColor: "#F7F9FB" }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};
 
const WorkflowCanvas = ({nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges}: WorkflowCanvasProps) => (
  <ReactFlowProvider>
    <DnDProvider>
        <DnDFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
        />
    </DnDProvider>
  </ReactFlowProvider>
);

export default WorkflowCanvas;
