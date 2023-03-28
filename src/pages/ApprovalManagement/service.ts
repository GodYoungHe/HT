import {request} from "@@/exports";

export async function LoadTa(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/LoadTa',{
        data: data,
        method: 'POST',
    })
}

export async function LoadOrderReviewList(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/LoadOrderReviewList',{
        data: data,
        method: 'POST',
        timeout: 300000,
    })
}

export async function IssueOrder(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/IssueOrder',{
        data: data,
        method: 'POST',
    })
}

export async function LoadOrderDetailByGCode(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/LoadOrderDetailByGCode',{
        data: data,
        method: 'POST',
    })
}

export async function LoadIssueOrder(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/LoadIssueOrder',{
        data: data,
        method: 'POST',
    })
}

export async function UpdateConfirmReason(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/UpdateConfirmReason',{
        data: data,
        method: 'POST',
    })
}

export async function ApprovalDecision(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/ApprovalDecision',{
        data: data,
        method: 'POST',
    })
}

export async function UploadFileImport(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/UploadFileImport',{
        data: data,
        method: 'POST',
    })
}

export async function UploadFileList(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/UploadFile',{
        data: data,
        method: 'POST',
    })
}

export async function SaveUploadFile(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/SaveUploadFile',{
        data: data,
        method: 'POST',
    })
}

export async function ExportOrderReviewReport(data?: any, options?: { [key: string]: any }) {
    return request('/ThirdApprove/T/ThirdOrder/ExportOrderReviewReport',{
        data: data,
        method: 'POST',
        responseType: 'blob',
    })
}
