import WorkflowCanvas from './components/WorkflowCanvas';

import {
    useNodesState,
    useEdgesState,
} from '@xyflow/react';

import {Node, Edge} from './types/ReactFlow.types'

function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
        [
            { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
            { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
        ]
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
        [{ id: 'e1-2', source: '1', target: '2', label: 'ciao' }]
    );

    const handleClick = () => {
        setNodes([...nodes, { id: '10', position: { x: 0, y: 0 }, data: { label: '10' } }]);
    }

    return (
        <div style={{ width: '50vw', height: '50vh' }}>
            <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                setEdges={setEdges}
            />
            <button onClick={handleClick} >Add node</button>
        </div>
    );
}

export default App
