import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/Home.vue'),
      },
      {
        path: 'form-restaurant/:id?',
        name: 'form-restaurant',
        component: () => import('pages/food-review/FormRestaurant.vue'),
      },
      {
        path: 'restaurant',
        name: 'restaurant',
        component: () => import('pages/food-review/RestaurantsList.vue'),
      },
      {
        path: 'food-review',
        name: 'food-review',
        component: () => import('pages/food-review/ReviewList.vue'),
      },
      {
        path: 'form-food-review/:id?',
        name: 'form-food-review',
        component: () => import('pages/food-review/FormFoodReview.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/public/IndexPage.vue'),
      },
      {
        path: 'restaurantes',
        name: 'restaurantes',
        component: () => import('pages/public/RestaurantList.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/Login.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/Register.vue'),
      },
      {
        path: 'email-confirmation',
        name: 'email-confirmation',
        component: () => import('pages/EmailConfirmation.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('pages/ForgotPassword.vue'),
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('pages/ResetPassword.vue'),
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
