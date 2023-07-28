import LayoutDefault from '@/layout/layouts/LayoutDefault.vue';

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue'),
    meta: {  layout: 'Auth' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/RegisterView.vue'),
    meta: {  layout: 'Auth', layoutShift: true, },
  },
]