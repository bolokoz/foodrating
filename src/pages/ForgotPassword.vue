<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleResetPassword">
      <p class="col-12 text-h4 text-center">Forgot Password</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Email"
          v-model="email"
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Email is Required']"
          type="email"
        ></q-input>

        <div class="full-width q-pt-md"></div>
        <q-btn
          label="Send Reset Email"
          color="primary"
          class="full-width"
          outline
          type="submit"
        ></q-btn>

        <q-btn
          label="Back"
          color="warning"
          class="full-width"
          flat
          :to="{ name: 'login' }"
        ></q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useAuthUser from 'src/composables/UseAuthUser';
import useNotify from 'src/composables/UseNotify';

export default defineComponent({
  name: 'ForgotPasswordPage',
  components: {},

  setup() {
    const { sendPasswordResetEmail } = useAuthUser();
    const email = ref('');
    const { notifyNegative, notifySuccess } = useNotify();
    const handleResetPassword = async () => {
      try {
        await sendPasswordResetEmail(email.value);
        notifySuccess(`Password reset email sent to: ${email.value}`);
        // router.push({
        //   name: 'email-confirmation',
        //   query: { email: form.value.email },
        // });
      } catch (error: any) {
        notifyNegative(error.message);
      }
    };

    return {
      email,
      handleResetPassword,
    };
  },
});
</script>
