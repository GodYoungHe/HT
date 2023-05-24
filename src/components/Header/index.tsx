import React from "react";
import {useModel} from "@@/exports";
import {Modal} from "antd";


const Header: React.FC = () => {

    const {info} = useModel('global')

    return <div
        style={{width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center', paddingRight: 30}}>
        <div className={'orange-a'} style={{marginRight: 10}}>欢迎使用</div>
        <div className={'orange-a'} style={{marginRight: 20}}>{info?.Name || ''}</div>
        <a
            className={'orange-a'}
            onClick={()=>{
                Modal.confirm({
                    title: '是否确认退出？',
                    onOk: () => {
                        //https://catering-prod.igskapp.com/ThirdApprove/
                        // window.location.href = 'https://wxm-dev.igskapp.com/ThirdApprove/T/Home/Exit'
                        window.location.href = 'https://catering-prod.igskapp.com/ThirdApprove/T/Home/Exit'
                    },
                    maskClosable: false
                })
            }}
        >退出登录</a>
    </div>
}

export default Header
