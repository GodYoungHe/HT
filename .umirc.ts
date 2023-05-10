import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  publicPath: '/MealWeb/',
  base: '/MealWeb/',
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: '首页',
      component: './HomePage'
    },
    {
      name: '审批管理',
      path: '/approvalManagement',
      code: '00000000-0000-2000-0000-000000000000',
      routes: [
        {
          path: '/approvalManagement',
          redirect: '/approvalManagement/thirdPartApproval',
        },
        {
          name: 'HT订单审核',
          path: 'thirdPartApproval',
          component: './ApprovalManagement',
          code: '00000000-0000-2000-0001-000000000000'
        },
        {
          name: '计次记录',
          path: 'issueRecord',
          component: './IssueRecord',
          code: '00000000-0000-2000-0002-000000000000'
        }
      ],
    },
    {
      path: '/ErrPage/403',
      component: './ErrPage',
      layout: false
    }
  ],
  npmClient: 'yarn',
  proxy: {
    "/ThirdApprove/": {
      target: 'https://wxm-dev.igskapp.com',
      changeOrigin: true,
    },
  }
});

