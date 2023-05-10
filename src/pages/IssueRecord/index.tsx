import {PageContainer, ProTable} from "@ant-design/pro-components";
import React, {useEffect, useRef, useState} from "react";
import {Button, Divider, message, Modal} from "antd";
import {IssueAppeal, IssueConfirm, IssueTimeOrder, LoadIssueData, LoadIssueReport} from "@/pages/IssueRecord/service";
import dayjs from "dayjs";

const IssueRecord: React.FC = () => {

    const ref = useRef<any>(null)

    const actionRef = useRef<any>(null)

    const [loading, setLoading] = useState(false)

    const columns: any = [
        {
            title: '申请人姓名',
            dataIndex: 'ApplierName',
            hideInSearch: true,
        },
        {
            title: '申请人MUDID',
            dataIndex: 'ApplierMUDID',
        },
        {
            title: 'HT编号',
            hideInSearch: true,
            dataIndex: 'HTCode',
            width: 400,
            ellipsis: true
        },
        {
            title: 'OnHold计次时间',
            hideInSearch: true,
            dataIndex: 'CreateDate',
            width: 180,
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
            title: '操作人姓名',
            dataIndex: 'OperatorName',
            hideInSearch: true
        },
        {
            title: '操作人MUDID',
            dataIndex: 'OperatorMUDID',
            hideInSearch: true
        },
        {
            title: '是否确认计次',
            dataIndex: 'Issue',
            valueType: 'select',
            valueEnum: {
                0: 'OnHold计次',
                1: '确认计次',
                2: '申诉成功'
            },
            hideInTable: true
        },
        // {
        //     title: '是否确认计次',
        //     dataIndex: 'IsIssue',
        //     hideInSearch: true,
        //     render: (item: any) => {
        //         if(item === '0'){
        //             return 'OnHold计次'
        //         }else if(item === '1'){
        //             return '确认计次'
        //         }else if(item === '2'){
        //             return '申诉成功'
        //         }else {
        //             return '-'
        //         }
        //     }
        // },
        {
            title: '计次状态',
            dataIndex: 'IssueState',
            hideInSearch: true
        },
        {
            title: '操作时间',
            dataIndex: 'IssueTime',
            width: 180,
            hideInSearch: true
        },
        {
            title: '操作',
            width: 160,
            valueType: 'option',
            fixed: 'right',
            render: (item: any, record: any) => {

                const code = record.HTCode.split('(')[0]

                return <div>
                    {record.IsIssue === '0'?<div><a
                        className={'orange-a'}
                        onClick={() => {
                            Modal.confirm({
                                title: '是否确认计次?',
                                onOk: () => {
                                    IssueConfirm({
                                        htCode: code
                                    }).then((res) => {
                                        if(res.state === 1){
                                            actionRef.current.reload()
                                            message.success(res.txt)
                                        }else{
                                            if(res.txt){
                                                message.error(res.txt)
                                            }else {
                                                message.error('确认计次失败！')
                                            }
                                        }
                                    })
                                }
                            })
                        }}
                    >
                        确认计次
                    </a>
                        <Divider type={'vertical'}/>
                        <a
                            className={'orange-a'}
                            onClick={()=>{
                                Modal.confirm({
                                    title: '是否取消计次？',
                                    onOk: () => {
                                        IssueTimeOrder({
                                            htCode: code
                                        }).then((res)=>{
                                            if(res.state && res.state === 1){
                                                message.success(res.txt)
                                                actionRef.current.reload()
                                            }else{
                                                message.error('取消计次失败!')
                                            }
                                        })
                                    }
                                })
                            }}
                        >取消计次</a>
                    </div>: null}
                    {(record.IsIssue === '1' && record.ShowAppeal=== '1')?<a
                        className={'orange-a'}
                        onClick={() => {
                            Modal.confirm({
                                title: '是否确认申诉?',
                                onOk: () => {
                                    IssueAppeal({
                                        htCode: code
                                    }).then((res) => {
                                        if(res.state === 1){
                                            actionRef.current.reload()
                                            message.success(res.txt)
                                        }else{
                                            if(res.txt){
                                                message.error(res.txt)
                                            }else {
                                                message.error('确认申诉失败！')
                                            }
                                        }
                                    })
                                }
                            })
                        }}
                    >
                        申诉
                    </a>: null}
                </div>
            }
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

        LoadIssueReport(params).then((res) => {
            if (res) {
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
            } else {
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
            actionRef={actionRef}
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
            scroll={{x: 1500}}
        />
    </PageContainer>
}

export default IssueRecord