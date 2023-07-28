import type { RouteRecordRaw } from "vue-router";

export default [
  {
    path: 'rooms',
    name: 'ChatRoomList',
    component: () => import('./views/ChatRoomListView.vue'),
    meta: { layout: 'Dashboard' },
  },
  {
    path: 'room/:id',
    name: 'ChatRoom',
    component: () => import('./views/ChatRoomView.vue'),
    meta: { layout: 'Dashboard' },
  },
] as RouteRecordRaw[]