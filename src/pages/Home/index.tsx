import {PageContainer} from '@ant-design/pro-components';
import {Col, Row} from "antd";
import {
    CheckCircleFilled,
    CheckSquareFilled,
    ClockCircleFilled,
    CloseCircleFilled,
    HourglassFilled,
    PieChartFilled,
    PlusSquareFilled
} from "@ant-design/icons";
import ShowCard from "@/pages/Home/components/ShowCard";
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

    return (
        <PageContainer>
            <Row>
                <Col xl={{span: 8}} xxl={{span: 12}} style={{padding: 10}}>
                    <ShowCard
                        title={'待审批'}
                        description={'当前所有流转到GFC审核的单据总量'}
                        count={data?.waitApproveCnt || 0}
                        icon={<CheckSquareFilled style={{fontSize: '3rem', color: '#5cd172'}}/>}
                    />
                </Col>
                <Col xl={{span: 8}} xxl={{span: 12}} style={{padding: 10}}>
                    <ShowCard
                        title={'昨日新增'}
                        description={'上一个工作日到今天流转到GFC审核的单据量'}
                        count={data?.lastDayCnt || 0}
                        icon={<PlusSquareFilled style={{fontSize: '3rem', color: '#65daac'}}/>}
                    />
                </Col></Row>
            <Row>

                {/*<HourglassFilled style={{fontSize: '3rem', color: '#ea6626'}}/>*/}
                <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 10}}>
                    <ShowCard
                        title={'接近LeadTime'}
                        description={'当前从流转到GFC审核开始至今4-5天未有GFC审核状态的单据数量'}
                        count={data?.nearLeadTimeCnt || 0}
                        icon={<ClockCircleFilled style={{fontSize: '3rem', color: 'red'}}/>}
                    />
                </Col>
                <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 10}}>
                    <ShowCard
                        title={'LeadTime'}
                        description={'当前从流转到GFC审核开始至今大于5天未有GFC审核状态的单据数量'}
                        count={data?.leadTimeCnt || 0}
                        icon={<ClockCircleFilled style={{fontSize: '3rem', color: '#3591ff'}}/>}
                    />
                </Col>

                <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 10}}>
                    {/*与员工沟通/与合规沟通*/}
                    <ShowCard
                        title={'On Hold '}
                        description={'当前所有GFC标记On-Hold状态的单据数量 '}
                        extra={'(与用户沟通+与合规沟通)'}
                        count={`${(data?.onHoldUserCnt || 0) + (data?.onHoldComplianceCnt || 0)}=${data?.onHoldUserCnt || 0}+${data?.onHoldComplianceCnt || 0}`}
                        icon={<HourglassFilled style={{fontSize: '3rem', color: '#ea6626'}}/>}
                    />
                </Col>
                <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 10}}>
                    <ShowCard
                        title={'本月已完成'}
                        description={'本月GFC已标记审核状态的单据总量'}
                        count={data?.monthCnt || 0}
                        icon={<CheckCircleFilled style={{fontSize: '3rem', color: '#7666fa'}}/>}
                    />
                </Col>


            </Row>
            <Row>
                <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 10}}>
                    <ShowCard
                        title={'计次'}
                        description={'当前所有GFC标记计次状态的单据数量'}
                        count={data?.issueCnt || 0}
                        icon={<PieChartFilled style={{fontSize: '3rem', color: '#657797'}}/>}
                    />
                </Col>
                <Col xl={{span: 8}} xxl={{span: 6}} style={{padding: 10}}>
                    <ShowCard
                        title={'iSight'}
                        description={'当前所有GFC标记iSight状态的单据数量'}
                        count={data?.iSightCnt || 0}
                        icon={<CloseCircleFilled style={{fontSize: '3rem', color: 'red'}}/>}
                    />
                </Col>
            </Row>

            {/*<div>*/}
            {/*    <StatisticCard.Group direction={'row'}>*/}
            {/*        <StatisticCard*/}
            {/*            statistic={{*/}
            {/*                title: '待审批',*/}
            {/*                value: 2176,*/}
            {/*                icon: (*/}
            {/*                    <img*/}
            {/*                        style={imgStyle}*/}
            {/*                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"*/}
            {/*                        alt="icon"*/}
            {/*                    />*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <StatisticCard*/}
            {/*            statistic={{*/}
            {/*                title: 'Leadtime',*/}
            {/*                value: 475,*/}
            {/*                icon: (*/}
            {/*                    <img*/}
            {/*                        style={imgStyle}*/}
            {/*                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"*/}
            {/*                        alt="icon"*/}
            {/*                    />*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <StatisticCard*/}
            {/*            statistic={{*/}
            {/*                title: '接近Leadtime',*/}
            {/*                value: 87,*/}
            {/*                icon: (*/}
            {/*                    <img*/}
            {/*                        style={imgStyle}*/}
            {/*                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"*/}
            {/*                        alt="icon"*/}
            {/*                    />*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <StatisticCard*/}
            {/*            statistic={{*/}
            {/*                title: 'On Hold',*/}
            {/*                value: 1754,*/}
            {/*                icon: (*/}
            {/*                    <img*/}
            {/*                        style={imgStyle}*/}
            {/*                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"*/}
            {/*                        alt="icon"*/}
            {/*                    />*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </StatisticCard.Group>*/}
            {/*</div>*/}
            {/*<div style={{marginTop: 20}}>*/}
            {/*    <StatisticCard.Group direction={'row'}>*/}
            {/*        <StatisticCard*/}
            {/*            statistic={{*/}
            {/*                title: 'Escalate',*/}
            {/*                value: 2176,*/}
            {/*                icon: (*/}
            {/*                    <img*/}
            {/*                        style={imgStyle}*/}
            {/*                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"*/}
            {/*                        alt="icon"*/}
            {/*                    />*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <StatisticCard*/}
            {/*            statistic={{*/}
            {/*                title: '计次',*/}
            {/*                value: 475,*/}
            {/*                icon: (*/}
            {/*                    <img*/}
            {/*                        style={imgStyle}*/}
            {/*                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"*/}
            {/*                        alt="icon"*/}
            {/*                    />*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <StatisticCard*/}
            {/*            statistic={{*/}
            {/*                title: '昨日新增',*/}
            {/*                value: 87,*/}
            {/*                icon: (*/}
            {/*                    <img*/}
            {/*                        style={imgStyle}*/}
            {/*                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"*/}
            {/*                        alt="icon"*/}
            {/*                    />*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <StatisticCard*/}
            {/*            statistic={{*/}
            {/*                title: '本月已处理',*/}
            {/*                value: 1754,*/}
            {/*                icon: (*/}
            {/*                    <img*/}
            {/*                        style={imgStyle}*/}
            {/*                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"*/}
            {/*                        alt="icon"*/}
            {/*                    />*/}
            {/*                ),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </StatisticCard.Group>*/}
            {/*</div>*/}
        </PageContainer>
    );
};

export default HomePage;
