import {cloneElement, FC, useEffect, useState} from "react"
import {Access, useModel} from "@@/exports";
import {useLocation} from "umi";
import {Result} from "antd";

interface ChildrenContainerProps {
    children: any
    props: any
}

const menuCodeList = [
    {code: '00000000-0000-2000-0001-000000000000', path: '/approvalManagement/thirdPartApproval'},
    {code: '00000000-0000-2000-0002-000000000000', path: '/approvalManagement/issueRecord'}
]

const ChildrenContainer: FC<ChildrenContainerProps> = (propsMain) => {

    const {props, children} = propsMain

    const {getUserAllInfo, info} = useModel('global')

    const location = useLocation()

    const [pageVisible, setPageVisible] = useState(true)


    useEffect(() => {

        getUserAllInfo()

    }, [])

    useEffect(() => {

        if (info) {
            let current = -1
            const pathList = menuCodeList?.map((t) => {
                return t.path
            })
            pathList?.forEach((t, index) => {
                if (t === location.pathname) {
                    current = index
                }
            })
            if (current !== -1) {
                const currentAuthCode = menuCodeList[current].code
                if (info?.ListPermissions.indexOf(currentAuthCode) === -1) {
                    setPageVisible(false)
                }else{
                    setPageVisible(true)
                }
            }else {
                setPageVisible(true)
            }
        }
    }, [info, location])

    return <Access
        accessible={pageVisible}
        fallback={<Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
        />}
    >{cloneElement(children, {...props})}</Access>;
}

export default ChildrenContainer