import React from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { useDrop } from 'react-dnd'
import { addCVs } from '../services/services';

const DnDBox = () => {

    const drop = useDrop({
        accept: [NativeTypes.FILE],
        drop(item, monitor) {
            if (monitor) {
                const files = monitor.getItem().files
                addCVs(files.map((el) => { return el.path }));
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver,
            canDrop: monitor.canDrop,
        }),
    })[1]

    return (
        <div ref={drop} >
            <div className="dnd-icon">
                <i className="fa fa-upload"></i>
            </div>
            <div className="dnd-text">
                Drag N Drop or click to add CVs
            </div>
        </div>
    )
}
export default DnDBox