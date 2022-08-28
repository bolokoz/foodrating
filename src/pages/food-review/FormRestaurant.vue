<template>
  <q-page padding>
    <!-- main content -->
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ isUpdate ? 'Editar restaurante' : 'Adicionar restaurante' }}
        </p>
      </div>

      <q-form
        class="col-xs-12 q-gutter-y-md justify-center"
        @submit.prevent="handleSubmit"
      >
        <div class="row justify-center">
          <div class="col-xs-12 col-sm-8 q-py-md q-gutter-y-md">
            <q-input
              v-model="form.nome"
              label="Nome do restaurante"
              filled
              :rules="[(val) => val !== null || 'Requerido']"
            />

            <div>MAPA</div>
          </div>
        </div>
        <q-btn
          key="button1"
          :label="isUpdate ? 'Salvar Edição' : 'Salvar'"
          :color="isUpdate ? 'info' : 'primary'"
          class="full-width"
          rounded
          :loading="loading"
          :disable="loading"
          type="submit"
        ></q-btn>

        <q-btn
          key="button2"
          label="Voltar"
          color="warning"
          class="full-width"
          :loading="loading"
          :disable="loading"
          flat
          :to="{ name: 'restaurant' }"
        ></q-btn>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import useApi from 'src/composables/UseApi';

import useNotify from 'src/composables/UseNotify';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const table = 'restaurants';
const returnRouteName = { name: 'restaurant' };
const router = useRouter();
const route = useRoute();
const { post, simplePost, getById, update, uploadImg, list, removeFile } =
  useApi();
const { notifyNegative, notifySuccess } = useNotify();
const loading = ref(false);
let item = {};
let tipos = ref([]);
// let supplierNames = ref([]);
// let supplierNew = ref('');
const form = ref({
  nome: '',
  latlng: '',
});
const isUpdate = computed(() => route.params.id);
onMounted(() => {
  if (isUpdate.value) {
    handleGetById(isUpdate.value);
  }
  handleListOptions();
});
const handleSubmit = async () => {
  try {
    loading.value = true;
    if (photosState.value.length > 0) {
      for await (const photo of photosState.value) {
        await uploadImg(photo, 'reviews').then((res) =>
          form.value.photos.push(res)
        );
      }
    }
    if (isUpdate.value) {
      console.log('update', form.value);
      await update(table, form.value);
      notifySuccess('Editado com Sucesso');
    } else {
      console.log('insert', form.value);
      await post(table, form.value);
      notifySuccess('Adicionado com Sucesso');
    }
    loading.value = false;
    router.push({ name: 'food-review' });
  } catch (error) {
    notifyNegative(error.message);
    loading.value = false;
  }
};
const handleCreateRestaurant = async () => {
  try {
    loading.value = true;
    await simplePost('restaurants', { nome: newRestaurant.value });
    loading.value = false;
    notifySuccess('Adicionado com Sucesso');
    handleListOptions();
  } catch (error) {
    notifyNegative(error.message);
    loading.value = false;
  }
};
const handleListOptions = async () => {
  try {
    loading.value = true;
    restaurantOptions.value = await list('restaurants');
    const reviewList = await list(table);
    restaurantSelect.value = restaurantOptions.value;
    tipoOptions.value = [
      ...new Set(reviewList.map((d) => d.tipo).filter((d) => d)),
    ];
    tipoSelect.value = tipoOptions.value;
    periodoOptions.value = [
      ...new Set(reviewList.map((d) => d.periodo).filter((d) => d)),
    ];
    loading.value = false;
  } catch (error) {
    notifyNegative(error.message);
    loading.value = false;
  }
};
const handleGetById = async (id) => {
  try {
    loading.value = true;
    item = await getById(table, id);
    form.value = item;

    loading.value = false;
  } catch (error) {
    notifyNegative(error.message);
    loading.value = false;
  }
};
function filterRestaurant(val, update) {
  newRestaurant.value = val;
  if (val === '') {
    update(() => {
      restaurantSelect.value = restaurantOptions.value;
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    restaurantSelect.value = restaurantOptions.value.filter(
      (v) => v.nome.toLowerCase().indexOf(needle) > -1
    );
  });
}
function createTipo(val, done) {
  if (val.length > 0) {
    if (!tipoOptions.value.includes(val)) {
      tipoOptions.value.push(val);
    }
    done(val, 'toggle');
  }
}

function filterTipo(val, update) {
  update(() => {
    if (val === '') {
      tipoSelect.value = tipoOptions.value;
    } else {
      const needle = val.toLowerCase();
      tipoSelect.value = tipoOptions.value.filter(
        (v) => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}
function createPeriodo(val, done) {
  if (val.length > 0) {
    if (!periodoOptions.value.includes(val)) {
      periodoOptions.value.push(val);
    }
    done(val, 'toggle');
  }
}

function filterPeriodo(val, update) {
  update(() => {
    if (val === '') {
      periodoSelect.value = periodoOptions.value;
    } else {
      const needle = val.toLowerCase();
      periodoSelect.value = periodoOptions.value.filter(
        (v) => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

function addToState(filesArray) {
  photosState.value = filesArray;
}
</script>
