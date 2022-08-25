<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <p class="col-12 text-h4 text-center">Register</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Name"
          v-model="form.name"
          lazy-rules
          :rules="[(val) => (val && val.length > 3) || 'Name is Required']"
        ></q-input>
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
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Password is Required']"
          type="password"
        ></q-input>
        <div class="full-width q-pt-md"></div>
        <q-btn
          label="Register"
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
import { useRouter } from 'vue-router';
import useNotify from 'src/composables/UseNotify';

export default defineComponent({
  name: 'RegisterPage',
  components: {},

  setup() {
    const router = useRouter();
    const { register } = useAuthUser();
    const form = ref({
      name: '',
      email: '',
      password: '',
    });

    const { notifyNegative, notifySuccess } = useNotify();
    const handleRegister = async () => {
      try {
        await register(form.value);
        notifySuccess('Email confirmation sent');
        router.push({
          name: 'email-confirmation',
          query: { email: form.value.email },
        });
      } catch (error: any) {
        notifyNegative(error.message);
      }
    };

    return {
      form,
      handleRegister,
    };
  },
});
</script>
