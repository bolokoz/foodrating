<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleResetPassword">
      <p class="col-12 text-h4 text-center">Reset Password</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="New Password"
          v-model="password"
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Password is Required']"
          type="password"
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
          label="Back to login"
          color="warning"
          class="full-width"
          flat
          small
          to="/login"
        ></q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useAuthUser from 'src/composables/UseAuthUser';
import { useRouter, useRoute } from 'vue-router';
import useNotify from 'src/composables/UseNotify';

export default defineComponent({
  name: 'PageResetPassword',
  components: {},

  setup() {
    const router = useRouter();
    const { resetPassword } = useAuthUser();

    const password = ref('');

    const route = useRoute();
    const token = route.query.token;

    const { notifyNegative, notifySuccess } = useNotify();

    const handleResetPassword = async () => {
      try {
        await resetPassword(token, password.value);
        notifySuccess('Email has been reset');
        router.push({ name: 'login' });
      } catch (error: any) {
        notifyNegative(error.message);
      }
    };

    return {
      password,
      handleResetPassword,
    };
  },
});
</script>
