import {FC, useRef, useState} from "react";
import {Image} from "antd";
import {FullscreenOutlined, RedoOutlined, UndoOutlined, ZoomInOutlined, ZoomOutOutlined} from "@ant-design/icons";

interface ImageViewerProps {
    src: any
}

const ImageViewer: FC<ImageViewerProps> = (props) => {

    const {src} = props

    const [deg, setDeg] = useState<number>(0)

    const ref = useRef(null)

    return <div
        style={{
            width: 300,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden'
        }}
    >
        <Image
            src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?`}
            style={{transform: `rotate(${deg}deg)`}}
        />
        <div
            style={{
                width: '100%',
                height: 40,
                backgroundColor: 'rgba(204,204,204,0.8)',
                position: 'absolute',
                top: 0,
                overflow: 'hidden'
            }}
        ></div>
        <div
            style={{
                width: '100%',
                height: 40,
                backgroundColor: 'rgba(204,204,204,0.8)',
                position: 'absolute',
                bottom: 0,
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <ZoomInOutlined
                style={{fontSize: 20, color: "#5e5c5c", padding: '0 5px'}}
                onClick={() => {
                    document.getElementsByClassName('ant-image-img')[0].style.scale =
                        document.getElementsByClassName('ant-image-img')[0].style.scale ?
                            parseFloat(document.getElementsByClassName('ant-image-img')[0].style.scale) + 0.1 : 1.1

                }}
            />
            <ZoomOutOutlined
                onClick={() => {
                    document.getElementsByClassName('ant-image-img')[0].style.scale =
                        document.getElementsByClassName('ant-image-img')[0].style.scale ?
                            parseFloat(document.getElementsByClassName('ant-image-img')[0].style.scale) - 0.1 : 0.9

                }}
                style={{fontSize: 20, color: "#5e5c5c", padding: '0 5px'}}
            />
            <FullscreenOutlined
                onClick={()=>{

                }}
                style={{fontSize: 20, color: "#5e5c5c", padding: '0 5px'}}
            />
            <RedoOutlined
                style={{fontSize: 20, color: "#5e5c5c", padding: '0 5px'}}
                onClick={() => {
                    setDeg(deg + 90)
                }}
            />
            <UndoOutlined
                onClick={() => {
                    setDeg(deg - 90)
                }}
                style={{fontSize: 20, color: "#5e5c5c", padding: '0 5px'}}
            />
        </div>
    </div>
}

export default ImageViewer