import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        name: 'restaurant',
        path: 'restaurant/:id?',
        component: () => import('pages/RestaurantListPage.vue'),
      },
      {
        path: 'restaurant-list',
        component: () => import('pages/RestaurantListPage.vue'),
      },
      {
        name: 'review-list',
        path: 'review-list',
        component: () => import('pages/ReviewListPage.vue'),
      },
      {
        name: 'review',
        path: 'review/:id?',
        component: () => import('pages/ReviewPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
