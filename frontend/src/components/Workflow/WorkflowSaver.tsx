import {
    type Node,
    type Edge,
} from '@xyflow/react';

interface WorkflowSaverProps {
    nodes: Node[];
    edges: Edge[];
    id: string;
    name: string;
}

function WorkflowSaver({nodes, edges, id, name}: WorkflowSaverProps) {

    const sendData = () => {
        const workflow = {
            name: name,
            nodes: nodes.map((node) => {return {id: node.id, service: node.data.label}}),
            edges: edges.map((edge) => {return {fromNodeId: edge.source, toNodeId: edge.target, action: edge.label}}),
            _id: id
        }

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workflow)
        };
        fetch(`http://localhost:3000/workflows/${id}`, requestOptions)
            .then(response => response.json())
            .catch(error => console.error(error));
    }


    return (
        <button onClick={sendData}>Save workflow</button>
    );
}

export default WorkflowSaver;
