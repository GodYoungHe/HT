import {FC, useEffect, useState} from "react";
import Viewer from 'react-viewer';
import styles from './index.less'
import {FullscreenOutlined} from "@ant-design/icons";

interface ZoomViewerProps {
    index: number
    id: string
    handleFullScreen: () => void
    src: string
    style?: any
    defaultScale: number
    zoomSpeed?: number
}

const ZoomViewer: FC<ZoomViewerProps> = (props) => {

    const {index, handleFullScreen, id, src, style, defaultScale, zoomSpeed} = props

    const [container, setContainer] = useState<any>(null)

    useEffect(() => {
        if (document.getElementById(id)) {
            setContainer(document.getElementById(id))
        }
    }, [document.getElementById(id)])

    return <div
        id={id}
        style={style}
    >
        <Viewer
            visible={true}
            images={[{
                src: src,
            }]}
            className={styles.imageStyle}
            container={container}
            noNavbar={true}
            changeable={false}
            noImgDetails={true}
            showTotal={false}
            noClose={true}
            scalable={false}
            defaultScale={defaultScale}
            customToolbar={(toolbars)=> {
                return [...toolbars, {
                    key: 'fullScreen',
                    render: <div><FullscreenOutlined /></div>,
                    onClick: () => {
                        handleFullScreen()
                    }
                }]
            }}
            zoomSpeed={zoomSpeed || 0.05}
        />
    </div>
}

export default ZoomViewer
