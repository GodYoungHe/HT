import {PageContainer, ProTable} from "@ant-design/pro-components";
import React, {useEffect, useRef, useState} from "react";
import {Button, message} from "antd";
import {LoadIssueData, LoadIssueReport} from "@/pages/IssueRecord/service";
import dayjs from "dayjs";

const IssueRecord: React.FC = () => {

    const ref = useRef<any>(null)

    const [loading, setLoading] = useState(false)

    const columns: any = [
        {
            title: '申请人姓名',
            dataIndex: 'ApplierName',
            hideInSearch: true
        },
        {
            title: '申请人MUDID',
            dataIndex: 'ApplierMUDID',
        },
        {
            title: 'Gmeal编号',
            hideInSearch: true,
            dataIndex: 'GCode',
            width: 400,
            ellipsis: true
        },
        {
            title: '记录时间',
            hideInSearch: true,
            dataIndex: 'CreateDate',
        },
        {
            title: '记录日期',
            dataIndex: 'CreateDate',
            valueType: 'dateTimeRange',
            hideInTable: true,
            fieldProps: {
                showTime: false,
                format: 'YYYY-MM-DD',
            }
        },
        {
            title: '记录操作人姓名',
            dataIndex: 'OperatorName',
            hideInSearch: true
        },
        {
            title: '记录操作人MUDID',
            dataIndex: 'OperatorMUDID',
            hideInSearch: true
        }
    ]

    const exportFile = () => {
        setLoading(true)

        const params = ref.current.getFieldsValue()

        if (params.CreateDate) {
            params.DateBegin = params.CreateDate[0].format('YYYY-MM-DD')
            params.DateEnd = params.CreateDate[1].format('YYYY-MM-DD')
            delete params.CreateDate
        }

        LoadIssueReport(params).then((res)=>{
            if(res){
                const content = res; // 文件流
                const blob = new Blob([content], {type: 'application/vnd.ms-excel'});
                const fileName = `issue${dayjs().format('YYYY-MM-DD HH:mm:ss')}.xlsx`;
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = URL.createObjectURL(blob);
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(link.href); // 释放URL 对象
                    document.body.removeChild(link);
                }
                message.success('导出文件成功!')
                setLoading(false)
            }else {
                message.error('导出文件失败！')
                setLoading(false)
            }
        }).catch(() => {
            message.error('导出文件失败！')
            setLoading(false)
        })
    }

    return <PageContainer
        breadcrumb={{}}
    >
        <ProTable
            columns={columns}
            formRef={ref}
            headerTitle={
                <Button
                    type={'primary'}
                    onClick={exportFile}
                    loading={loading}
                >
                    导出文件
                </Button>
            }
            search={{
                layout: 'vertical'
            }}
            request={async ({pageSize, current, ...rest}) => {

                if (rest.CreateDate) {
                    rest.DateBegin = rest.CreateDate[0]
                    rest.DateEnd = rest.CreateDate[1]
                    delete rest.CreateDate
                }

                const result = await LoadIssueData({...rest, rows: pageSize, page: current})

                return {
                    success: true,
                    data: result.data,
                    total: result.total,
                }

            }}
            pagination={{
                defaultPageSize: 10,
                showSizeChanger: true
            }}
            scroll={{x: 1200}}
        />
    </PageContainer>
}

export default IssueRecord