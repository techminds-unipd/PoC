import { useState } from 'react';
import { BackendModel } from '../BackendModel';

interface CreateWorkflowProps {
    setLastCreatedWorkflow: React.Dispatch<React.SetStateAction<BackendModel.Workflow | undefined>>;
};

function CreateWorkflow({setLastCreatedWorkflow} : CreateWorkflowProps) {
    const [newWorkflowName, setNewWorkflowName] = useState<string>("");

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

    return (
            <div>
                <input type="text" placeholder="Workflow name" value={newWorkflowName} onChange={(e) => setNewWorkflowName(e.target.value)} />
                <button onClick={createWorkflow}>Create a new workflow</button>
            </div>
    );
}

export default CreateWorkflow;
