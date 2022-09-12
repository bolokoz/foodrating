<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <!-- Suspense component  to show users  -->

      <q-card class="my-card" v-for="review in reviews" :key="review.Id">
        <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">Cafe Basilico</div>
            <div
              class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
            >
              <q-icon name="place" />
              250 ft
            </div>
          </div>

          <q-rating v-model="review.nota_sentimental" :max="3" size="32px" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">$・Italian, Cafe</div>
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import ExampleComponent from 'components/ExampleComponent.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useApi from 'src/composables/UseApi';

const { list, getById } = useApi();
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
    reviews.value = await list('reviews');
  } catch (error) {
    console.log(error);
  }
};

const handleGetById = async (id) => {
  reviews.value = getById(id);
};
</script>
