<template>
  <q-page class="item-center justify-evenly">
    <div class="full-width item-center">
      <q-list>
        <q-expansion-item
          v-for="(cat, i) in categorias"
          :key="i"
          popup
          :label="cat[0].tipo"
          header-class="text-orange text-h6 text-weight-bold text-capitalize"
          :caption="`Reviews: ${cat.length}`"
        >
          <q-list bordered separator>
            <q-item
              v-for="rev in cat"
              :key="rev.id"
              clickable
              v-ripple
              class="q-mx-md"
            >
              <q-item-section>
                <q-item-label overline>{{ rev.prato }}</q-item-label>
                <q-item-label>{{ rev.nota_sentimental }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <!-- <review-card v-for="rev in rest" :key="rev.id" :review="rev" /> -->
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

const categorias = computed(() => {
  let categorias = groupBy(reviews.value, 'tipo');
  return categorias;
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
