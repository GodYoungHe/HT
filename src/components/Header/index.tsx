import React from "react";
import {useModel} from "@@/exports";
import {Modal} from "antd";
import {exit} from "@/components/Header/service";


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
                        window.location.href = 'https://gmealdev.igskapp.com/ThirdApprove/T/Home/Exit'
                    }
                })
            }}
        >退出登录</a>
    </div>
}

export default Header