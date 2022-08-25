<template>
  <q-page padding>
    <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md justify-center">
      <p class="text-h3">Thanks for registering</p>
      <p>
        Please confirm email registration on
        <strong>{{ $route.query.email }}</strong>
      </p>
      <q-btn
        label="Back to login"
        color="warning"
        class="full-width"
        :to="{ name: 'login' }"
      ></q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageEmailConfirmation',
  components: {},
});
</script>
