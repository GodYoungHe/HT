import {FC, useEffect, useState} from "react";
import {Card, message, Modal, Table, Tooltip} from "antd";
import styles from '../index.less'
import {ProForm, ProFormSelect, ProFormTextArea, ProFormUploadButton} from "@ant-design/pro-components";
import {SaveUploadFile, UploadFileList} from "@/pages/ApprovalManagement/service";
import dayjs, {Dayjs} from "dayjs";


interface UploadFilesProps {
    open: boolean
    onCancel: () => void
    id: string
    actionRef: any
    setSelectId: (t: any) => void
}


const UploadFiles: FC<UploadFilesProps> = (props) => {

    const {open, onCancel, id, setSelectId} = props

    const [fileList, setFileList] = useState<any>([])

    const [dataSource, setDataSource] = useState([])

    const [form] = ProForm.useForm()

    useEffect(() => {
        if (id && open) {
            UploadFileList({
                htCode: id
            }).then((res) => {
                if (res.state) {
                    setDataSource(res.data)
                }
            })
        }
    }, [id, open])

    const columns: any = [
        {
            title: '文件简述',
            dataIndex: 'FileRemark',
            ellipsis: true,
            width: 240,
            render: (item: any) => {
                return <Tooltip title={item}>
                    {item}
                </Tooltip>
            }
        },
        {
            title: '分类一',
            dataIndex: 'FileSortFirst'
        },
        {
            title: '分类二',
            dataIndex: 'FileSortSecond'
        },
        {
            title: '上传时间',
            dataIndex: 'CreateDate',
            width: 180,
            render: (item: any) => {
                if (item) {
                    const dateString = item.toString();
                    const regex = /\/Date\(([0-9]+)\)\//;
                    const match = dateString.match(regex);
                    const timestamp = parseInt(match[1], 10);

                    const dateStr = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');

                    return dateStr
                }
            }
        },
        {
            title: '操作',
            width: 100,
            fixed: 'right',
            render: (item: any, record: any) => {
                return <a
                    className={'orange-a'}
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = 'https://s3.cn-north-1.amazonaws.com.cn/wechat' + record.FileSrcs;
                        link.download = `上传文件下载${dayjs().format('YYYYMMDDHHmmss')}`;
                        link.click();
                    }}
                >
                    下载
                </a>
            }
        }
    ]

    const handleSubmit = () => {

        let flag = false
        fileList?.forEach((item: any)=>{
            if(item.status === 'error'){
                flag = true
            }
        })

        if(flag){
            message.error('不可包含上传失败文件!')
            return
        }

        form.validateFields().then(() => {
            Modal.confirm({
                title: '是否确认提交',
                maskClosable: false,
                onOk: () => {

                    const values = form.getFieldsValue()

                    SaveUploadFile({
                        htCode: id,
                        FileRemark: values.FileRemark,
                        FileID: fileList?.map((item: any) => {
                            return item.name
                        }),
                        FileSortFirst: values.FileSortFirst,
                        FileSortSecond: values.FileSortSecond
                    }).then((res) => {
                        if (res.state === 1) {
                            onCancel()
                            form.resetFields()
                            setDataSource([])
                            setFileList([])
                            setSelectId('')
                            message.success('提交成功!')
                        }
                    })
                }
            })
        })
    }

    const beforeUpload = (file: any) => {
        if (file.size > 1024 * 1024 * 1024) {
            message.error('文件不能超过10MB');
            return false;
        }
        return true;
    }

    return <Modal
        open={open}
        title={'上传文件'}
        width={950}
        destroyOnClose={true}
        maskClosable={false}
        onCancel={() => {
            form.resetFields()
            setDataSource([])
            setFileList([])
            setSelectId('')
            onCancel()
        }}
        onOk={handleSubmit}
    >
        <div style={{color: "red"}}>
            <span style={{marginRight: 5}}>
                HT编号:
            </span>
            <span>{id || ''}</span>
        </div>
        <Card
            style={{marginTop: 15}}
            title={'已上传文件列表'}
            className={styles.cardStyle}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
            />
        </Card>
        <Card title={'待上传文件'} style={{marginTop: 20}}>
            <ProForm form={form} labelCol={{span: 3}} layout={'horizontal'} submitter={false}>
                <ProFormSelect
                    label={'分类一'}
                    name={'FileSortFirst'}
                    required
                    width={'lg'}
                    rules={[{required: true, message: '该项不可为空！'}]}
                    options={[
                        {label: 'ReOpen', value: 'ReOpen'},
                        {label: 'OnHold', value: 'OnHold'},
                        {label: '计次', value: '计次'},
                        {label: 'iSight', value: 'iSight'},
                        {label: '其他', value: '其他'},
                    ]}
                />
                <ProFormSelect
                    label={'分类二'}
                    name={'FileSortSecond'}
                    required
                    width={'lg'}
                    rules={[{required: true, message: '该项不可为空！'}]}
                    options={[
                        {label: '与用户沟通', value: '与用户沟通'},
                        {label: '与合规沟通', value: '与合规沟通'},
                        {label: '与技术供应商沟通', value: '与技术供应商沟通'},
                        {label: '与商户沟通', value: '与商户沟通'},
                        {label: '与订餐供应商沟通', value: '与订餐供应商沟通'},
                        {label: '其他', value: '其他'},
                    ]}
                />
                <ProFormTextArea
                    label={'文件简述'}
                    width={'lg'}
                    name={'FileRemark'}
                    required
                    rules={[{required: true, message: '该项不可为空！'}]}
                />
                <ProFormUploadButton
                    label={'文件上传'}
                    buttonProps={{type: 'primary'}}
                    required
                    name={'file'}
                    rules={[{required: true, message: '该项不可为空！'},]}
                    fieldProps={{
                        action: '/ThirdApprove/T/ThirdOrder/UploadFileImport',
                        beforeUpload: beforeUpload,
                        onChange: (info) => {

                            let newFileList = JSON.parse(JSON.stringify(info.fileList))

                            if (info.file.status === 'done') {
                                if (info.file.response.state) {
                                    const index = newFileList.findIndex((item: any) => item.uid === info.file.uid);
                                    newFileList[index].name = info.file.response.data;
                                    if (info.file.response.state !== 1) {
                                        newFileList[index].status = "error";
                                    }
                                    message.success(`${info.file.name} 文件上传成功`);
                                } else {
                                    message.error(`${info.file.name} 文件上传失败`)
                                }
                            } else if (info.file.status === 'error') {
                                message.error(`${info.file.name} 文件上传失败`);
                            }
                            setFileList(newFileList)
                        },
                        fileList: fileList
                    }}
                />
            </ProForm>
        </Card>
    </Modal>
}

export default UploadFiles
