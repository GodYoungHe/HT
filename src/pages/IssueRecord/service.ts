import {request} from "@@/exports";

export async function LoadIssueData(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/LoadIssueData',{
        data: data,
        method: 'POST',
    })
}

export async function LoadIssueReport(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/LoadIssueReport',{
        data: data,
        method: 'POST',
        responseType: 'blob',
    })
}

export async function IssueConfirm(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/IssueConfirm',{
        data: data,
        method: 'POST',
    })
}

export async function IssueAppeal(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/IssueAppeal',{
        data: data,
        method: 'POST',
    })
}


