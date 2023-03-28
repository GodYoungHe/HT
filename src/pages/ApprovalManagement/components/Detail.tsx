import React, {FC, useEffect, useState} from "react";
import {Button, Card, Col, Divider, Empty, Image, message, Modal, Radio, Row, Select, Spin, Tabs} from "antd";
import styles from '../index.less'
import {
    ProCard,
    ProForm,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProTable
} from "@ant-design/pro-components";
import {ApprovalDecision, LoadOrderDetailByGCode, UpdateConfirmReason} from "@/pages/ApprovalManagement/service";
import {useModel} from "@@/exports";
import {supportFilesListExternal, supportFilesListInternal, ticketReopenDetail, ticketReopenReason} from "./data";
import {stringifyNumbers} from "@/utils/format";
import moment from "moment";

interface DetailProps {
    open: boolean
    onCancel: () => void
    id: string
    actionRef: any
    setSelectId: (t: any) => void
}

const {Option} = Select

const Detail: FC<DetailProps> = (props) => {

    const {open, onCancel, id, setSelectId, actionRef} = props

    const {info} = useModel('global')

    const submitButtonVisible = info?.ListPermissions?.indexOf('00000000-0000-2000-0001-000000000001') !== -1

    const [radioValue, setRadioValue] = useState(0)

    const [onHold, setOnHold] = useState(0)

    const [activeKey, setActiveKey] = useState<string>('1')

    const [detail, setDetail] = useState<any>(null)

    const [loading, setLoading] = useState<boolean>(false)

    const [special, setSpecial] = useState<number>(0)

    const [onHoldReason, setOnHoldReason] = useState<string>('0')

    const [finalRes, setFinalRes] = useState('0')

    const [reopenState, setReopenState] = useState<string>('')

    // 特殊订单form
    const [specialForm] = ProForm.useForm()

    const [onHoldForm] = ProForm.useForm()

    const [approvalForm] = ProForm.useForm()

    const [decisionForm] = ProForm.useForm()

    const [disable, setDisable] = useState(false)

    const judgeDay = (day1: any, day2: any) => {
        const diffDays = day1.diff(moment(day2), 'days')
        if (diffDays > 7) {
            return true
        } else {
            return false
        }
    }

    const initAllState = () => {
        setSelectId('')
        setRadioValue(0)
        setOnHold(0)
        setActiveKey('1')
        setDetail(null)
        setLoading(false)
        setSpecial(0)
        setOnHoldReason('0')
        setFinalRes('0')
        setReopenState('')
        setDisable(false)
        specialForm.resetFields()
        onHoldForm.resetFields()
        approvalForm.resetFields()
        decisionForm.resetFields()
    }

    const setInitState = (values: any) => {
        let judge = false
        if (values.THApprovePassDate) {
            judge = judgeDay(moment(), values.THApprovePassDate)
        }

        // 回显的几种情况
        if (values.THApproveState === 0 ||
            (values.THApproveState === 1 && !judge && (
                    (values.OnHold === 1 && values.OnHoldReason === 1) ||
                    (values.OnHold === 1 && values.OnHoldReason === 2) ||
                    (values.OnHold === 0 && values.OnHoldReason === 0)
                )
            )) {

            // 审批决定通过且无onHold记录
            if (!values.OnHold && values.THApproveState === 1) {
                decisionForm.setFieldsValue({
                    Decision: 1
                })
                setRadioValue(1)
            }

            if (values.OnHold) {
                setOnHold(values.OnHold)
            }

            if (values.OnHoldReason) {
                setOnHoldReason(values.OnHoldReason.toString())
                onHoldForm.setFieldsValue({
                    onHoldReason: values.OnHoldReason.toString(),
                    reasonForApplier: values.ReasonForApplier,
                    reasonForPMO: values.ReasonForPMO
                })
            }

            setDisable(false)
        } else {
            setDisable(true)
        }

    }

    useEffect(() => {

        setLoading(true)

        if (id && open) {
            LoadOrderDetailByGCode({
                gcode: id
            }).then((res) => {
                if (res.state && res.state === 1) {
                    setInitState(res.data)
                    if (res.data.IsSpecialOrder === 3) {
                        // 未使用GPS
                        setSpecial(2)
                        specialForm.setFieldsValue({
                            specialReason: res.data.GFCConfirmWithoutGPSReason
                        })
                    } else if (res.data.IsOverDistance === 1) {
                        // 超过1公里
                        setSpecial(1)
                        specialForm.setFieldsValue({
                            specialReason: res.data.GFCConfirmReason
                        })
                    } else {
                        // 非特殊订单
                        setSpecial(0)
                    }

                    setDetail(res.data)
                }
            }).catch((err) => {
                message.error('数据获取失败！')
            }).finally(() => {
                setLoading(false)
            })
        }

    }, [id, open])

    const orderDetailColumns = [
        {
            title: '用餐类型',
            dataIndex: 'MealType'
        },
        {
            title: 'Gmeal编号',
            dataIndex: 'GCode'
        },
        {
            title: '申请人姓名',
            dataIndex: 'ApplierName'
        },
        {
            title: '申请人MUDID',
            dataIndex: 'ApplierMUDID'
        },
        {
            title: '申请人手机号码',
            dataIndex: 'Phone'
        },
        {
            title: '大区区域代码',
            dataIndex: 'RMTerritoryCode'
        },
        {
            title: 'Market',
            dataIndex: 'Market'
        },
        {
            title: 'TA',
            dataIndex: 'TA'
        },
        {
            title: '用餐日期',
            dataIndex: 'PreDinnerDate'
        },
        {
            title: '用餐时间',
            dataIndex: 'PreDinnerTime'
        },
        {
            title: '城市',
            dataIndex: 'City'
        },
        {
            title: '餐厅编码',
            dataIndex: 'RestaurantID'
        },
        {
            title: '餐厅名称',
            dataIndex: 'RestaurantName'
        },
        {
            title: '是否GPS拍照',
            dataIndex: 'IsGPS'
        },
        {
            title: '未使用GPS拍照原因',
            dataIndex: 'WithoutGPSReason'
        },
        {
            title: '未使用GPS拍照说明',
            dataIndex: 'GFCConfirmWithoutGPSReason'
        },
        {
            title: '三方确认未使用GPS拍照原因',
            dataIndex: 'WithoutGPSRemark'
        },
        {
            title: '拍照日期',
            dataIndex: 'FilmingDate'
        },
        {
            title: '拍照时间 ',
            dataIndex: 'FilmingTime'
        },
        {
            title: '拍照定位差异 ',
            dataIndex: 'Distance'
        },
        {
            title: 'GPS拍照距离超过1公里原因 ',
            dataIndex: 'OverDistanceReason'
        },
        {
            title: 'GPS拍照距离超过1公里说明 ',
            dataIndex: 'OverDistanceRemark'
        },
        {
            title: '三方确认GPS照片距离超过1公里原因 ',
            dataIndex: 'GFCConfirmReason'
        },
        {
            title: '是否当日上传小票 ',
            dataIndex: 'IsUpTicket'
        },
        {
            title: '上传小票日期 ',
            dataIndex: 'ReceiptUploadDate'
        },
        {
            title: '上传小票时间 ',
            dataIndex: 'ReceiptUploadTime'
        },
        {
            title: '上传小票定位差异 ',
            dataIndex: 'ReceiptDistance'
        },
        {
            title: '小票GPS距离超过1公里原因 ',
            dataIndex: 'ReceiptOverDistanceReason'
        },
        {
            title: '小票GPS距离超过1公里说明 ',
            dataIndex: 'ReceiptOverDistanceRemark'
        },
        {
            title: '供应商确认小票GPS超过1公里原因 ',
            dataIndex: 'SupplierConfirmReason'
        },
        {
            title: '用户确认用餐金额 ',
            dataIndex: 'ActualAmount'
        },
        {
            title: '用户确认用餐人数 ',
            dataIndex: 'DinnerNum'
        },
        {
            title: '预订号 ',
            dataIndex: 'BdsOrderId'
        },
        {
            title: '是否预定成功 ',
            dataIndex: 'IsOrderSuccess'
        },
        {
            title: '业务目的 ',
            dataIndex: 'MealPurpose'
        },
        {
            title: '预算金额 ',
            dataIndex: 'MealBudget'
        },
        {
            title: '预算人数 ',
            dataIndex: 'PreDinnerNum'
        },
        {
            title: '手填HCP预算人数 ',
            dataIndex: 'ManualHCPreNum'
        },
        {
            title: '下单备注 ',
            dataIndex: 'OrderRemark'
        },
        {
            title: '预申请审批状态 ',
            dataIndex: 'PreStatus'
        },
        {
            title: '供应商 ',
            dataIndex: 'Supplier'
        },
        {
            title: 'HCP手填用餐人数 ',
            dataIndex: 'ManualHCPDinnerNum'
        },
        {
            title: '小票申请人备注 ',
            dataIndex: 'TicketRemark'
        },
        {
            title: '小票审核状态 ',
            dataIndex: 'TicketStatus'
        },
        {
            title: '小票审核原因 ',
            dataIndex: 'ReceiptCheckRemark'
        },
        {
            title: '小票是否Reopen ',
            dataIndex: 'IsReceiptReopen'
        },
        {
            title: '小票Reopen日期 ',
            dataIndex: 'ReceiptReopenOperateDate'
        },
        {
            title: '小票Reopen时间 ',
            dataIndex: 'ReceiptReopenOperateTime'
        },
        {
            title: '小票Reopen原因 ',
            dataIndex: 'ReceiptReopenReason'
        },
        {
            title: '小票Reopen原因描述 ',
            dataIndex: 'ReceiptReopenReasonDetail'
        },
        {
            title: '小票Reopen备注 ',
            dataIndex: 'ReceiptReopenRemark'
        },
        {
            title: '是否上传支持文件 ',
            dataIndex: 'IsOrderUpload'
        },
        {
            title: '是否系统重新分配 ',
            dataIndex: 'IsTransfer'
        },
        {
            title: '支持文件审批人姓名 ',
            dataIndex: 'CurrentApproverMUDID'
        },
        {
            title: '支持文件审批人MUDID ',
            dataIndex: 'CurrentApproverName'
        },
        {
            title: '支持文件审批日期 ',
            dataIndex: 'CurrentApproveDate'
        },
        {
            title: '支持文件审批时间 ',
            dataIndex: 'CurrentApproveTime'
        },
        {
            title: '支持文件审批状态 ',
            dataIndex: 'UploadState'
        },
        {
            title: '未邀请外部客户原因 ',
            dataIndex: 'NoHCPRemark'
        },
        {
            title: '支持文件审批原因 ',
            dataIndex: 'ApproveRemark'
        },
        {
            title: '支持文件申请人备注 ',
            dataIndex: 'UploadRemark'
        },
        {
            title: '其他支持性文件原因 ',
            dataIndex: 'OtherUploadFileReason'
        },
        {
            title: '其他支持性文件说明 ',
            dataIndex: 'OtherUploadFileExplain'
        },
        {
            title: '是否Re-open ',
            dataIndex: 'IsReopenState'
        },
        {
            title: '支持文件Re-Open日期 ',
            dataIndex: 'ReopenDate'
        },
        {
            title: '支持文件Re-Open时间 ',
            dataIndex: 'ReopenTime'
        },
        {
            title: '支持文件Re-Open原因 ',
            dataIndex: 'ReopenReason'
        },
        {
            title: '支持文件Re-Open原因详述 ',
            dataIndex: 'ReopenReasonDetail'
        },
        {
            title: '是否超预算金额 ',
            dataIndex: 'IsOverBudget'
        },
        {
            title: '是否超人均300 ',
            dataIndex: 'IsOverPre'
        },
        {
            title: '超预算/超人均原因 ',
            dataIndex: 'OverReason'
        },
        {
            title: '是否超季度/月度上限 ',
            dataIndex: 'IsOverMonthQuarter'
        },
        {
            title: '项目组特殊备注 ',
            dataIndex: 'IsSpecialOrderStatus'
        },
        {
            title: '项目组上传文件备注 ',
            dataIndex: 'MailImageSrc'
        },
        {
            title: '是否GFC审批通过 ',
            dataIndex: 'THApprove'
        },
        {
            title: 'GFC审批通过时间 ',
            dataIndex: 'THApprovePassDate'
        },
        {
            title: '是否On-hold ',
            dataIndex: 'OnHoldState'
        },
        {
            title: 'On-hold原因 ',
            dataIndex: 'OnHoldReasonState'
        },
        {
            title: '与用户沟通备注 ',
            dataIndex: 'ReasonForApplier'
        },
        {
            title: '与合规沟通备注 ',
            dataIndex: 'ReasonForPMO'
        },
        {
            title: 'On-hold时间 ',
            dataIndex: 'OnHoldDate'
        },
        {
            title: '是否计次 ',
            dataIndex: 'IssueState'
        },
        {
            title: '计次原因 ',
            dataIndex: 'Reason'
        },
        {
            title: '计次时间 ',
            dataIndex: 'IssueDate'
        },
        {
            title: '是否iSight ',
            dataIndex: 'ISightState'
        },
        {
            title: 'iSight时间 ',
            dataIndex: 'ISightDate'
        },
    ]

    const [personFilter, setPersonFilter] = useState<any[]>([])

    const [mudidFilter, setMudidFilter] = useState<any[]>([])

    const [typeFilter, setTypeFilter] = useState<any[]>([])

    const goFilter = [
        {
            text: '是',
            value: '是'
        },
        {
            text: '否',
            value: '否'
        },
    ]

    useEffect(() => {

        if (detail?.DinersList) {
            const convert = (arr: any[], name: string) => {
                return Array.from(new Set(arr?.map((t) => {
                    return t[name]
                })))?.map((t) => {
                    return {
                        text: t,
                        value: t
                    }
                })
            }

            setMudidFilter(convert(detail?.DinersList, 'DinerId'))

            setPersonFilter(convert(detail?.DinersList, 'DinerName'))

            setTypeFilter(convert(detail?.DinersList, 'DinerType'))
        }


    }, [detail?.DinersList])

    const personColumns: any = [
        {
            title: '用餐人类别',
            dataIndex: 'DinerType',
            filters: typeFilter,
            onFilter: (value: string, record: any) => record.DinerType.indexOf(value) === 0,
        },
        {
            title: '用餐人姓名',
            dataIndex: 'DinerName',
            filters: personFilter,
            onFilter: (value: string, record: any) => record.DinerName.indexOf(value) === 0,
        },
        {
            title: '用餐人ID/MUD ID',
            dataIndex: 'DinerId',
            filters: mudidFilter,
            onFilter: (value: string, record: any) => record.DinerId.indexOf(value) === 0,
        },
        {
            title: '用餐人科室/部门',
            dataIndex: 'DeptName'
        },
        {
            title: '用餐人行政职务/职位',
            dataIndex: 'Position'
        },
        {
            title: '用餐人机构',
            dataIndex: 'Attribute'
        },
        {
            title: '用餐人所在医院',
            dataIndex: 'HospitalName'
        },
        {
            title: 'IF GO',
            dataIndex: 'IsGO',
            filters: goFilter,
            onFilter: (value: string, record: any) => record.IsGO.indexOf(value) === 0,
        }
    ]

    const approvalColumns: any = [
        {
            title: '操作人',
            dataIndex: 'UserName'
        },
        {
            title: '操作人MUDID',
            dataIndex: 'UserId'
        },
        {
            title: '操作',
            dataIndex: 'ActionTypeView'
        },
        {
            title: '审批意见',
            dataIndex: 'Comments'
        },
        {
            title: '操作时间',
            dataIndex: 'ApproveDateView',
            width: 200,
            fixed: 'right'
        }
    ]

    const saveSpecial = () => {
        Modal.confirm({
            title: '是否确认保存？',
            onOk: () => {
                setLoading(true)
                specialForm.validateFields().then((values) => {
                    UpdateConfirmReason({
                        gcode: id,
                        specialType: special,
                        specialReason: values.specialReason
                    }).then((res) => {
                        if (res.data && res.data === 1) {
                            message.success('保存成功！')
                        } else {
                            message.error('保存失败！')
                        }
                    }).finally(() => {
                        setLoading(false)
                    })
                })
            }
        })
    }

    const onHoldTrueNode = (<div>
        <ProForm form={onHoldForm} submitter={false} layout={"vertical"}>
            <Row>
                <Col span={8}>
                    <ProFormSelect
                        label={'onHold原因'}
                        name={'onHoldReason'}
                        required
                        rules={[{required: true, message: '该项必填！'}]}
                        options={[
                            {
                                label: '与用户沟通',
                                value: '1'
                            },
                            {
                                label: '与合规沟通',
                                value: '2'
                            }
                        ]}
                        fieldProps={{
                            onChange: (value) => {
                                setOnHoldReason(value)
                            }
                        }}
                    />
                </Col>
            </Row>
            {(onHoldReason === '1' || onHoldReason === '2') ? <Row>
                <Col span={8}>
                    <ProFormTextArea
                        label={'与用户沟通原因详述'}
                        name={'reasonForApplier'}
                        required
                        rules={[{required: true, message: '该项必填！'}]}
                    />
                </Col>
            </Row> : null}
            {onHoldReason === '2' ? <div>
                <Row>
                    <Col span={8}>
                        <ProFormTextArea
                            label={'与合规沟通原因详述'}
                            name={'reasonForPMO'}
                            rules={[{required: true, message: '该项必填！'}]}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <ProFormRadio.Group
                            label={'最终结果'}
                            name={'lastResult'}
                            options={[
                                {
                                    label: 'iSight',
                                    value: '3'
                                },
                                {
                                    label: '审批通过',
                                    value: '1'
                                }
                            ]}
                            fieldProps={{
                                onChange: (e) => {
                                    setFinalRes(e.target.value)
                                }
                            }}
                        />
                    </Col>
                </Row>
                {finalRes === '3' ? <Row>
                    <Col span={8}>
                        <ProFormText
                            required
                            label={'iSight No.'}
                            name={'isightNo'}
                        />
                    </Col>
                </Row> : null}
            </div> : null}
        </ProForm>
    </div>)

    const onHoldFalseNode = (
        <div>
            <Row style={{display: 'flex', alignItems: 'center'}}>
                <Col span={20}>
                    <ProForm form={decisionForm} submitter={false}>
                        <ProFormRadio.Group
                            label={'审批决定'}
                            required
                            name={'Decision'}
                            rules={[{required: true, message: '该项必填！'}]}
                            options={[
                                {label: '通过', value: 1},
                                {label: 'ReOpen支持文件', value: 2},
                                {label: 'ReOpen小票', value: 3},
                                {label: 'ReOpen支持文件和小票', value: 4},
                            ]}
                            fieldProps={{
                                onChange: (e) => {
                                    setRadioValue(e.target.value)
                                }
                            }}
                        />
                    </ProForm>
                </Col>

            </Row>
            <div>
                {/*{radioValue === 2 ? <ProForm*/}
                {/*    submitter={false}*/}
                {/*    style={{marginTop: 30}}*/}
                {/*    layout={'vertical'}*/}
                {/*    form={approvalForm}*/}
                {/*>*/}
                {/*    <Row>*/}
                {/*        <Col span={8}>*/}
                {/*            <ProFormSelect*/}
                {/*                label={'ReOpen支持文件原因'}*/}
                {/*            />*/}
                {/*        </Col>*/}
                {/*        <Col span={8} offset={1}>*/}
                {/*            <ProFormTextArea*/}
                {/*                label={'ReOpen支持文件原因详述'}*/}
                {/*            />*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*</ProForm> : null}*/}
                {/*{radioValue === 3 ? <ProForm*/}
                {/*    submitter={false}*/}
                {/*    style={{marginTop: 30}}*/}
                {/*    layout={'vertical'}*/}
                {/*    form={approvalForm}*/}
                {/*>*/}

                {/*    <Row>*/}
                {/*        <Col span={8}>*/}
                {/*            <ProFormSelect*/}
                {/*                label={'ReOpen小票原因'}*/}
                {/*            />*/}
                {/*        </Col>*/}
                {/*        <Col span={8} offset={1}>*/}
                {/*            <ProFormSelect*/}
                {/*                label={'ReOpen小票原因详述'}*/}
                {/*            />*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*</ProForm> : null}*/}
                <ProForm
                    submitter={false}
                    layout={'vertical'}
                    form={approvalForm}
                >
                    {(radioValue === 2 || radioValue === 4) ? <Row>
                        <Col span={8}>
                            <ProFormSelect
                                label={'ReOpen支持文件原因'}
                                name={'GFCReopenReason'}
                                required
                                rules={[{required: true, message: '该项必填!'}]}
                                options={detail.MealType === "External Meals" ?
                                    supportFilesListExternal :
                                    supportFilesListInternal
                                }
                                fieldProps={{
                                    mode: 'multiple'
                                }}
                            />
                        </Col>
                        <Col span={8} offset={1}>
                            <ProFormTextArea
                                label={'ReOpen支持文件原因详述'}
                                name={'GFCReopenReasonDetail'}
                                required
                                rules={[{required: true, message: '该项必填!'}]}
                            />
                        </Col>
                    </Row> : null}
                    {(radioValue === 3 || radioValue === 4) ? <Row>
                        <Col span={8}>
                            <ProFormSelect
                                label={'ReOpen小票原因'}
                                name={'TicketReopenReason'}
                                required
                                rules={[{required: true, message: '该项必填!'}]}
                                options={ticketReopenReason}
                                fieldProps={{
                                    onChange: (value) => {
                                        setReopenState(value)
                                    },
                                }}
                            />
                        </Col>
                        <Col span={8} offset={1}>
                            <ProFormSelect
                                label={'ReOpen小票原因详述'}
                                name={'TicketReopenReasonDetail'}
                                required
                                rules={[{required: true, message: '该项必填!'}]}
                                options={reopenState ? (
                                    // reopenState?.map((t)=>{
                                    //     return {...ticketReopenDetail(t)}
                                    // })
                                    ticketReopenDetail[reopenState]
                                    // reopenState?.reduce((accumulator, currentValue)=>{
                                    //     let newValue = JSON.parse(JSON.stringify(accumulator))
                                    //     newValue = [...newValue, ...ticketReopenDetail[currentValue]]
                                    //     return newValue
                                    // },[])
                                ) : []}
                                fieldProps={{
                                    mode: 'multiple'
                                }}
                            />
                        </Col>
                    </Row> : null}
                </ProForm>
            </div>
        </div>
    )

    const approvalNode = (
        <div>

            <Card className={styles.cardStyle} style={{marginTop: 20}}>
                <ProTable
                    columns={orderDetailColumns}
                    search={false}
                    headerTitle={'订单明细'}
                    scroll={{
                        x: 'max-content'
                    }}
                    pagination={false}
                    dataSource={[
                        detail || {}
                    ]}
                    options={{reload: false}}
                />
            </Card>
            <Card className={styles.cardStyle} style={{marginTop: 20}}>
                <ProTable
                    columns={personColumns}
                    search={false}
                    headerTitle={'用餐人'}
                    scroll={{
                        x: 'max-content'
                    }}
                    pagination={false}
                    dataSource={detail?.DinersList || []}
                    options={{reload: false}}
                />
            </Card>
            <Card className={styles.cardStyle} style={{marginTop: 20}}>
                <ProTable
                    columns={approvalColumns}
                    search={false}
                    headerTitle={'操作记录'}
                    scroll={{
                        x: 'max-content'
                    }}
                    pagination={false}
                    dataSource={detail?.ApproveRecordList || []}
                    options={{reload: false}}
                />
            </Card>
            {special ? <Card
                title={'特殊订单'}
                style={{marginTop: 20}}
                className={styles.specialCard}
            >
                <ProForm
                    submitter={false}
                    layout={'vertical'}
                    form={specialForm}
                >
                    <Row>
                        <Col span={11}>
                            <div style={{display: 'flex', alignItems: 'center', paddingLeft: 12}}>
                                特殊订单类型:
                                <div style={{paddingLeft: 10}}>
                                    <Radio.Group disabled={true} value={special} onChange={e => {
                                        setSpecial(e.target.value)
                                    }}>
                                        <Radio value={1}>{'GPS拍照 > 1公里'}</Radio>
                                        <Radio value={2}>未使用GPS拍照</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row style={{marginTop: 20, paddingLeft: 12}}>
                        <Col span={8}>
                            {
                                special === 1 ?
                                    <ProFormSelect
                                        label={'GPS拍摄>1公里原因'}
                                        name={'specialReason'}
                                        required
                                        rules={[{required: true, message: '该项必填！'}]}
                                        options={[
                                            {label: '用户GPS定位偏差', value: '用户GPS定位偏差'},
                                            {label: '用户未在餐厅定位', value: '用户未在餐厅定位'},
                                            {label: '未获取到拍照地位置', value: '未获取到拍照地位置'},
                                        ]}
                                    />
                                    : null
                            }
                            {
                                special === 2 ?
                                    <ProFormSelect
                                        label={'未使用GPS拍照原因'}
                                        name={'specialReason'}
                                        required
                                        rules={[{required: true, message: '该项必填！'}]}
                                        options={[
                                            {label: '用户原因-未使用GPS', value: '用户原因-未使用GPS'},
                                            {label: '技术原因', value: '技术原因'},
                                        ]}
                                    />
                                    : null
                            }
                        </Col>
                        {(special === 1 || special === 2) ? <Col style={{paddingTop: 35, paddingLeft: 10}}>
                            <a
                                className={'orange-a'}
                                onClick={saveSpecial}
                            >保存</a>
                        </Col> : null}
                    </Row>
                </ProForm>
            </Card> : null}
            {disable ? null : <Card
                title={'审批操作'}
                style={{marginTop: 20}}
                className={styles.approvalCard}
            >
                <ProForm
                    submitter={false}
                    layout={'vertical'}
                >
                    <Row>
                        <Col span={8}>
                            <ProForm.Item required label={'OnHold'}>
                                <Select value={onHold} onSelect={(value) => {
                                    setOnHold(value)
                                }}>
                                    <Option value={0}>否</Option>
                                    <Option value={1}>是</Option>
                                </Select>
                            </ProForm.Item>
                        </Col>
                    </Row>
                </ProForm>
                {
                    onHold ? onHoldTrueNode : onHoldFalseNode
                }
            </Card>}
        </div>
    )

    const pictureNode = (
        <ProCard split={'vertical'} style={{height: '80vh'}}>
            <ProCard colSpan={8} style={{overflow: 'hidden', height: '100%', overflowY: 'scroll'}}>
                <div style={{fontSize: 16, fontWeight: 600}}>小票照片</div>
                <Image.PreviewGroup>
                    {
                        detail?.ReceiptList?.length ? detail?.ReceiptList?.map((item: any, index: number) => {
                            return <Image
                                key={`image${index}`}
                                style={{padding: 12}}
                                src={item.ReceiptImage || ''}
                            />
                        }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
                            <Empty/>
                        </Col>
                    }
                </Image.PreviewGroup>
            </ProCard>
            <ProCard colSpan={16} style={{overflow: 'hidden', height: '100%', overflowY: 'scroll'}}>
                <div style={{fontSize: 16, fontWeight: 600}}>用餐照片</div>
                <Row>
                    <Image.PreviewGroup>
                        {
                            detail?.PhotoList?.length ? detail?.PhotoList?.map((item: any, index: number) => {
                                return <Col key={`col-${index}`} xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
                                    <Image
                                        className={'image'}
                                        style={{aspectRatio: 1, objectFit: 'cover'}}
                                        src={item.OrderImage || ''}
                                    />
                                </Col>
                            }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
                                <Empty/>
                            </Col>
                        }
                    </Image.PreviewGroup>
                </Row>
                <Divider/>
                <div style={{fontSize: 16, fontWeight: 600}}>其他文件</div>
                <Row>
                    <Image.PreviewGroup>
                        {
                            detail?.MailImageSrcFileList?.length ? detail?.MailImageSrcFileList?.map((item: any, index: number) => {
                                return <Col key={`col-${index}`} xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
                                    <Image
                                        className={'image'}
                                        style={{aspectRatio: 1, objectFit: 'cover'}}
                                        src={item.MailImageSrcFile || ''}
                                    />
                                </Col>
                            }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
                                <Empty/>
                            </Col>
                        }
                    </Image.PreviewGroup>
                </Row><Divider/>
                <div style={{fontSize: 16, fontWeight: 600}}>未使用GPS拍照支持文件</div>
                <Row>
                    <Image.PreviewGroup>
                        {
                            detail?.WithoutGPSFileList?.length ? detail?.WithoutGPSFileList?.map((item: any, index: number) => {
                                return <Col key={`col-${index}`} xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
                                    <Image
                                        className={'image'}
                                        style={{aspectRatio: 1, objectFit: 'cover'}}
                                        src={item.WithoutGPSFile || ''}
                                    />
                                </Col>
                            }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
                                <Empty/>
                            </Col>
                        }
                    </Image.PreviewGroup>
                </Row>
            </ProCard>
        </ProCard>
    )

    const handleSubmit = () => {

        Promise.all([
            specialForm.validateFields(),
            onHoldForm.validateFields(),
            approvalForm.validateFields(),
            decisionForm.validateFields()
        ]).then((values) => {

            const onHoldValues = values[1]
            const approvalValues = values[2]
            const decisionForm = values[3]

            let submitValues: any = {
                gcode: id,
                // Decision: decisionForm?.Decision,
                onHold: onHold,
                THApproveState: detail.THApproveState
            }

            if (onHold) {
                //客户沟通
                if (onHoldValues.onHoldReason === '1') {
                    submitValues.forApplier = 1
                    submitValues.forPMO = 0
                }

                // 合规沟通
                if (onHoldValues.onHoldReason === '2') {
                    submitValues.forApplier = 0
                    submitValues.forPMO = 1
                    submitValues.reasonForPMO = onHoldValues.reasonForPMO
                }
                submitValues.isReopen = detail.isReopen || 0
                submitValues.uid = detail.UID
                submitValues.reasonForApplier = onHoldValues.reasonForApplier

                //是否修改过与员工沟通原因
                if (detail?.ReasonForApplier !== submitValues?.ReasonForApplier) {
                    submitValues.changeForApplier = 1
                } else {
                    submitValues.changeForApplier = 0
                }

                //是否修改过与合规沟通原因
                if (detail?.ReasonForPMO !== submitValues?.ReasonForPMO) {
                    submitValues.changeForPMO = 1
                } else {
                    submitValues.changeForPMO = 0
                }

                //iSight
                if (finalRes === '3') {
                    submitValues.lastResult = '3'
                    submitValues.isightNo = onHoldValues.isightNo
                } else {
                    //审批通过
                    if (finalRes === '1') {
                        submitValues.lastResult = '1'
                    } else {
                        //不勾选审批结果
                        submitValues.lastResult = '0'
                    }
                }
            } else {
                //非onHold情况
                if (approvalValues.TicketReopenReasonDetail) {
                    approvalValues.TicketReopenReasonDetail = JSON.stringify(approvalValues.TicketReopenReasonDetail)
                    approvalValues.GFCReopenReason = JSON.stringify(approvalValues.GFCReopenReason)
                }

                submitValues = {
                    ...submitValues,
                    Decision: decisionForm?.Decision,
                    ...approvalValues
                }
            }

            submitValues = stringifyNumbers(submitValues)

            ApprovalDecision({
                ...submitValues
            }).then((res) => {
                if (res.txt === '操作成功') {
                    onCancel()
                    initAllState()
                    actionRef?.current?.reload()
                    message.success('操作成功!')
                } else {
                    message.error(res.txt)
                }
            })

        }).catch((err) => {
            message.error('存在未填必填项！')
        })
    }

    return <Modal
        open={open}
        onCancel={() => {
            onCancel()
            initAllState()
        }}
        title={'订单审批'}
        width={'80%'}
        destroyOnClose
        footer={<div>
            {(info && submitButtonVisible) ? <Button
                style={{marginLeft: 5, width: 78}}
                type={'primary'}
                disabled={activeKey === '2' || disable}
                onClick={() => {
                    Modal.confirm({
                        title: '是否确认提交?',
                        onOk: () => {
                            handleSubmit()
                        }
                    })
                }}
            >提交</Button> : null}
            <Button
                style={{marginLeft: 5, width: 78}}
                onClick={() => {
                    onCancel()
                    initAllState()
                }}
            >取消</Button>
        </div>}
    >
        <Spin spinning={loading}>
            <Tabs
                items={[
                    {
                        label: '审批操作',
                        key: '1',
                        children: approvalNode
                    },
                    {
                        label: '订单照片',
                        key: '2',
                        children: pictureNode
                    }
                ]}
                destroyInactiveTabPane
                activeKey={activeKey}
                onTabClick={(key: string) => {
                    setActiveKey(key)
                }}
            />
        </Spin>
    </Modal>
}

export default Detail