<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Boloko Food Ratings </q-toolbar-title>

        <!-- <div>Boloko v{{ $q.version }}</div> -->
        <q-btn round icon="moon" @click="$q.dark.toggle()"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Avaliar refeição',
    caption: 'De nota a uma comida',
    icon: 'food',
    link: '/',
  },
  {
    title: 'Reviews',
    caption: 'revisar avaliações feitas',
    icon: 'code',
    link: 'review-list',
  },
  {
    title: 'Restaurants',
    caption: 'Restaurantes visitados',
    icon: 'chat',
    link: 'restaurant-list',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
