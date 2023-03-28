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



