import { useState } from 'react';
import {
    BaseEdge,
    getStraightPath,
    EdgeLabelRenderer,
    type EdgeProps,
    MarkerType
} from '@xyflow/react';

export default function EditableEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd = MarkerType.ArrowClosed,
    style,
    label
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style}/>
            <EdgeLabelRenderer >
                <div
                    onDoubleClick={() => {
                        alert("click")
                    }}
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: '#ffcc00',
                        padding: 10,
                        borderRadius: 5,
                        fontSize: 12,
                        fontWeight: 700,
                        pointerEvents: 'all'
                    }}
                    className="nodrag nopan"
                >
                    {label}
                </div>
        </EdgeLabelRenderer>
        </>
    );
}
