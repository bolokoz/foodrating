<template>
  <q-page padding class="q-gutter-md">
    <q-card
      v-for="restaurant in restCards"
      :key="restaurant.id"
      class="bg-primary my-card"
    >
      <!-- <q-img :src="restaurant.reviews?.photos[0]" /> -->
      <q-carousel
        v-if="restaurant?.photos?.length > 0"
        animated
        arrows
        navigation
        infinite
        v-model="restaurant.model"
      >
        <q-carousel-slide
          v-for="(photo, i) in restaurant.photos"
          :key="photo"
          :name="i"
          class="column no-wrap flex-center"
          :img-src="photo"
        />
      </q-carousel>

      <q-card-section>
        <q-btn
          fab
          color="secondary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ restaurant.nome }}</div>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="place" />
            250 ft
          </div>
        </div>

        <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">{{ restaurant.tipos }}</div>
        <div class="text-caption text-grey">
          {{ restaurant.pratos }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn
          flat
          round
          icon="edit"
          color="secondary"
          @click="edit(restaurant.id)"
          >Editar</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import useApi from 'src/composables/UseApi';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

const { list, supabase } = useApi();
const router = useRouter();

const restCards = ref([]);

const restaurants = await list('restaurants', 'created_at').then(
  (res) => (restCards.value = res)
);
const reviews = await supabase.from('reviews').select('*,restaurants!inner(*)');

onMounted(() => {
  reviews.data.forEach((rev) => {
    let found = restCards.value.find((rest) => rest.id == rev.restaurant_id);
    // console.log('rev', rev, 'found', found);
    // add reviews
    if (typeof found.review != undefined && found.review instanceof Array) {
      found.reviews.push(rev);
    } else {
      found.reviews = [rev];
    }
    // add photos
    if (typeof found.photos != undefined && found.photos instanceof Array) {
      found.photos.concat(rev.photos);
    } else {
      found.photos = rev.photos;
    }
    // add model for carousel
    found.model = 0;
  });
});

// const restCards = computed(() => {
//   let cards = restaurants;
//   let revs = reviews.data;

//   return cards;
// });

// const cards = computed(() => {
//   let array = reviews.data;

//   //create unique list of restaurants
//   let restaurants = [...new Set(array.map((review) => review.restaurants))];

//   // loop through each review and add info to the restaurant list
//   array.forEach((review) => {
//     let found = restaurants.find(
//       (restaurant) => restaurant.id === review.restaurant_id
//     );
//     // group photos
//     found.hasOwnProperty('photos')
//       ? found.photos.concat(review?.photos)
//       : (found.photos = review?.photos);

//     // group meals
//     found.hasOwnProperty('pratos')
//       ? found.pratos.concat(review?.prato)
//       : (found.pratos = [review?.prato]);
//     // group tipos
//     found.hasOwnProperty('tipos')
//       ? found.tipos.concat(review?.tipo)
//       : (found.tipos = [review?.tipo]);
//     // group dates
//     found.hasOwnProperty('date')
//       ? found.date.concat(review?.date)
//       : (found.date = [review?.date]);
//     // group valor
//     found.hasOwnProperty('valor')
//       ? found.valor.concat(review?.valor)
//       : (found.valor = [review?.valor]);
//     // add model for carousel
//     found.model = 0;
//   });
//   return restaurants;
// });

const edit = (id) => {
  router.push({ name: 'form-restaurant', params: { id: id } });
};

function resizeAPI(url) {
  let parsed = new URL(url);
  let file = parsed.toString().split('/').pop();
  // console.log('parserd url', last);
  let complete = `https://supacdntransform.vercel.app/api/resize?f=${file}&b=reviews&q=20`;
  // console.log('final', complete);

  return complete;
}

const slide = ref(1);
</script>
