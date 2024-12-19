import WorkflowCanvas from './Workflow/WorkflowCanvas';
import WorkflowSaver from './WorkflowSaver';
import {
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    MarkerType
} from '@xyflow/react';
import { useEffect } from 'react';
import { useParams } from "react-router";


interface NodeReq {
    readonly id: number;
    readonly service: 'gmail' | 'docs';
}

interface EdgeReq {
    readonly fromNodeId: number;
    readonly toNodeId: number;
    readonly action: string;
}

function Workflow() {

    const { id } = useParams();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
        [
            //{ id: '1', position: { x: 0, y: 0 }, data: { label: '1' }, type: 'input', sourcePosition: 'right' as Position},
            //{ id: '2', position: { x: 300, y: 0 }, data: { label: '2' }, targetPosition: 'left' as Position, sourcePosition: 'right' as Position }
        ]
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
        fetch(`http://localhost:3000/workflows/${id}`)
            .then(response => response.json())
            .then(data => {
                setNodes(data.nodes.map((node:NodeReq) => {return {id: node.id, position: {x: 0, y: 0}, data: {label: node.service}}}))
                setEdges(data.edges.map((edge:EdgeReq) => {return {id:0, source: edge.fromNodeId, target: edge.toNodeId, label: edge.action, markerEnd: { type: MarkerType.ArrowClosed }, type: 'editable' }}))
            })
            .catch(error => console.error(error));
    }, []);

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
            id={id}
        />
        </>
    );
}

export default Workflow
