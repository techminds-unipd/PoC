import { useState, useEffect } from 'react';
import * as BackendModel  from '../BackendModel';
import CreateWorkflow from './CreateWorkflow';

function Home() {

    const [workflows, setWorkflows] = useState<BackendModel.Workflow[]>([]);
    const [lastCreatedWorkflow, setLastCreatedWorkflow] = useState<BackendModel.Workflow | undefined>(undefined);
    const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);

    useEffect(() => {
        fetch("http://localhost:3000/auth/google/status")
            .then(response => response.json())
            .then(data => setIsGoogleConnected(data.isGoogleConnected))
            .catch(error => console.error(error));
    }, [])

    useEffect(() => {
        fetch("http://localhost:3000/workflows")
            .then(response => response.json())
            .then(data => setWorkflows(data))
            .catch(error => console.error(error));
    }, [lastCreatedWorkflow]);

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
                <CreateWorkflow setLastCreatedWorkflow={setLastCreatedWorkflow}/>
                {!isGoogleConnected &&
                 <a href="http://localhost:3000/auth/google/login" target="_blank" rel="noopener noreferrer">
                     Connect a Google account
                 </a>
                }
            </div>
            <ul>
                {workflows.map(workflow => <li key={workflow._id}><a href={`/workflow/${workflow.name}/${workflow._id}`}>{workflow.name}</a><button onClick={() => deleteWorkflow(workflow)}>X</button></li>)}
            </ul>
        </div>
    );
}

export default Home;
