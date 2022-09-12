<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <div class="bg-orange text-white">
        <q-toolbar>
          <q-btn
            v-if="$q.screen.lt.sm"
            flat
            round
            dense
            icon="menu"
            class="q-mr-sm"
            @click="drawer = !drawer"
          />
          <q-separator dark vertical inset />

          <q-space />

          <q-separator dark vertical inset />
          <q-btn-group flat v-if="$q.screen.sm">
            <q-btn stretch flat label="Reviews" to="/" />
            <q-separator dark vertical />
            <q-btn stretch flat label="Restaurantes" />
            <q-separator dark vertical />
          </q-btn-group>
          <q-separator dark vertical inset />
          <q-btn
            flat
            round
            dense
            icon="login"
            class="q-mr-xs"
            :to="{ name: 'login' }"
          />
        </q-toolbar>
        <q-toolbar inset>
          <q-toolbar-title
            ><strong>Boloko</strong> Food Reviews</q-toolbar-title
          >
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      dark
      :breakpoint="500"
      bordered
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable v-ripple :to="menuItem.link">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
              <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </q-item>
          </template>
          <q-space></q-space>
          <q-separator></q-separator>
          <q-item clickable v-ripple :to="{ name: 'login' }">
            <q-item-section avatar>
              <q-icon name="login" />
            </q-item-section>
            <q-item-section> Login </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition mode="out-in">
            <div>
              <Suspense>
                <!-- main content -->
                <component :is="Component"></component>

                <!-- loading state -->
                <template #fallback>
                  <div>
                    <q-linear-progress
                      dark
                      rounded
                      indeterminate
                      color="secondary"
                      class="q-mt-sm"
                    />
                    <q-inner-loading
                      :showing="true"
                      label="Carregando..."
                      label-class="text-teal"
                      label-style="font-size: 1.1em"
                    />
                  </div>
                </template>
              </Suspense>
            </div>
          </Transition>
        </template>
      </RouterView>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const drawer = ref(false);
const menuList = [
  {
    icon: 'inbox',
    label: 'Reviews',
    separator: true,
    link: '/',
  },
  {
    icon: 'inbox',
    label: 'Restaurantes',
    separator: true,
    link: '/restaurantes',
  },
  {
    icon: 'inbox',
    label: 'Categorias',
    separator: true,
    link: '/categorias',
  },
  {
    icon: 'inbox',
    label: 'FAQ',
    separator: true,
    link: '/faq',
  },
];
</script>

<style scoped>
.menu-list .q-item {
  border-radius: 0 32px 32px 0;
}
</style>
