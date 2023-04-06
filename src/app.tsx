// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate

import styles from './app.less'
import type {RequestConfig} from 'umi';
import Header from "@/components/Header";
import {getUserInfo} from "@/components/Header/service";
import ChildrenContainer from "@/components/ChildrenContainer";
import {history} from "@@/core/history";

export async function getInitialState(): Promise<{ name: string }> {
    return {name: 'HT'};
}

export const request: RequestConfig = {
    responseInterceptors: [
        (response) => {
            return response
        }
    ],
    errorConfig: {
        errorHandler: (err: any) => {
            if (err.request.status === 403) {
                // location.href = '/ErrPage/403'
                history.push('/ErrPage/403')
            }
        }
    }
}

export const layout = () => {

    return {
        logo: require('/src/assets/gsk_logo.png'),
        menu: {
            locale: false,
            request: async (params: any, defaultMenuDat: any) => {

                let result = await getUserInfo()

                let permissions = result.userInfo.ListPermissions

                const newMenu = defaultMenuDat?.map((t: any) => {
                    if (t.code && permissions.indexOf(t.code) !== -1) {
                        if (t.children) {
                            const newChildren = t.children.map((tt: any) => {
                                if (tt.code && permissions.indexOf(tt.code) !== -1) {
                                    return tt
                                } else {
                                    return null
                                }
                            })
                            return {...t, children: newChildren}

                        } else {
                            return null
                        }
                    } else {
                        return t
                    }
                })

                return newMenu
                // return []
            }
        },
        title: false,
        className: styles.layout,
        rightContentRender: false,
        collapsedButtonRender: () => {
            return null
        },
        layout: 'mix',
        headerContentRender: () => {
            return <Header/>
        },
        childrenRender: (children: any, props: any) => {
            return <ChildrenContainer props={props}>
                {children}
            </ChildrenContainer>
        }
    };
};
