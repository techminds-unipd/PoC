import WorkflowCanvas from './WorkflowCanvas/WorkflowCanvas';
import WorkflowSaver from './WorkflowSaver';
import WorkflowExecutor from './WorkflowExecutor';
import {
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    MarkerType,
    Position
} from '@xyflow/react';
import { useEffect } from 'react';
import { useParams } from "react-router";
import { BackendModel } from '../../BackendModel';

function Workflow() {
    const { id, name } = useParams();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
        fetch(`http://localhost:3000/workflows/${id}`)
            .then(response => response.json())
            .then(data => {
                setNodes(data.nodes.map((node:BackendModel.Node) => {
                    const xPosition = String(node.id*500);
                    return {id: node.id, position: {x: xPosition, y: 0}, data: {label: node.service}, sourcePosition: 'right' as Position, targetPosition: 'left' as Position};
                }))
                setEdges(data.edges.map((edge:BackendModel.Edge) => {
                    return {id: `e${edge.fromNodeId}-${edge.toNodeId}`, source: edge.fromNodeId, target: edge.toNodeId, label: edge.action, markerEnd: { type: MarkerType.ArrowClosed }, type: 'editable'};
                }))
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <>
        <a href="/">Torna alla home</a>
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
            id={id as string}
            name={name as string}
        />
        <WorkflowExecutor
            id={id as string}
        />
        </>
    );
}

export default Workflow
