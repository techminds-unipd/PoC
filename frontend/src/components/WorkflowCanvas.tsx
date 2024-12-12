import { useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    addEdge,
    OnNodesChange,
    OnEdgesChange
} from '@xyflow/react';
import {Node, Edge} from '../types/ReactFlow.types'

import '@xyflow/react/dist/style.css';


interface WorkflowCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange<Node>;
    onEdgesChange: OnEdgesChange<Edge>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
}

function WorkflowCanvas({nodes, edges, onNodesChange, onEdgesChange, setEdges}: WorkflowCanvasProps) {
    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}>
            <Controls />
        </ReactFlow>
    );
}

export default WorkflowCanvas;
