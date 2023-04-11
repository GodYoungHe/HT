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
                        formRef.setFieldsValue({
                            Reason: res.data
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
            IssueOrder({
                htCode: id,
                Reason: values.Reason
            }).then((res) => {
                if (res.state && res.state === 1) {
                    message.success('订单计次成功！')
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
        width={400}
        title={'订单Issue计次'}
        footer={<div>
            <Button onClick={()=>{
                formRef.resetFields()
                setSelectId('')
                setDetail(null)
                onCancel()
            }}>取消</Button>
            {detail?.IssueState === '是' ? null :
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
                    type: 'Issue计次'
                }}
            >
                <ProFormText
                    label={'操作类型'}
                    readonly
                    name={'type'}
                />
                <ProFormSelect
                    label={'计次原因'}
                    width={'md'}
                    name={'Reason'}
                    required={true}
                    readonly={detail?.IsTimeIssue === 1}
                    rules={[{required: true, message: '该项为必填项！'}]}
                    options={[
                        {
                            label: 'HCP自带酒水',
                            value: 'HCP自带酒水'
                        }
                    ]}
                />
            </ProForm>
        </Spin>
    </Modal>

}

export default Count