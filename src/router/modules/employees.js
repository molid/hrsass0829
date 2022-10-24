// 导出员工的路由规则
import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    {
      // ?的含义是表示该参数可传可不传 动态路由参数 
      path: 'detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true,
      meta: {
        title: '员工详情'
      }
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/print'),
      hidden: true,
      meta: {
        title: '员工打印'
      }
    }
  ]
}