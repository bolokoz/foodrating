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
        path: 'category',
        name: 'category',
        component: () => import('pages/category/List.vue'),
      },
      {
        path: 'form-category/:id?',
        name: 'form-category',
        component: () => import('src/pages/category/FormCategory.vue'),
      },
      {
        path: 'pagamento',
        name: 'pagamento',
        component: () => import('pages/pagamento/List.vue'),
      },
      {
        path: 'form-pagamento/:id?',
        name: 'form-pagamento',
        component: () => import('pages/pagamento/FormPagamento.vue'),
      },
      {
        path: 'food-review',
        name: 'food-review',
        component: () => import('pages/food-review/List.vue'),
      },
      {
        path: 'form-food-review/:id?',
        name: 'form-food-review',
        component: () => import('pages/food-review/FormFoodReview.vue'),
      },
      {
        path: 'receita',
        name: 'receita',
        component: () => import('pages/receita/List.vue'),
      },
      {
        path: 'form-receita/:id?',
        name: 'form-receita',
        component: () => import('pages/receita/FormReceita.vue'),
      },

      {
        path: 'form-profile',
        name: 'form-profile',
        component: () => import('src/pages/perfil/ProfileForm.vue'),
      },
      {
        path: 'supplier',
        name: 'supplier',
        component: () => import('pages/fornecedor/List.vue'),
      },
      {
        path: 'form-supplier/:id?',
        name: 'form-supplier',
        component: () => import('src/pages/fornecedor/SupplierForm.vue'),
      },
      {
        path: 'project',
        name: 'project',
        component: () => import('pages/projeto/List.vue'),
      },
      {
        path: 'form-project/:id?',
        name: 'form-project',
        component: () => import('src/pages/projeto/ProjectForm.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('pages/admin/List.vue'),
      },
      {
        path: 'admin/:id',
        name: 'form-admin',
        component: () => import('pages/admin/AdminForm.vue'),
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('pages/contas/List.vue'),
      },
      {
        path: 'account/:id',
        name: 'form-account',
        component: () => import('pages/contas/FormContas.vue'),
      },
      {
        path: 'relatorio/ressarcimento',
        name: 'ressarcimento',
        component: () => import('src/pages/relatorio/RessarcimentoPage.vue'),
      },
      {
        path: 'relatorio/administracao',
        name: 'relatorio-administracao',
        component: () => import('src/pages/relatorio/AdministracaoPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
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
