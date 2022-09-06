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

        <q-toolbar-title>
          Boloko Food Ratings
          <!-- EngeBeck | {{ store.selectedProject.name }} -
          {{ $route.name }} -->

          <!-- <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="EngeBeck" />
            <q-breadcrumbs-el :label="store.user.name" icon="profile" />
            <q-breadcrumbs-el
              :label="store.selectedProject?.name"
              icon="widgets"
            />
            <q-breadcrumbs-el :label="$route.name" />
          </q-breadcrumbs> -->
        </q-toolbar-title>
        <q-btn-dropdown icon="person" flat>
          <q-list>
            <!-- <q-item clickable v-close-popup @click="handleProfile">
              <q-item-section>
                <q-item-label>Perfil</q-item-label>
              </q-item-section>
            </q-item> -->
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <q-list padding>
        <!-- <q-item-label header>Usuario</q-item-label>
        <q-item clickable v-ripple to="form-profile">
          <q-item-section avatar>
            <q-avatar>
              <img :src="store.user !== null ? store.user.avatar_url : ''" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>{{ store.user?.email }}</q-item-label>
            <q-item-label>{{ store.user?.name }}</q-item-label>
            <q-item-label caption>Clique para editar</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced /> -->
        <!-- <q-item-label header>Projeto atual</q-item-label>

        <q-item
          clickable
          v-ripple
          to="project"
          :color="store.selectedProject?.color"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="dashboard" />
          </q-item-section>

          <q-item-section>{{ store.selectedProject?.name }}</q-item-section>
        </q-item> -->

        <!-- <q-separator spaced /> -->

        <q-item-label header> Menu </q-item-label>

        <q-item
          v-for="(link, i) in linksList"
          :key="i"
          clickable
          tag="a"
          :to="link.link"
          exact
        >
          <q-item-section v-if="link.icon" avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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

<script>
import { defineComponent, ref, onMounted } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Public view',
    caption: '',
    icon: 'mdi-home',
    link: { name: 'index' },
  },
  {
    title: 'Food Review',
    caption: 'Add Food Review',
    icon: 'mdi-food',
    link: { name: 'form-food-review' },
  },
  {
    title: 'List Reviews',
    caption: 'Ver todas reviews',
    icon: 'mdi-cash',
    link: { name: 'food-review' },
  },
  {
    title: 'List Restaurants',
    caption: '',
    icon: 'mdi-receipt',
    link: 'restaurant',
  },
];

import useAuthUser from 'src/composables/UseAuthUser';
import useNotify from 'src/composables/UseNotify';
import useApi from 'src/composables/UseApi';
import useBrand from 'src/composables/UseBrand';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userConfig';
export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const router = useRouter();

    const { logout } = useAuthUser();

    const $q = useQuasar();

    const { user } = useAuthUser();
    const { supabase, projectById, list } = useApi();
    const { notifyNegative, notifySuccess } = useNotify();
    const { setBrand } = useBrand();

    const store = useUserStore();

    onMounted(() => {
      handleUserSettings();
    });

    async function handleUserSettings() {
      // if (store.user.default_project !== null) {
      //   store.selectedProject = await projectById(store.user.default_project);
      // } else {
      //   router.replace({ name: 'project' });
      // }
      // const projectQuery = await supabase.from('project').select('*');
      // store.projects = projectQuery.data;
      // setBrand(config.value.primary, config.value.secondary);
    }

    const handleLogout = async () => {
      $q.dialog({
        title: 'Logout',
        message: 'Deseja realmente sair?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await logout();
        router.replace({ name: 'login' });
      });
    };
    const handleProfile = async () => {
      router.replace({ name: 'form-profile' });
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      handleLogout,
      handleProfile,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      user,
      store,
      linksList,
    };
  },
});
</script>
