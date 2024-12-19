//import Workflow from './components/Workflow'
//<Workflow
//    id={"67644a979b68962e3e1ae9cc"}
///>
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

function App() {

    const [workflows, setWorkflows] = useState<Workflow[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/workflows")
            .then(response => response.json())
            .then(data => setWorkflows(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <ul>
                {workflows.map(workflow => <li key={workflow._id}><a href="">{workflow.name}</a></li>)}
            </ul>
        </div>
    );
}

export default App;
