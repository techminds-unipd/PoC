import { useState, useEffect } from 'react';
import { BackendModel } from '../BackendModel';

function Home() {

    const [workflows, setWorkflows] = useState<BackendModel.Workflow[]>([]);
    const [lastCreatedWorkflow, setLastCreatedWorkflow] = useState<BackendModel.Workflow | undefined>(undefined);
    const [newWorkflowName, setNewWorkflowName] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:3000/workflows")
            .then(response => response.json())
            .then(data => setWorkflows(data))
            .catch(error => console.error(error));
    }, [lastCreatedWorkflow]);

    const createWorkflow = () => {
        if (newWorkflowName !== "") {
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
    }

    const deleteWorkflow = (workflow: BackendModel.Workflow) => {
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
                {workflows.map(workflow => <li key={workflow._id}><a href={`/workflow/${workflow.name}/${workflow._id}`}>{workflow.name}</a><button onClick={() => deleteWorkflow(workflow)}>X</button></li>)}
            </ul>
        </div>
    );
}

export default Home;
