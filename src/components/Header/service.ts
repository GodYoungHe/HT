import {request} from "@@/exports";

export async function getSession(params?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/Home/Main3',{
        params,
    })
}

export async function getUserInfo(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/Home/LoadUserInfo',{
        data: data,
        method: 'POST',
    })
}

export async function exit(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/Home/Exit',{
        data: data,
        method: 'POST',
    })
}
