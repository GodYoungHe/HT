import {request} from "@umijs/max";

export async function LoadSummary(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/LoadSummary',{
        data: data,
        method: 'POST',
    })
}


