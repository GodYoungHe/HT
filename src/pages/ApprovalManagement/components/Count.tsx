import {FC, useEffect, useState} from "react";
import {Button, message, Modal, Spin} from "antd";
import {ProForm, ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {IssueOrder, LoadIssueOrder} from "@/pages/ApprovalManagement/service";

interface CountProps {
    open: boolean
    onCancel: () => void
    id: string
    actionRef: any
    setSelectId: (t: any) => void
}

const Count: FC<CountProps> = (props) => {

    const {open, onCancel, id, actionRef, setSelectId} = props

    const [formRef] = ProForm.useForm()

    const [detail, setDetail] = useState<any>(null)

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

        setLoading(true)
        if (id && open) {
            LoadIssueOrder({
                htCode: id
            }).then((res) => {
                if (res.state && res.state === 1) {
                    if (res.IsTimeIssue) {

                        let initReason = res.data?.split(',')

                        formRef.setFieldsValue({
                            Reason: initReason
                        })
                    }
                    setDetail(res)
                }
            }).catch((err) => {
                message.error('数据获取失败！')
            }).finally(() => {
                setLoading(false)
            })
        }

    }, [id, open])

    const handleSubmit = () => {
        formRef.validateFields().then((values) => {

            const submitReason = values.Reason.reduce((newVal: string, current: string) => {
                let str
                if (!newVal) {
                    str = current
                } else {
                    str = newVal + ',' + current
                }
                return str
            }, '')

            IssueOrder({
                htCode: id,
                Reason: submitReason
            }).then((res) => {
                if (res.state && res.state === 1) {
                    message.success(res.txt)
                    actionRef?.current?.reload()
                    // if (res.Reason) {
                    //     formRef.setFieldsValue({
                    //         Reason: res.Reason
                    //     })
                    // }
                    // onCancel()
                    // setSelectId('')
                    formRef.resetFields()
                    setSelectId('')
                    setDetail(null)
                    onCancel()
                } else {
                    message.error(res.txt ? res.txt : '订单计次失败！')
                }
            }).catch(() => {
                message.error('订单计次失败！')
            })
        })

    }

    return <Modal
        open={open}
        onCancel={() => {
            formRef.resetFields()
            setSelectId('')
            setDetail(null)
            onCancel()
        }}
        destroyOnClose={true}
        width={560}
        title={'订单计次'}
        footer={<div>
            <Button onClick={()=>{
                formRef.resetFields()
                setSelectId('')
                setDetail(null)
                onCancel()
            }}>取消</Button>
            {detail?.IsTimeIssue === 1 ? null :
                <Button type={'primary'} onClick={handleSubmit} style={{marginLeft: 5}}>提交</Button>}
        </div>}
    >
        <Spin spinning={loading}>
            <ProForm
                style={{marginTop: 20}}
                form={formRef}
                submitter={false}
                layout={'horizontal'}
                labelCol={{span: 6}}
                initialValues={{
                    type: 'OnHold计次'
                }}
            >
                <ProFormText
                    label={'操作类型'}
                    readonly
                    name={'type'}
                />
                <ProFormSelect
                    label={'计次原因'}
                    width={'xl'}
                    name={'Reason'}
                    required={true}
                    readonly={detail?.IsTimeIssue === 1}
                    rules={[{required: true, message: '该项为必填项！'}]}
                    fieldProps={{mode: 'multiple'}}
                    options={[
                        {
                            label: '不合理的签到表日期与会议日期差异',
                            value: '不合理的签到表日期与会议日期差异'
                        },
                        {
                            label: '屏拍照片或者非会议现场照片',
                            value: '屏拍照片或者非会议现场照片'
                        },
                        {
                            label: '未使用GPS拍照且无技术供应商出具的证明邮件',
                            value: '未使用GPS拍照且无技术供应商出具的证明邮件'
                        },
                        {
                            label: '用户行为/操作导致的GPS位置严重偏离',
                            value: '用户行为/操作导致的GPS位置严重偏离'
                        },
                        {
                            label: '支持文件不全',
                            value: '支持文件不全'
                        }
                    ]}
                />
            </ProForm>
        </Spin>
    </Modal>

}

export default Count