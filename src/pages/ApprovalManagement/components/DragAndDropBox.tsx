import React, {useState} from 'react';
import {Image} from "antd";

interface Props {
    imageUrl: string;
}

interface Position {
    x: number;
    y: number;
}

const DragAndDropBox: React.FC<Props> = (props) => {
    const [imagePosition, setImagePosition] = useState<Position>({
        x: 0,
        y: 0
    });

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const {clientX, clientY} = event;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        setImagePosition({
            x: clientX,
            y: clientY
        });
    }

    const handleMouseMove = (event: MouseEvent) => {
        const {clientX, clientY} = event;
        const deltaX = clientX - imagePosition.x;
        const deltaY = clientY - imagePosition.y;
        setImagePosition({
            x: clientX,
            y: clientY
        });
    }

    const handleMouseUp = (event: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    const boxStyle: any = {
        position: 'relative',
        width: '500px',
        height: '500px'
    };

    const imageStyle: any = {
        position: 'absolute',
        left: `${imagePosition.x}px`,
        top: `${imagePosition.y}px`,
        width: '200px',
        height: '200px',
        cursor: 'move'
    };

    return (
        <div style={boxStyle}>
            <div
                style={imageStyle}
                onMouseDown={handleMouseDown}
            >
                <img src={props.imageUrl} alt=""/>
            </div>
        </div>
    );
}

export default DragAndDropBox;
