import {FC, useEffect, useState} from "react";
import {Card, message, Modal, Table} from "antd";
import styles from '../index.less'
import {ProForm, ProFormTextArea, ProFormUploadButton} from "@ant-design/pro-components";
import {SaveUploadFile, UploadFileList} from "@/pages/ApprovalManagement/service";
import dayjs from "dayjs";


interface UploadFilesProps {
    open: boolean
    onCancel: () => void
    id: string
    actionRef: any
    setSelectId: (t: any) => void
}


const UploadFiles: FC<UploadFilesProps> = (props) => {

    const {open, onCancel, id, actionRef, setSelectId} = props

    const [fileList, setFileList] = useState<any>([])

    const [dataSource, setDataSource] = useState([])

    const [form] = ProForm.useForm()

    useEffect(() => {
        if (id && open) {
            UploadFileList({
                GCode: id
            }).then((res) => {
                if (res.state) {
                    setDataSource(res.data)
                }
            })
        }
    }, [id, open])

    // const dataSource = [
    //     {
    //         title: '文件标题1',
    //         des: '文件简述xxxxxxxxxxxxxx'
    //     },
    //     {
    //         title: '文件标题2',
    //         des: '文件简述文件简述xxxxxxxxxxxxxx'
    //     }
    // ]

    const columns: any = [
        {
            title: '文件简述',
            dataIndex: 'FileRemark',
            width: 740,
            ellipsis: true
        },
        {
            title: '操作',
            width: 160,
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
                    点击下载文件包
                </a>
            }
        }
    ]

    const handleSubmit = () => {


        Modal.confirm({
            title: '是否确认提交',
            onOk: () => {

                const values = form.getFieldsValue()

                SaveUploadFile({
                    GCode: id,
                    FileRemark: values.FileRemark,
                    FileID: fileList?.map((item) => {
                        return item.name
                    })
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
    }

    return <Modal
        open={open}
        title={'上传文件'}
        width={950}
        destroyOnClose={true}
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
                Gmeal编号:
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
            <ProForm form={form} layout={'horizontal'} submitter={false}>
                <ProFormTextArea
                    label={'文件简述'}
                    width={'lg'}
                    name={'FileRemark'}
                />
                <ProFormUploadButton
                    label={'文件上传'}
                    buttonProps={{type: 'primary'}}
                    fieldProps={{
                        action: '/ThirdApprove/T/ThirdOrder/UploadFileImport',
                        onChange: (info) => {
                            let newFileList = JSON.parse(JSON.stringify(info.fileList))

                            if (info.file.status === 'done') {
                                if (info.file.response.state) {
                                    const index = newFileList.findIndex((item: any) => item.uid === info.file.uid);
                                    newFileList[index].name = info.file.response.data;
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