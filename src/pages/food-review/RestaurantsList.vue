<template>
  <q-page padding class="q-gutter-md">
    <q-card
      v-for="restaurant in restaurants"
      :key="restaurant.id"
      class="bg-primary my-card"
    >
      <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

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

        <q-rating v-model="stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">$・Italian, Cafe</div>
        <div class="text-caption text-grey">
          Small plates, salads & sandwiches in an intimate setting.
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
import { ref } from 'vue';

const { list } = useApi();
const router = useRouter();

const restaurants = await list('restaurants');

const edit = (id) => {
  router.push({ name: 'form-restaurant', params: { id: id } });
};
</script>
