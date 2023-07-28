import { RouterView, createRouter, createWebHistory } from 'vue-router'
import LayoutDefault from '@/layout/layouts/LayoutDefault.vue'
// Middleware
import authentication from '@/middlewares/authentication';
import { executeMiddlewares } from '@/middlewares';
// Extra Routes
// import dashboardRoutes from './dashboardRoutes';
import componentRoutes from './componentRoutes';
// Loading pinia store
import { usePageLoadStore } from '@/stores/pageLoadStore';
// Modules
import authRoutes from '@/modules/Auth/auth.routes';
import chatsRoutes from '@/modules/Chats/chats.routes';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: authRoutes.find(route=>route.name==='Login')?.component || RouterView,
      meta: {  layout: 'Auth' },
      name: 'Home',
      path: '/',
    },
    ...authRoutes,

    {
      path: '/chat',
      component: RouterView,
      children: chatsRoutes,
      meta: { middleware: [authentication] }
    },


    /** __Component Kit Routes__ */
    {
      path: '/_component',
      component: LayoutDefault,
      children: [
        ...componentRoutes.map((route)=>({
          path: route.path.substring(1),
          name: route.name,
          component: route.component,
          meta: { ...route.meta, layout: 'ComponentDashboard' },
        })),
      ],
    },
  ]
});



router.beforeEach((to, from, next)=> {
  //Set page loader to true
  const { setPageLoading } = usePageLoadStore()
  setPageLoading(true);
  
  
  if (!to.meta.middleware) return next();

  // Run middlewares
  const context = {from, next, router, to };
  return executeMiddlewares(context);
})

router.afterEach(()=>{
  //Set page loader to true
  const { setPageLoading } = usePageLoadStore()
  setPageLoading(false);
});

export default router


