import {
    type Node,
    type Edge,
} from '@xyflow/react';

interface WorkflowSaverProps {
    nodes: Node[];
    edges: Edge[];
}

function WorkflowSaver({nodes, edges}: WorkflowSaverProps) {

    const sendData = () => {
        const workflow = {
            name: 'Non è ancora possibile dare un nome ai workflow',
            nodes: nodes.map((node) => {return {id: node.id, service: "gmail"}}),
            edges: edges.map((edge) => {return {fromNodeId: edge.source, toNodeId: edge.target, action: edge.label}}),
        }
        console.log(JSON.stringify(workflow))

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workflow)
        };
        fetch('http://localhost:3000/workflows/new', requestOptions)
            .then(response => console.log(response.json()))
            .catch(error => console.error(error));
    }


    return (
        <button onClick={sendData}>Save workflow</button>
    );
}

export default WorkflowSaver;
