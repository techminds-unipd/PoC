import { useDnD } from '../DnDContext';
import './Sidebar.css';

const Sidebar = () => {
    const [, setService] = useDnD();

    const onDragStart = (event:any, nodeType: string) => {
        setService!(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div className="description">Seleziona il blocco di automazione che desideri.</div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'gmail')} draggable>
                Gmail Node
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'googleCalendar')} draggable>
                Calendar Node
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'gDocs')} draggable>
                GDocs Node
            </div>
        </aside>
    );
};

export default Sidebar;
