import type { RouteRecordRaw } from "vue-router";

export default [
  {
    path: 'profile',
    name: 'SettingsProfile',
    component: () => import('./views/SettingsProfileView.vue'),
    meta: { layout: 'Dashboard', title: 'Profile Settings' },
  },
] as readonly RouteRecordRaw[]