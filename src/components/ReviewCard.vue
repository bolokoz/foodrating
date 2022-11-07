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
      <q-btn align="around" class="full-width" outline color="orange-9">{{
        review.restaurants.nome
      }}</q-btn>

      <div class="text-h5 q-mt-sm q-mb-xs">{{ review.prato }}</div>
      <div class="row">
        <div class="col">
          <q-rating
            :model-value="review.nota_sentimental"
            size="2em"
            :max="3"
            color="secondary"
            readonly
          >
            <template v-slot:tip-1>
              <q-tooltip>Not good</q-tooltip>
            </template>
            <template v-slot:tip-2>
              <q-tooltip>Muito bom</q-tooltip>
            </template>
            <template v-slot:tip-3>
              <q-tooltip>Recomendado!</q-tooltip>
            </template>
          </q-rating>
        </div>
        <div class="col text-caption text-grey text-right text-secondary">
          R$ {{ review.valor / 100 }}
        </div>
        <q-btn
          color="grey"
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </div>
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            <div class="row">
              <q-btn
                size="sm"
                outline
                square
                color="secondary"
                class="q-mr-sm"
                >{{ review.tipo }}</q-btn
              >
              <q-btn
                size="sm"
                outline
                square
                color="secondary"
                class="q-mr-sm"
                >{{ review.periodo }}</q-btn
              >
              <div class="text-overline text-orange-9">{{ review.date }}</div>
              <div class="q-my-md">
                {{ review.obs_sentimental }}
              </div>
            </div>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card-section>
  </q-card>
</template>
