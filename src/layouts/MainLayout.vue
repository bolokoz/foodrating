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
            <q-item clickable v-close-popup @click="handleProfile">
              <q-item-section>
                <q-item-label>Perfil</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list bordered padding>
        <q-item-label header>Usuario</q-item-label>
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
        <q-separator spaced />
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

        <q-separator spaced />

        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-expansion-item
          icon="mdi-mail"
          label="Relatorios"
          default-opened
          :content-inset-level="0.5"
        >
          <q-item
            v-for="item in relatoriosList"
            :key="item.title"
            clickable
            :to="{ name: item.route }"
            exact
          >
            <q-item-section v-if="item.icon" avatar>
              <q-icon :name="item.icon"> </q-icon>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ item.title }} </q-item-label>
              <q-item-label caption> {{ item.caption }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Home',
    caption: '',
    icon: 'mdi-home',
    link: 'home',
  },
  {
    title: 'Perfil',
    caption: '',
    icon: 'mdi-account',
    link: 'form-profile',
  },
  {
    title: 'Food Reviews',
    caption: 'Add Food Review',
    icon: 'mdi-food',
    link: 'form-food-review',
  },
  {
    title: 'Pagamentos',
    caption: '',
    icon: 'mdi-cash',
    link: 'pagamento',
  },
  {
    title: 'Receitas',
    caption: '',
    icon: 'mdi-receipt',
    link: 'receita',
  },
  {
    title: 'Fornecedores',
    caption: '',
    icon: 'mdi-factory',
    link: 'supplier',
  },
  {
    title: 'Projetos',
    caption: '',
    icon: 'mdi-home-group',
    link: 'project',
  },
  {
    title: 'Contas',
    caption: '',
    icon: 'mdi-bank',
    link: 'account',
  },
  {
    title: 'Categorias',
    caption: '',
    icon: 'mdi-shape',
    link: 'category',
  },
];

const relatoriosList = [
  {
    title: 'Resasrcimento',
    caption: '',
    icon: 'mdi-shape',
    routeName: 'relatorio-ressarcimento',
  },
  {
    title: 'Administracao',
    caption: '',
    icon: 'mdi-shape',
    routeName: 'relatorio-administracao',
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
      relatoriosList,
      store,
    };
  },
});
</script>
