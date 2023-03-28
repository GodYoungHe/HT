import {FC} from "react";
import {Card} from "antd";
import {AccountBookFilled} from "@ant-design/icons";

interface ShowCardProps {
    title: string
    description: string
    count: string
    icon: any
    extra?: any
}

const ShowCard: FC<ShowCardProps> = (props) => {

    const {
        title,
        description,
        count,
        icon,
        extra,
    } = props

    return <Card>
        <div style={{display: 'flex'}}>
            <div style={{marginRight: '2.2rem'}}>
                {icon}
            </div>
            <div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bolder'}}>{title}</div>
                <div style={{color: '#565555', marginTop: 20, fontSize: '0.9rem', height: 65}}>
                    {description}
                    <div>{extra}</div>
                </div>
                <div style={{fontSize: '2.4rem', fontWeight: 'bolder', marginTop: 10}}>{count}</div>
            </div>
        </div>
    </Card>
}

export default ShowCard