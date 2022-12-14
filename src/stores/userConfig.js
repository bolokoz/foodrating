import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: [],
    selectedProject: null,
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    increment() {
      this.counter++;
    },
  },
});
