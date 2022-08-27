<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Reviews"
        :columns="desktopHeader"
        :rows="items"
        color="primary"
        :dense="$q.screen.lt.md"
        :loading="loading"
        no-data-label="Sem dados encontrados"
        row-key="id"
        class="col-12"
      >
        <template v-slot:top-right>
          <q-btn
            v-if="$q.platform.is.desktop"
            color="primary"
            icon-right="mdi-plus"
            label="Adicionar"
            :to="{ name: 'form-food-review' }"
          />

          <q-btn
            v-if="$q.platform.is.desktop"
            flat
            color="info"
            icon-right="mdi-floppy"
            @click="handleExport"
          />
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <div>{{ reais.format(props.value) }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              color="info"
              icon="mdi-pencil"
              dense
              size="sm"
              @click="handleEdit(props.row)"
            >
              <q-tooltip> Editar </q-tooltip>
            </q-btn>
            <q-btn
              color="negative"
              icon="mdi-delete"
              dense
              size="sm"
              @click="handleRemove(props.row)"
            >
              <q-tooltip> Editar </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-page-sticky position="bottom-right" :offset="[10, 10]">
      <q-btn
        fab
        icon="mdi-plus"
        color="secondary"
        :to="{ name: 'form-pagamento' }"
        v-if="$q.platform.is.mobile"
      >
        <q-tooltip>Adicionar</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
let desktopHeader = [
  {
    name: 'date',
    align: 'left',
    label: 'Data',
    field: 'date',
    sortable: true,
  },
  {
    name: 'valor',
    align: 'left',
    label: 'Valor',
    field: (row) => row?.valor / 100,
    sortable: true,
  },
  {
    name: 'prato',
    align: 'left',
    label: 'Prato',
    field: 'prato',
    sortable: false,
  },
  {
    name: 'restaurant',
    align: 'left',
    label: 'Restaurant',
    field: (row) => row?.restaurants?.nome,
    sortable: false,
  },
  {
    name: 'actions',
    align: 'right',
    label: 'Actions',
    field: 'actions',
    sortable: false,
  },
];

import { defineComponent, ref, onMounted } from 'vue';
import useApi from 'src/composables/UseApi';
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router';
import useSupabase from 'src/boot/supabase';
import useAuthUser from 'src/composables/UseAuthUser';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PagePagamento',
  // prefetch() {
  //   const store = useUserConfigStore();
  //   projectId = store.selectedProject.id;
  //   return store;
  // },
  setup() {
    const table = 'reviews';
    const items = ref([]);
    const { remove } = useApi();
    const { notifyNegative, notifyWarning } = useNotify();
    const router = useRouter();
    const loading = ref(true);
    const { user } = useAuthUser();
    const projectId = null;

    const $q = useQuasar();
    const { supabase } = useSupabase();

    const reais = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const handleList = async () => {
      try {
        loading.value = true;
        const { data, error } = await supabase.from(table).select(
          `
          id,
          valor,
          date, prato, restaurants (nome)        `
        );
        // .eq('project_id', projectId);
        // console.log('store access', store.selectedProject.id);
        items.value = data;
        if (error) throw error;
        loading.value = false;
      } catch (error) {
        notifyNegative(error.message);
      }
    };
    const handleRemove = async (item) => {
      try {
        $q.dialog({
          title: 'Confirm',
          message: `Confirma deletar ${item.description}?`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          loading.value = true;
          await remove(table, item.id);
          notifyWarning('Removido com sucesso');
          handleList();
          loading.value = false;
        });
      } catch (error) {
        notifyNegative(error.message);
        loading.value = false;
      }
    };

    const handleEdit = (item) => {
      router.push({ name: 'form-food-review', params: { id: item.id } });
    };

    const handleExport = (item) => {
      router.push({ name: 'form-food-review', params: { id: item.id } });
    };

    onMounted(() => {
      handleList();
    });

    return {
      desktopHeader,
      items,
      handleList,
      handleEdit,
      loading,
      handleRemove,
      handleExport,
      reais,
      user,
    };
  },
});
</script>
