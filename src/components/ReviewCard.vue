<script setup>
import { ref } from 'vue';
const props = defineProps({
  review: Object,
});
const expanded = ref(false);
</script>

<template>
  <q-card class="my-card" flat bordered>
    <q-img v-if="review.photos[0]" :src="review.photos[0]" />

    <q-card-section>
      <div class="text-overline text-orange-9">
        {{ review.restaurants.nome }}
      </div>
      <div class="text-h5 q-mt-sm q-mb-xs">{{ review.prato }}</div>
      <div class="text-caption text-grey"></div>
    </q-card-section>

    <q-card-actions>
      <q-btn flat color="accent" label="Ver mais" />
      <q-btn flat color="primary" label="Ver Restaurante" />

      <q-space />

      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subitle2">
          {{ obs_sentimental }}
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
