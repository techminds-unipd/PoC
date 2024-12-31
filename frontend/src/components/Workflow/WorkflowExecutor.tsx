interface WorkflowExecutorProps {
    id: string;
}

function WorkflowExecutor({ id }: WorkflowExecutorProps) {

    const execute = () => {
        fetch(`http://localhost:3000/workflows/${id}/execute`)
            .then(response => console.log(response.json()))
            .catch(error => console.error(error));
    }

    return (
        <button onClick={execute}>Exec workflow</button>
    );
}

export default WorkflowExecutor;
