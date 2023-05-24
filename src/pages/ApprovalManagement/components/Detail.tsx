import React, {FC, useEffect, useMemo, useRef, useState} from "react";
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
import {ExternalList, InnerList, ticketReopenDetail, ticketReopenReason} from "./data";
import {stringifyNumbers} from "@/utils/format";
import moment from "moment";
import ZoomViewer from "@/components/ZoomViewer";
import Viewer from 'react-viewer';

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

    const [iSightDisable, setISightDisable] = useState(false)

    const [viewerVisible, setViewerVisible] = useState('')

    const [currentIndex, setCurrentIndex] = useState<number>(0)

    // 特殊订单form
    const [specialForm] = ProForm.useForm()

    const [onHoldForm] = ProForm.useForm()

    const [approvalForm] = ProForm.useForm()

    const [decisionForm] = ProForm.useForm()

    const [disable, setDisable] = useState(false)

    const needSaveRef = useRef(false)

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
        setISightDisable(false)
        specialForm.resetFields()
        onHoldForm.resetFields()
        approvalForm.resetFields()
        decisionForm.resetFields()
        needSaveRef.current = false
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
                    (values.OnHold === 0 && values.OnHoldReason === 0) ||
                    (values.OnHold === 0 && values.OnHoldReason === 1)
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

            if (values.OnHoldReason === 2) {
                setISightDisable(true)
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
                htcode: id
            }).then((res) => {
                if (res.state && res.state === 1) {
                    setInitState(res.data)
                    if (res.data.IsSpecialOrder === 4) {
                        // 未使用GPS
                        setSpecial(4)
                        specialForm.setFieldsValue({
                            specialReason: res.data.GFCConfirmWithoutGPSReason
                        })
                        if (!res.data.GFCConfirmWithoutGPSReason) {
                            needSaveRef.current = true
                        }
                    } else if (res.data.IsOverDistance === 1) {
                        // 超过1公里
                        setSpecial(1)
                        specialForm.setFieldsValue({
                            specialReason: res.data.GFCConfirmReason
                        })
                        if (!res.data.GFCConfirmReason) {
                            needSaveRef.current = true
                        }
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
            title: '会议类型',
            dataIndex: 'MeetingTypeValue'
        },
        {
            title: 'HT编号',
            dataIndex: 'HTCode'
        },
        {
            title: '会议日期',
            dataIndex: 'MeetingDate'
        },
        {
            title: '会议时间',
            dataIndex: 'MeetingTime'
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
            title: '申请人职位',
            dataIndex: 'Position'
        },
        {
            title: '申请人手机号码',
            dataIndex: 'ApplierMobile'
        },
        {
            title: 'Market',
            dataIndex: 'Market'
        },
        {
            title: 'Meeting ID',
            dataIndex: 'MeetingID'
        },
        {
            title: 'TA',
            dataIndex: 'TA'
        },
        {
            title: '省份',
            dataIndex: 'Province'
        },
        {
            title: '城市',
            dataIndex: 'City'
        },
        {
            title: '医院编码',
            dataIndex: 'HospitalCode'
        },
        {
            title: '医院名称',
            dataIndex: 'HospitalName'
        },
        {
            title: '医院地址',
            dataIndex: 'HospitalAddress'
        },
        {
            title: '会议名称',
            dataIndex: 'MeetingName'
        },
        {
            title: '参会人数',
            dataIndex: 'AttendCount'
        },
        {
            title: '大区区域代码',
            dataIndex: 'CostCenter'
        },
        {
            title: '供应商',
            dataIndex: 'Supplier'
        },
        {
            title: '订单号',
            dataIndex: 'EnterpriseOrderId'
        },
        {
            title: '送餐日期',
            dataIndex: 'DeliverTime'
        },
        {
            title: '用餐人数',
            dataIndex: 'DinersCount'
        },
        {
            title: '预订金额',
            dataIndex: 'TotalPrice',
            // render: (item: any) => {
            //     if (item) {
            //         return parseFloat(item).toFixed(2)
            //     }
            // }
        },
        {
            title: '实际金额',
            dataIndex: 'ActualAmount',
            // render: (item: any) => {
            //     if (item) {
            //         return parseFloat(item).toFixed(2)
            //     }
            // }
        },
        {
            title: '实际用餐人数',
            dataIndex: 'RealCount'
        },
        {
            title: '确认收餐日期',
            dataIndex: 'ReceiveDate'
        },
        {
            title: '用户确认金额',
            dataIndex: 'RealPrice',
            // render: (item: any) => {
            //     if (item) {
            //         return parseFloat(item).toFixed(2)
            //     }
            // }
        },
        {
            title: '餐厅名称',
            dataIndex: 'RestaurantName'
        },
        {
            title: '是否上传文件',
            dataIndex: 'IsOrderUpload'
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
            dataIndex: 'WithoutGPSRemark'
        },
        {
            title: '三方确认未使用GPS拍照原因',
            dataIndex: 'GFCConfirmWithoutGPSReason'
        },
        {
            title: '照片拍摄时间',
            dataIndex: 'FilmingTime'
        },
        {
            title: '拍摄地名称',
            dataIndex: 'Location'
        },
        {
            title: '拍摄地地址',
            dataIndex: 'LocationAddress'
        },
        {
            title: '与医院/餐厅地址距离（公里）',
            dataIndex: 'Distance'
        },
        {
            title: 'GPS拍照超过容错距离原因',
            dataIndex: 'OverDistanceReason'
        },
        {
            title: 'GPS拍照超过容错距离说明',
            dataIndex: 'OverDistanceRemark'
        },
        {
            title: '三方确认GPS拍照超过容错距离原因',
            dataIndex: 'GFCConfirmReason'
        },
        {
            title: '是否重新分配',
            dataIndex: 'IsTransfer'
        },
        {
            title: '上传文件审批直线经理姓名',
            dataIndex: 'BUHeadName'
        },
        {
            title: '上传文件审批直线经理MUDID',
            dataIndex: 'BUHeadMUDID'
        },
        {
            title: '上传文件审批日期',
            dataIndex: 'BUHeadApproveDate'
        },
        {
            title: '上传文件审批状态',
            dataIndex: 'UploadState'
        },
        {
            title: '签到人数是否等于实际用餐人数',
            dataIndex: 'IsAttentSame'
        },
        {
            title: '签到人数调整原因',
            dataIndex: 'AttentSameReason'
        },
        {
            title: '是否与会议信息一致',
            dataIndex: 'IsMeetingInfoSame'
        },
        {
            title: '会议信息不一致原因',
            dataIndex: 'MeetingInfoSameReason'
        },
        {
            title: '退单原因/未送达会议未正常召开原因/会议文件丢失原因',
            dataIndex: 'SpecialReason'
        },
        {
            title: '上传文件备注',
            dataIndex: 'UploadRemark'
        },
        {
            title: '上传文件是否Re-Open',
            dataIndex: 'IsReopenState'
        },
        {
            title: '上传文件Re-Open操作人',
            dataIndex: 'ReopenOperatorName'
        },
        {
            title: '上传文件Re-Open操作人MUDID',
            dataIndex: 'ReopenOperatorMUDID'
        },
        {
            title: '上传文件Re-Open日期',
            dataIndex: 'ReopenOperateDate'
        },
        {
            title: '上传文件Re-Open时间',
            dataIndex: 'ReopenOperateTime'
        },
        {
            title: '上传文件Re-Open发起人姓名',
            dataIndex: 'ReopenOriginatorName'
        },
        {
            title: '上传文件Re-Open发起人MUDID',
            dataIndex: 'ReopenOriginatorMUDID'
        },
        {
            title: '上传文件Re-Open原因',
            dataIndex: 'ReopenReason'
        },
        {
            title: '上传文件Re-Open原因详述',
            dataIndex: 'ReopenRemark'
        },
        {
            title: '上传文件Re-Open审批状态',
            dataIndex: 'ReopenUploadState'
        },
        {
            title: '上传文件是否重新分配审批人',
            dataIndex: 'IsReAssign'
        },
        {
            title: '上传文件重新分配审批人姓名',
            dataIndex: 'ReAssignBUHeadName'
        },
        {
            title: '上传文件重新分配审批人MUDID',
            dataIndex: 'ReAssignBUHeadMUDID'
        },
        {
            title: '金额调整原因',
            dataIndex: 'XmsOrderReason'
        },
        {
            title: '是否申请退单',
            dataIndex: 'IsCancel'
        },
        {
            title: '是否退单成功',
            dataIndex: 'IsCancelSuccess'
        },
        {
            title: '是否收餐/未送达',
            dataIndex: 'IsReceive'
        },
        {
            title: '是否与预定餐品一致',
            dataIndex: 'IsMealSame'
        },
        {
            title: '用户确认金额调整原因',
            dataIndex: 'RealPriceChangeReason'
        },
        {
            title: '用户确认金额调整备注',
            dataIndex: 'RealPriceChangeRemark'
        },
        {
            title: '实际用餐人数调整原因',
            dataIndex: 'RealCountChangeReason'
        },
        {
            title: '实际用餐人数调整备注',
            dataIndex: 'RealCountChangeRemrak'
        },
        {
            title: '订单状态',
            dataIndex: 'OrderState'
        },
        {
            title: '项目组特殊备注',
            dataIndex: 'IsSpecialOrderStatus'
        },
        {
            title: 'GFC审核状态',
            dataIndex: 'GFCApproveState'
        },
        {
            title: '是否GFC审批通过',
            dataIndex: 'THApprove'
        },
        {
            title: 'GFC审批通过时间',
            dataIndex: 'THApprovePassDate'
        },
        {
            title: '是否On-hold',
            dataIndex: 'OnHoldState'
        },
        {
            title: 'On-hold原因',
            dataIndex: 'OnHoldReasonState',
        },
        {
            title: '首次与用户沟通时间',
            dataIndex: 'ForApplierDate',
        },
        {
            title: '与用户沟通备注',
            dataIndex: 'ReasonForApplier'
        },
        {
            title: '首次与合规沟通时间',
            dataIndex: 'ForPMODate',
        },
        {
            title: '与合规沟通备注',
            dataIndex: 'ReasonForPMO'
        },
        {
            title: 'On-hold时间',
            dataIndex: 'OnHoldDate'
        },
        {
            title: '是否计次',
            dataIndex: 'IssueState'
        },
        {
            title: '计次原因',
            dataIndex: 'IssueReason'
        },
        {
            title: '计次时间',
            dataIndex: 'IssueDate'
        },
        {
            title: '是否iSight',
            dataIndex: 'ISightState'
        },
        {
            title: 'iSight时间',
            dataIndex: 'ISightDate'
        },
        {
            title: 'iSight No.',
            dataIndex: 'ISightNo'
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
            dataIndex: 'ActionType'
        },
        {
            title: '审批意见',
            dataIndex: 'Comments'
        },
        {
            title: '操作时间',
            dataIndex: 'ApproveDate',
            width: 200,
            fixed: 'right'
        }
    ]

    const saveSpecial = () => {
        specialForm.validateFields().then(() => {
            Modal.confirm({
                title: '是否确认保存？',
                maskClosable: false,
                onOk: () => {
                    setLoading(true)
                    specialForm.validateFields().then((values) => {

                        let specialValue = 0

                        if (special === 1) {
                            specialValue = 1
                        }

                        if (special === 4) {
                            specialValue = 2
                        }

                        UpdateConfirmReason({
                            htcode: id,
                            specialType: specialValue,
                            specialReason: values.specialReason
                        }).then((res) => {
                            if (res.data && res.data === 1) {
                                needSaveRef.current = false
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
        })
    }

    const onHoldTrueNode = (<div>
        <ProForm form={onHoldForm} submitter={false} layout={"vertical"}>
            <Row>
                <Col span={8}>
                    <ProFormSelect
                        label={'OnHold原因'}
                        name={'onHoldReason'}
                        required
                        disabled={iSightDisable}
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
                                onHoldForm.setFieldsValue({
                                    lastResult: '',
                                    reasonForPMO: ''
                                })
                                setFinalRes('0')
                                setOnHoldReason(value)
                            }
                        }}
                    />
                </Col>
            </Row>
            {(onHoldReason === '1' || onHoldReason === '2') ? <Row>
                <Col span={8}>
                    <ProFormTextArea
                        label={'与用户沟通备注'}
                        name={'reasonForApplier'}
                        disabled={iSightDisable}
                        required
                        rules={[{required: true, message: '该项必填！'}]}
                    />
                </Col>
            </Row> : null}
            {onHoldReason === '2' ? <div>
                <Row>
                    <Col span={8}>
                        <ProFormTextArea
                            label={'与合规沟通备注'}
                            name={'reasonForPMO'}
                            rules={[{required: true, message: '该项必填！'}]}
                        />
                    </Col>
                </Row>
                {detail?.ReasonForPMO ? <Row>
                    <Col span={8}>
                        <ProForm.Item
                            label={'最终结果'}
                            name={'lastResult'}
                        >
                            <Radio.Group
                                value={finalRes}
                                // onChange={(e) => {
                                //     setFinalRes(e.target.value)
                                // }}
                            >
                                <Radio
                                    value={'3'}
                                    onClick={(e: any) => {
                                        if (e.target?.value === finalRes) {
                                            setFinalRes('0')
                                            onHoldForm.setFieldsValue({
                                                lastResult: null
                                            })
                                        } else {
                                            setFinalRes(e.target.value)
                                        }
                                    }}
                                >iSight</Radio>
                                <Radio
                                    value={'1'}
                                    onClick={(e: any) => {
                                        if (e.target?.value === finalRes) {
                                            setFinalRes('0')
                                            onHoldForm.setFieldsValue({
                                                lastResult: null
                                            })
                                        } else {
                                            setFinalRes(e.target.value)
                                        }
                                    }}
                                >审批通过</Radio>
                            </Radio.Group>
                        </ProForm.Item>
                        {/*<ProFormRadio.Group*/}
                        {/*    label={'最终结果'}*/}
                        {/*    name={'lastResult'}*/}
                        {/*    options={[*/}
                        {/*        {*/}
                        {/*            label: 'iSight',*/}
                        {/*            value: '3'*/}
                        {/*        },*/}
                        {/*        {*/}
                        {/*            label: '审批通过',*/}
                        {/*            value: '1'*/}
                        {/*        }*/}
                        {/*    ]}*/}
                        {/*    fieldProps={{*/}
                        {/*        onChange: (e) => {*/}
                        {/*            setFinalRes(e.target.value)*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </Col>
                </Row> : null}
                {finalRes === '3' ? <Row>
                    <Col span={8}>
                        <ProFormText
                            required
                            rules={[{required: true, message: '该项必填！'}]}
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
                                // {label: 'ReOpen小票', value: 3},
                                // {label: 'ReOpen支持文件和小票', value: 4},
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
                                options={detail.MeetingTypeValue === "院内会" ?
                                    InnerList :
                                    ExternalList
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
                                        approvalForm.setFieldsValue({
                                            TicketReopenReasonDetail: []
                                        })
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
            {/*<Card className={styles.cardStyle} style={{marginTop: 20}}>*/}
            {/*    <ProTable*/}
            {/*        columns={personColumns}*/}
            {/*        search={false}*/}
            {/*        headerTitle={'用餐人'}*/}
            {/*        scroll={{*/}
            {/*            x: 'max-content'*/}
            {/*        }}*/}
            {/*        pagination={false}*/}
            {/*        dataSource={detail?.DinersList || []}*/}
            {/*        options={{reload: false}}*/}
            {/*    />*/}
            {/*</Card>*/}
            <Card className={styles.cardStyle} style={{marginTop: 20}}>
                <ProTable
                    columns={approvalColumns}
                    search={false}
                    headerTitle={'操作记录'}
                    // toolBarRender={() => {
                    //     return [<Tooltip
                    //         key={'downloadTooltip'}
                    //         title={'下载'}
                    //     >
                    //         <DownloadOutlined
                    //             key={'download'}
                    //             className={styles.downloadStyle}
                    //             style={{
                    //                 fontSize: 16,
                    //                 marginInline: 2,
                    //                 width: 16,
                    //                 cursor: 'pointer'
                    //             }}/></Tooltip>]
                    // }}
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
                                        <Radio value={1}>超容错距离</Radio>
                                        <Radio value={4}>未使用GPS拍照</Radio>
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
                                        label={'超容错距离原因'}
                                        name={'specialReason'}
                                        required
                                        rules={[{required: true, message: '该项必填！'}]}
                                        options={[
                                            {label: '主院区申请HT，分院区开会', value: '主院区申请HT，分院区开会'},
                                            {label: '医院Veeva经纬度偏差', value: '医院Veeva经纬度偏差'},
                                            {label: '用户GPS定位偏差', value: '用户GPS定位偏差'},
                                            {label: '用户未在目标医院定位', value: '用户未在目标医院定位'},
                                            {label: '未获取到拍照地位置', value: '未获取到拍照地位置'},
                                        ]}
                                    />
                                    : null
                            }
                            {
                                special === 4 ?
                                    <ProFormSelect
                                        label={'未使用GPS拍照原因'}
                                        name={'specialReason'}
                                        required
                                        rules={[{required: true, message: '该项必填！'}]}
                                        options={[
                                            {label: '用户原因-未使用GPS', value: '用户原因-未使用GPS'},
                                            {label: '技术原因', value: '技术原因'},
                                            {label: '会议取消', value: '会议取消'},
                                        ]}
                                    />
                                    : null
                            }
                        </Col>
                        {(special === 1 || special === 4) ? <Col style={{paddingTop: 35, paddingLeft: 10}}>
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
                                <Select
                                    value={onHold}
                                    disabled={iSightDisable}
                                    onSelect={(value) => {
                                        setOnHold(value)
                                    }}
                                >
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

    const signInNode = useMemo(() => {
        return ((detail?.SignInList?.length || 0) + (detail?.ReceiptList?.length || 0)) ?
            (
                <div>
                    {
                        detail?.SignInList?.length ? detail?.SignInList?.map((item: any, index: number) => {
                            return <ZoomViewer
                                index={index}
                                key={`signIn-${index}`}
                                id={`signIn-${index}`}
                                style={{aspectRatio: 0.7, objectFit: 'cover', padding: 12}}
                                src={item.SignInImage || ''}
                                handleFullScreen={() => {
                                    setCurrentIndex(index)
                                    setViewerVisible('signIn')
                                }}
                                defaultScale={1.2}
                                zoomSpeed={0.1}
                            />
                        }) : null
                    }
                    {detail?.ReceiptList?.length ?
                        <div style={{fontSize: 16, fontWeight: 600}}>小票照片</div> : null}
                    {
                        detail?.ReceiptList?.length ? detail?.ReceiptList?.map((item: any, index: number) => {
                            return <ZoomViewer
                                index={index}
                                key={`receipt-${index}`}
                                id={`receipt-${index}`}
                                style={{aspectRatio: 0.7, objectFit: 'cover', padding: 12}}
                                src={item.ReceiptImage || ''}
                                handleFullScreen={() => {
                                    setCurrentIndex(index)
                                    setViewerVisible('receipt')
                                }}
                                defaultScale={1.2}
                                zoomSpeed={0.1}
                            />
                        }) : null
                    }
                </div>
            )
            : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
                <Empty/>
            </Col>

    }, [detail])

    const meetingNode = useMemo(() => {
        return detail?.PhotoList?.length ? detail?.PhotoList?.map((item: any, index: number) => {
            return <Col key={`col-${index}`} xl={{span: 12}} xxl={{span: 12}} style={{padding: 12}}>
                <ZoomViewer
                    index={index}
                    id={`meal-${index}`}
                    src={item.OrderImage || ''}
                    style={{aspectRatio: 1, objectFit: 'cover'}}
                    handleFullScreen={() => {
                        setCurrentIndex(index)
                        setViewerVisible('photo')
                    }}
                    defaultScale={1.8}
                    zoomSpeed={0.1}
                />
            </Col>
        }) : <Col xl={{span: 12}} xxl={{span: 12}} style={{padding: 12}}>
            <Empty/>
        </Col>

    }, [detail])

    const otherListNode = useMemo(() => {
        return detail?.MailImageSrcFileList?.length ? detail?.MailImageSrcFileList?.map((item: any, index: number) => {
            return <Col key={`col-${index}`} xl={{span: 12}} xxl={{span: 12}} style={{padding: 12}}>
                <ZoomViewer
                    index={index}
                    id={`other-${index}`}
                    src={item.MailImageSrcFile || ''}
                    style={{aspectRatio: 1, objectFit: 'cover'}}
                    handleFullScreen={() => {
                        setCurrentIndex(index)
                        setViewerVisible('other')
                    }}
                    defaultScale={1.8}
                    zoomSpeed={0.1}
                />
            </Col>
        }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
            <Empty/>
        </Col>

    }, [detail])

    const gpsListNode = useMemo(() => {
        return detail?.WithoutGPSFileList?.length ? detail?.WithoutGPSFileList?.map((item: any, index: number) => {
            return <Col key={`col-${index}`} xl={{span: 12}} xxl={{span: 12}} style={{padding: 12}}>
                <ZoomViewer
                    index={index}
                    id={`gps-${index}`}
                    src={item.WithoutGPSFile || ''}
                    style={{aspectRatio: 1, objectFit: 'cover'}}
                    handleFullScreen={() => {
                        setCurrentIndex(index)
                        setViewerVisible('gps')
                    }}
                    defaultScale={1.8}
                    zoomSpeed={0.1}
                />
            </Col>
        }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>
            <Empty/>
        </Col>

    }, [detail])

    const pictureNode = (
        <ProCard split={'vertical'} style={{height: '80vh'}}>
            <ProCard colSpan={8} style={{overflow: 'hidden', height: '100%', overflowY: 'scroll'}}>
                <div style={{fontSize: 16, fontWeight: 600}}>签到表照片</div>
                {signInNode}
                <Viewer
                    images={detail?.SignInList?.length ?
                        detail?.SignInList?.map((item: any) => {
                            return {
                                src: item.SignInImage
                            }
                        })
                        : []}
                    visible={viewerVisible === 'signIn'}
                    onClose={() => {
                        setCurrentIndex(0)
                        setViewerVisible('')
                    }}
                    activeIndex={currentIndex}
                    onChange={(_, index) => {
                        setCurrentIndex(index)
                    }}
                    scalable={false}
                />
                <Viewer
                    images={detail?.ReceiptList?.length ?
                        detail?.ReceiptList?.map((item: any) => {
                            return {
                                src: item.ReceiptImage
                            }
                        })
                        : []}
                    visible={viewerVisible === 'receipt'}
                    onClose={() => {
                        setCurrentIndex(0)
                        setViewerVisible('')
                    }}
                    activeIndex={currentIndex}
                    onChange={(_, index) => {
                        setCurrentIndex(index)
                    }}
                    scalable={false}
                />
                {/*<Image.PreviewGroup>*/}
                {/*    {*/}
                {/*        ((detail?.SignInList?.length || 0) + (detail?.ReceiptList?.length || 0)) ?*/}
                {/*            <>*/}
                {/*                {detail?.SignInList?.map((item: any, index: number) => {*/}
                {/*                    return <Image*/}
                {/*                        key={`image${index}`}*/}
                {/*                        style={{padding: 12}}*/}
                {/*                        src={item.SignInImage || ''}*/}
                {/*                    />*/}
                {/*                })}*/}

                {/*                {detail?.ReceiptList?.length ?*/}
                {/*                    <div style={{fontSize: 16, fontWeight: 600}}>小票照片</div> : null}*/}

                {/*                {detail?.ReceiptList?.map((item: any, index: number) => {*/}
                {/*                    return <Image*/}
                {/*                        key={`image${index}`}*/}
                {/*                        style={{padding: 12}}*/}
                {/*                        src={item.ReceiptImage || ''}*/}
                {/*                    />*/}
                {/*                })}*/}
                {/*            </>*/}
                {/*            : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>*/}
                {/*                <Empty/>*/}
                {/*            </Col>*/}
                {/*    }*/}
                {/*</Image.PreviewGroup>*/}
            </ProCard>
            <ProCard colSpan={16} style={{overflow: 'hidden', height: '100%', overflowY: 'scroll'}}>
                <div style={{fontSize: 16, fontWeight: 600}}>会议照片</div>
                <Row>
                    {/*<Image.PreviewGroup>*/}
                    {/*    {*/}
                    {/*        detail?.PhotoList?.length ? detail?.PhotoList?.map((item: any, index: number) => {*/}
                    {/*            return <Col key={`col-${index}`} xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>*/}
                    {/*                <Image*/}
                    {/*                    className={'image'}*/}
                    {/*                    style={{aspectRatio: 1, objectFit: 'cover'}}*/}
                    {/*                    src={item.OrderImage || ''}*/}
                    {/*                />*/}
                    {/*            </Col>*/}
                    {/*        }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>*/}
                    {/*            <Empty/>*/}
                    {/*        </Col>*/}
                    {/*    }*/}
                    {/*</Image.PreviewGroup>*/}
                    {meetingNode}
                    <Viewer
                        images={detail?.PhotoList?.length ?
                            detail?.PhotoList?.map((item: any) => {
                                return {
                                    src: item.OrderImage
                                }
                            })
                            : []}
                        visible={viewerVisible === 'photo'}
                        onClose={() => {
                            setCurrentIndex(0)
                            setViewerVisible('')
                        }}
                        activeIndex={currentIndex}
                        onChange={(_, index) => {
                            setCurrentIndex(index)
                        }}
                        scalable={false}
                    />
                </Row>
                <Divider/>
                <div style={{fontSize: 16, fontWeight: 600}}>其他文件</div>
                <Row>
                    {/*<Image.PreviewGroup>*/}
                    {/*    {*/}
                    {/*        detail?.MailImageSrcFileList?.length ? detail?.MailImageSrcFileList?.map((item: any, index: number) => {*/}
                    {/*            return <Col key={`col-${index}`} xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>*/}
                    {/*                <Image*/}
                    {/*                    className={'image'}*/}
                    {/*                    style={{aspectRatio: 1, objectFit: 'cover'}}*/}
                    {/*                    src={item.MailImageSrcFile || ''}*/}
                    {/*                />*/}
                    {/*            </Col>*/}
                    {/*        }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>*/}
                    {/*            <Empty/>*/}
                    {/*        </Col>*/}
                    {/*    }*/}
                    {/*</Image.PreviewGroup>*/}
                    {otherListNode}
                    <Viewer
                        images={detail?.MailImageSrcFileList?.length ?
                            detail?.MailImageSrcFileList?.map((item: any) => {
                                return {
                                    src: item.MailImageSrcFile
                                }
                            })
                            : []}
                        visible={viewerVisible === 'other'}
                        onClose={() => {
                            setCurrentIndex(0)
                            setViewerVisible('')
                        }}
                        activeIndex={currentIndex}
                        onChange={(_, index) => {
                            setCurrentIndex(index)
                        }}
                        scalable={false}
                    />
                </Row>
                <Divider/>
                <div style={{fontSize: 16, fontWeight: 600}}>未使用GPS拍照支持文件</div>
                <Row>
                    {/*<Image.PreviewGroup>*/}
                    {/*    {*/}
                    {/*        detail?.WithoutGPSFileList?.length ? detail?.WithoutGPSFileList?.map((item: any, index: number) => {*/}
                    {/*            return <Col key={`col-${index}`} xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>*/}
                    {/*                <Image*/}
                    {/*                    className={'image'}*/}
                    {/*                    style={{aspectRatio: 1, objectFit: 'cover'}}*/}
                    {/*                    src={item.WithoutGPSFile || ''}*/}
                    {/*                />*/}
                    {/*            </Col>*/}
                    {/*        }) : <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 12}}>*/}
                    {/*            <Empty/>*/}
                    {/*        </Col>*/}
                    {/*    }*/}
                    {/*</Image.PreviewGroup>*/}
                    {gpsListNode}
                    <Viewer
                        images={detail?.WithoutGPSFileList?.length ?
                            detail?.WithoutGPSFileList?.map((item: any) => {
                                return {
                                    src: item.WithoutGPSFile
                                }
                            })
                            : []}
                        visible={viewerVisible === 'gps'}
                        onClose={() => {
                            setCurrentIndex(0)
                            setViewerVisible('')
                        }}
                        activeIndex={currentIndex}
                        onChange={(_, index) => {
                            setCurrentIndex(index)
                        }}
                        scalable={false}
                    />
                </Row>
            </ProCard>
        </ProCard>
    )

    const handleSubmit = () => {

        if (needSaveRef.current && (decisionForm.getFieldsValue().Decision === 1 || onHoldForm.getFieldsValue().lastResult === '1')) {
            message.error('请先保存特殊订单！')
            return
        }

        if ((detail.THApproveState === 1) && (decisionForm.getFieldsValue().Decision === 1)) {
            message.error('请不要重复提交相同的审批结果！')
            return
        }

        const promiseArr = (decisionForm.getFieldsValue().Decision === 1) ? [
            onHoldForm.validateFields(),
            approvalForm.validateFields(),
            decisionForm.validateFields(),
            specialForm.validateFields(),
        ] : [
            onHoldForm.validateFields(),
            approvalForm.validateFields(),
            decisionForm.validateFields()
        ]

        Promise.all(promiseArr).then((values) => {

            const onHoldValues = values[0]
            const approvalValues = values[1]
            const decisionForm = values[2]

            let submitValues: any = {
                htcode: id,
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
                submitValues.isReopen = detail.IsReopen || 0

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
                    approvalValues.TicketReopenReasonDetail = approvalValues.TicketReopenReasonDetail?.reduce((newVal: string, current: string) => {
                        let str
                        if (!newVal) {
                            str = current
                        } else {
                            str = newVal + ',' + current
                        }
                        return str
                    }, '')
                }

                if (approvalValues.GFCReopenReason) {
                    approvalValues.GFCReopenReason = approvalValues.GFCReopenReason?.reduce((newVal: string, current: string) => {
                        let str
                        if (!newVal) {
                            str = current
                        } else {
                            str = newVal + ',' + current
                        }
                        return str
                    }, '')
                }

                submitValues = {
                    ...submitValues,
                    Decision: decisionForm?.Decision,
                    ...approvalValues
                }
            }

            submitValues = stringifyNumbers(submitValues)

            setLoading(true)
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

        }).catch((err: any) => {
            message.error('存在未填必填项！')
        }).finally(() => {
            setLoading(false)
        })
    }

    return <Modal
        open={open}
        maskClosable={false}
        onCancel={() => {
            onCancel()
            initAllState()
        }}
        title={'订单审批'}
        width={'100%'}
        destroyOnClose
        footer={<div>
            {(info && submitButtonVisible) ? <Button
                style={{marginLeft: 5, width: 78}}
                type={'primary'}
                disabled={activeKey === '2' || disable}
                onClick={() => {
                    Modal.confirm({
                        title: '是否确认提交?',
                        maskClosable: false,
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
