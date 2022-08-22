<template>
  <q-page class="q-pa-md">
    <q-intersection
      v-for="review in reviews"
      :key="review.Id"
      transition="scale"
      class="row justify-center q-gutter-xl"
    >
      <q-card class="my-card q-ma-sm">
        <q-carousel
          v-if="review?.fotos !== null"
          animated
          v-model="slide"
          arrows
          navigation
          thumbnails
          swipeable
          infinite
        >
          <q-carousel-slide
            v-for="(foto, i) in review.fotos"
            :key="i"
            :name="i"
            :img-src="foto"
          />
        </q-carousel>

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ review?.prato }}</div>
            <div
              class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
            >
              <q-icon name="place" />
              250 ft
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div>
            <span>Nota Sentimental: </span>
            <q-rating
              :model-value="review?.nota_sentimental"
              :max="4"
              size="1.5em"
              color="grey"
              :color-selected="ratingColors"
            />
            <span
              >{{ review?.nota_sentimental }} / 4 : Voltaria pra comer
            </span>
          </div>
          <br />
          <div>
            <span>Nota Técnica: </span>
            <q-rating
              :model-value="review?.nota_tecnica"
              :max="5"
              size="1.5em"
              color="grey"
              :color-selected="ratingColors2"
            />
            <span>{{ review?.nota_tecnica }} / 5 : Bem feita </span>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            R$ {{ review.valor }}・{{ review.restaurant[0]?.nome }}
          </div>
          <div class="text-caption text-grey">
            Small plates, salads & sandwiches in an intimate setting.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat color="primary"> Reserve </q-btn>
        </q-card-actions>
      </q-card>
    </q-intersection>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
const reviews = ref();
const slide = ref(1);
const ratingColors = [
  'light-green-3',
  'light-green-6',
  'green',
  'green-9',
  'green-10',
];
const ratingColors2 = [
  'light-blue-3',
  'light-blue-6',
  'blue',
  'blue-9',
  'blue-10',
];

onMounted(() => {
  getReviews();
});

function getReviews() {
  api.get('/food').then((res) => {
    reviews.value = res?.data?.list;
  });
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-height: 40vh;
}
</style>
