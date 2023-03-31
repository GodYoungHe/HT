import {PageContainer} from "@ant-design/pro-components";
import {Card, Col, Row} from "antd";
import styles from './index.less'
import {
    CheckCircleFilled,
    ClockCircleFilled,
    CloseCircleFilled,
    HourglassFilled,
    PieChartFilled
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {LoadSummary} from "@/pages/Home/service";

const HomePage: React.FC = () => {

    const [data, setData] = useState<any>(null)


    useEffect(() => {

        LoadSummary().then((res) => {
            if (res?.state && res.state === 1) {
                setData(res)
            }
        })
    }, [])

    const middleCardNode = (title:string, description: string, count: string, color: string, icon: any, extra?: string) => {

        return <Col xxl={{span: 6}} xl={{span: 8}} style={{marginBottom: 18, marginTop: 10}}>
            <div className={styles.middleItem} style={{backgroundColor: "transparent"
                , border: '3px solid',
                borderColor: '#ececec'
            }}>
                <div style={{
                    width: '100%',
                    height: 90,
                    display: 'flex',
                }}>
                    <div style={{width: '70%', height: '100%', color: '#252525'}}>
                        <div style={{fontSize: 16, fontWeight: 'bold'}}>
                            {title}
                        </div>
                        <div style={{fontSize: 30, fontWeight: 'bold', height: 60, display: 'flex', alignItems: 'center'}}>
                            {count}
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'end', width: '30%'}}>
                        {icon}
                    </div>
                </div>
                <div style={{color: '#5b5b5b'}}>
                    {extra?<div>{extra}</div>: null}
                    {description}
                </div>
            </div>

        </Col>
    }

    return <div>
        <Card title={'本月订单'}>
            <Row>
                <Col style={{marginBottom: 18, marginTop: 10}}  xxl={{span: 6}} xl={{span: 8}}>
                    <div className={styles.redCard}>
                        <div style={{width: '100%', display: 'flex'}}>
                            <div style={{width: '70%'}}>
                                <div style={{fontSize: 20, fontWeight: "bold"}}>
                                    本月已完成
                                </div>
                                <div>
                                    本月GFC已标记审核状态的单据总量
                                </div>
                            </div>
                            <div style={{width: '30%'}}>
                                <div style={{
                                    fontSize: 30,
                                    display: "flex",
                                    justifyContent: 'end',
                                    alignItems: 'end',
                                    height: '100%',
                                    fontWeight: 'bold',
                                    paddingRight: 10
                                }}>
                                    {data?.monthCnt  || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col style={{marginBottom: 18, marginTop: 10}} xxl={{span: 6}} xl={{span: 8}}>
                    <div className={styles.blueCard}>
                        <div style={{width: '100%', display: 'flex'}}>
                            <div style={{width: '70%'}}>
                                <div style={{fontSize: 20, fontWeight: "bold"}}>
                                    昨日新增
                                </div>
                                <div>
                                    上一个工作日到今天流转到GFC审核的单据量
                                </div>
                            </div>
                            <div style={{width: '30%'}}>
                                <div style={{
                                    fontSize: 30,
                                    display: "flex",
                                    justifyContent: 'end',
                                    alignItems: 'end',
                                    height: '100%',
                                    fontWeight: 'bold',
                                    paddingRight: 10
                                }}>
                                    {data?.lastDayCnt || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
        <Card
            className={styles.middleCard}
            title={'当前订单'}
        >
            <Row>
                {middleCardNode(
                    '待审批',
                    '当前所有流转到GFC审核的单据总量',
                    `${data?.waitApproveCnt || 0}`,
                    '#d9f0e4',
                    <CheckCircleFilled style={{fontSize: '3rem', color: 'rgb(66 203 140)'}}/>
                )}
                {middleCardNode(
                    'On Hold',
                    '当前所有GFC标记On-Hold状态的单据数量',
                    `${(data?.onHoldUserCnt || 0) + (data?.onHoldComplianceCnt || 0)}=${data?.onHoldUserCnt || 0}+${data?.onHoldComplianceCnt || 0}`,
                    '#ebe9fc',
                    <HourglassFilled style={{fontSize: '3rem', color: '#722ddf'}}/>,
                    '(与用户沟通+与合规沟通)'
                )}
                {middleCardNode(
                    '接近LeadTime',
                    '当前从流转到GFC审核开始至今4-5天未有GFC审核状态的单据数量',
                    `${data?.nearLeadTimeCnt || 0}`,
                     '#fde9ec',
                    <ClockCircleFilled style={{fontSize: '3rem', color: '#fa3e64', paddingRight: 10}}/>
                )}
                {middleCardNode(
                    'LeadTime',
                    '当前从流转到GFC审核开始至今大于5天未有GFC审核状态的单据数量',
                    `${data?.leadTimeCnt || 0}`,
                    '#e6ecfc',
                    <ClockCircleFilled style={{fontSize: '3rem', color: '#3d86ff'}}/>
                )}
            </Row>
        </Card>

        <Card
            title={'异常订单'}
            className={styles.bottomCard}
        >
            <Row>
                {middleCardNode(
                    '计次',
                    '当前所有GFC标记计次状态的单据数量',
                    `${data?.issueCnt || 0}`,
                    'rgba(231,231,231,0.49)',
                    <PieChartFilled style={{fontSize: '3rem', color: '#969696', paddingRight: 10}}/>
                )}
                {middleCardNode(
                    'iSight',
                    '当前所有GFC标记iSight状态的单据数量',
                    `${data?.iSightCnt || 0}`,
                    '#fde9ec',
                    <CloseCircleFilled style={{fontSize: '3rem', color: '#fa3e64', paddingRight: 10}}/>
                )}
            </Row>
        </Card>
    </div>
}

export default HomePage