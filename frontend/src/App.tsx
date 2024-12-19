import WorkflowCanvas from './components/Workflow/WorkflowCanvas';
import WorkflowSaver from './components/WorkflowSaver';
import {
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type Position,
} from '@xyflow/react';


function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
        [
            { id: '1', position: { x: 0, y: 0 }, data: { label: '1' }, type: 'input', sourcePosition: 'right' as Position},
            { id: '2', position: { x: 300, y: 0 }, data: { label: '2' }, targetPosition: 'left' as Position, sourcePosition: 'right' as Position }
        ]
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    return (
        <>
        <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
        />
        <WorkflowSaver
            nodes={nodes}
            edges={edges}
        />
        </>
    );
}

export default App
