<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h4 text-center">Login</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Email"
          v-model="form.email"
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Email is Required']"
          type="email"
        ></q-input>
        <q-input
          label="Password"
          v-model="form.password"
          type="password"
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Password is Required']"
        ></q-input>
        <div class="full-width q-pt-md"></div>
        <q-btn
          label="login"
          color="primary"
          class="full-width"
          outline
          type="submit"
        ></q-btn>
        <q-btn
          label="Register"
          color="secondary"
          class="full-width"
          flat
          to="/register"
        ></q-btn>
        <q-btn
          label="Forgot Password"
          color="warning"
          class="full-width"
          flat
          small
          to="/forgot-password"
        ></q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import useAuthUser from 'src/composables/UseAuthUser';
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',
  components: {},

  setup() {
    const router = useRouter();
    const { login, isLoggedIn } = useAuthUser();
    const form = ref({
      email: '',
      password: '',
    });

    const { notifyNegative, notifySuccess } = useNotify();

    onMounted(() => {
      if (!isLoggedIn) {
        router.push({ name: 'home' });
      }
    });

    const handleLogin = async () => {
      try {
        await login(form.value);
        notifySuccess('Login Successfully!');
        router.push({ name: 'home' });
      } catch (error: any) {
        notifyNegative(error.message);
      }
    };

    return {
      form,
      handleLogin,
    };
  },
});
</script>
