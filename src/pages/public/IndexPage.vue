<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md row items-start q-gutter-md">
      <ReviewCard v-for="item in reviews" :review="item" :key="item.id" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import ExampleComponent from 'components/ExampleComponent.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useApi from 'src/composables/UseApi';
import ReviewCard from 'src/components/ReviewCard.vue';

const { supabase, getById } = useApi();
const router = useRouter();
const route = useRoute();
const isUpdate = computed(() => route.params.id);
const reviews = ref([]);

onMounted(() => {
  if (isUpdate.value) {
    handleGetById(isUpdate.value);
  } else {
    handleListOptions();
  }
});

const handleListOptions = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(
        'id,prato, restaurants(nome), nota_sentimental, valor, tipo, date, periodo, obs_sentimental, photos'
      )
      .order('date', { ascending: false });
    reviews.value = data;
  } catch (error) {
    console.log(error);
  }
};

const handleGetById = async (id) => {
  reviews.value = getById(id);
};
</script>

<style>
.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
