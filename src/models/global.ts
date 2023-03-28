// 全局共享数据示例
import {useState} from 'react';
import {getUserInfo} from "@/components/Header/service";

const useUser = () => {

    const [info, setInfo] = useState<any>(null);

    const getUserAllInfo = () => {

        getUserInfo().then((res)=>{
            if (res.state === 1) {
                setInfo(res.userInfo)
                localStorage.setItem('permissions',JSON.stringify(res.ListPermissions))
            }
        })

    }

    return {
        info,
        getUserAllInfo
    };
};

export default useUser;
