import { useState, useEffect } from 'react';

interface Node {
    readonly id: number;
    readonly service: 'gmail' | 'docs';
}

interface Edge {
    readonly fromNodeId: number;
    readonly toNodeId: number;
    readonly action: string;
}

interface Workflow {
    _id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
}

function Home() {

    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [lastCreatedWorkflow, setLastCreatedWorkflow] = useState<Workflow | undefined>(undefined);
    const [newWorkflowName, setNewWorkflowName] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:3000/workflows")
            .then(response => response.json())
            .then(data => setWorkflows(data))
            .catch(error => console.error(error));
    }, [lastCreatedWorkflow]);

    const createWorkflow = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: newWorkflowName, nodes: [], edges: []})
        };
        fetch("http://localhost:3000/workflows/new", requestOptions)
            .then(response => response.json())
            .then(data => setLastCreatedWorkflow(data))
            .catch(error => console.error(error));
    }

    const deleteWorkflow = (workflow: Workflow) => {
        const requestOptions = {method: 'DELETE'};
        fetch(`http://localhost:3000/workflows/${workflow._id}`, requestOptions)
            .then(response => response.json())
            .then(data => setLastCreatedWorkflow(data))
            .catch(error => console.error(error));
    }

    return (
        <div>
        <div>
            <input type="text" placeholder="Workflow name" value={newWorkflowName} onChange={(e) => setNewWorkflowName(e.target.value)} />
            <button onClick={createWorkflow}>Create a new workflow</button>
        </div>
            <ul>
                {workflows.map(workflow => <li key={workflow._id}><a href={`/workflow/${workflow._id}`}>{workflow.name}</a><button onClick={() => deleteWorkflow(workflow)}>X</button></li>)}
            </ul>
        </div>
    );
}

export default Home;
