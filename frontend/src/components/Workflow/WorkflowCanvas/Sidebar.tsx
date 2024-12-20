import { useDnD } from './DnDContext';

export default () => {
    const [_, setType] = useDnD();

    const onDragStart = (event:any, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div>You can drag these nodes to the pane on the right.</div>
            <div onDragStart={(event) => onDragStart(event, 'input')} draggable>
                Input Node
            </div>
            <div onDragStart={(event) => onDragStart(event, 'default')} draggable>
                Default Node
            </div>
            <div onDragStart={(event) => onDragStart(event, 'output')} draggable>
                Output Node
            </div>
        </aside>
    );
};
