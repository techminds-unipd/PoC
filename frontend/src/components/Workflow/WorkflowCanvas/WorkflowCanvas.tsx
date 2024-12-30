import { useRef, useCallback } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    Controls,
    useReactFlow,
    Background,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    MarkerType,
    Position,
    ConnectionLineType,
    getOutgoers
} from '@xyflow/react';

import Sidebar from './Sidebar/Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import EditableEdge from './EditableEdge';

import '@xyflow/react/dist/style.css';

interface WorkflowCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange<Node>;
    onEdgesChange: OnEdgesChange<Edge>;
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const edgeTypes = {
    editable: EditableEdge,
};

const DnDFlow = ({nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges}: WorkflowCanvasProps) => {
    const reactFlowWrapper = useRef(null);
    const { screenToFlowPosition } = useReactFlow();
    const [nodeService] = useDnD();

    const { getNodes, getEdges } = useReactFlow();

    let nodeId = nodes.length;
    const getNodeId = () => nodeId++;

    let edgeId = edges.length;
    const getEdgeId = () => edgeId++;

    const onConnect = useCallback(
        (params:any) => {
            setEdges((eds) => addEdge({...params, markerEnd: { type: MarkerType.ArrowClosed }, type: 'editable', label: "Inserisci l'automazione che desideri", id: getEdgeId()}, eds))
        },
        [getEdgeId, setEdges],
    );

    const onDragOver = useCallback((event:any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event:any) => {
            event.preventDefault();

            // check if the dropped element is valid
            if (!nodeService) {
                return;
            }

            if (getNodes().length > 3) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode: Node = {
                id: String(getNodeId()),
                position,
                data: { label: nodeService },
                sourcePosition: 'right' as Position,
                targetPosition: 'left' as Position
            };

            setNodes((nds: Node[]) => nds.concat(newNode));
        },
        [screenToFlowPosition, nodeService, getNodeId, getNodes, setNodes],
    );

    // https://reactflow.dev/examples/interaction/prevent-cycles
    const isValidConnection = useCallback(
        (connection:any) => {
            // we are using getNodes and getEdges helpers here
            // to make sure we create isValidConnection function only once
            const nodes = getNodes();
            const edges = getEdges();
            const target = nodes.find((node: Node) => node.id === connection.target);
            const hasCycle = (node: Node, visited = new Set()) => {
                if (visited.has(node.id)) return false;

                visited.add(node.id);

                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === connection.source) return true;
                    if (hasCycle(outgoer, visited)) return true;
                }
            };

            if (target && target.id === connection.source) return false;
            return !hasCycle(target as Node);
        },
        [getNodes, getEdges],
    );

    return (
        <div style={{width: "100%", height: "100%", display: "flex"}}>
            <Sidebar />
            <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '90vh' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    edgeTypes={edgeTypes}
                    fitView
                    style={{ backgroundColor: "#F7F9FB" }}
                    connectionLineType={ConnectionLineType.Straight}
                    isValidConnection={isValidConnection}
                    minZoom={0.7}
                    translateExtent={[[-10,-600], [2000, 600]]}
                    nodeExtent={[[-10,-600], [2000, 600]]}>
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
};

const WorkflowCanvas = ({nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges}: WorkflowCanvasProps) => (
    <ReactFlowProvider>
        <DnDProvider>
            <DnDFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                setNodes={setNodes}
                setEdges={setEdges}
            />
        </DnDProvider>
    </ReactFlowProvider>
);

export default WorkflowCanvas;
