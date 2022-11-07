<template>
  <q-page class="item-center justify-evenly">
    <div class="full-width item-center">
      <q-list>
        <q-expansion-item
          v-for="(rest, i) in restaurants"
          :key="i"
          popup
          :label="rest[0].restaurants.nome"
          :caption="`Reviews: ${rest.length}`"
        >
          <q-separator />
          <review-card v-for="rev in rest" :key="rev.id" :review="rev" />
          <!-- <q-card v-for="rev in rest" :key="rev.id">
            <q-card-section>{{ rev.prato }}</q-card-section>
          </q-card> -->
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import ReviewCard from 'components/ReviewCard.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useApi from 'src/composables/UseApi';

const { supabase, list, getById } = useApi();
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

const restaurants = computed(() => {
  let restaurants = groupBy(reviews.value, 'restaurant_id');
  return restaurants;
});
// const restaurants2 = computed(() => {
//   let restaurants = [
//     ...new Set(reviews.value.map((review) => review?.restaurants.nome)),
//   ];
//   return restaurants;
// });

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

const handleListOptions = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(
        'id,prato, restaurants(nome), restaurant_id, nota_sentimental, valor, tipo, date, periodo, obs_sentimental, photos'
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
