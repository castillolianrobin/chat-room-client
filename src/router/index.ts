import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/cards',
      name: 'Cards',
      component: () => import('../views/CardView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/ButtonView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/dropdown',
      name: 'Dropdowns',
      component: () => import('../views/DropdownView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/modal',
      name: 'Modals',
      component: () => import('../views/ModalView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/pagination',
      name: 'Pagination',
      component: () => import('../views/PaginationView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/table',
      name: 'Table',
      component: () => import('../views/TableView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/form',
      name: 'Form',
      component: () => import('../views/FormView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/form/input',
      name: 'FormInput',
      component: () => import('../views/FormInputView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/form//select',
      name: 'FormSelect',
      component: () => import('../views/FormSelectview.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/form//checkbox-radio',
      name: 'FormCheckboxRadio',
      component: () => import('../views/FormCheckboxRadioView.vue'),
      meta: { layout: 'Dashboard' },
    },
    {
      path: '/sanbox',
      name: 'Sandbox',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SandboxView.vue'),
      meta: { layout: 'Dashboard' },
    }
  ]
})

export default router
