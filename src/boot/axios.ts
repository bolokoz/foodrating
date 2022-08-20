import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: 'https://gvzcryvaetkndntielit.supabase.co',
});

api.defaults.headers.common['xc-auth'] =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inl1cmlmYmVja0BnbWFpbC5jb20iLCJmaXJzdG5hbWUiOm51bGwsImxhc3RuYW1lIjpudWxsLCJpZCI6InVzX25zcWphaGhxMnE4Z2V2Iiwicm9sZXMiOiJ1c2VyLHN1cGVyIiwidG9rZW5fdmVyc2lvbiI6IjlkNGNmOWVmNzA5Yjk3MTIxMjQxNDg3ZmU3ZDkwOWZiZmI1ZWQyNTNlNWY2MGQ1NGVhMjgzNGM4YTVmYjAwNzg5MGRkMzlmMDNkNzM3ZTdkIiwiaWF0IjoxNjYwNzA3MDUyLCJleHAiOjE2NjA3NDMwNTJ9.MnyMh6ln5mtHDNRFd7QzqEGopuOvKBpzTHtFRln_GpU';

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
