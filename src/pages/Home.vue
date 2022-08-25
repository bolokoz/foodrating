<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <div class="col-4" v-for="n in 5" :key="`sm-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageHome',
  // components: { ApexBar, ApexColumn },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.my-content {
  padding: 10px 15px;
  background: rgba(86, 61, 124, 0.15);
  border: 1px solid rgba(86, 61, 124, 0.2);
  height: 200px;
  width: 200px;
}
</style>
