<template>
  <q-page padding>
    <!-- main content -->
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ isUpdate ? 'Editar review' : 'Adicionar review' }}
        </p>
      </div>

      <q-form
        class="col-xs-12 q-gutter-y-md justify-center"
        @submit.prevent="handleSubmit"
      >
        <div class="row justify-center">
          <div class="q-pr-lg q-pt-md text-center col-xs-12 col-sm-6">
            <q-date v-model="form.date" today-btn mask="YYYY-MM-DD" />
          </div>

          <div class="col-xs-12 col-sm-6 q-py-md q-gutter-y-md">
            <q-input
              v-model="form.prato"
              label="Nome do prato"
              filled
              :rules="[(val) => val !== null || 'Requerido']"
            />

            <q-select
              label="Restaurante"
              v-model.lazy="form.restaurant_id"
              :options="restaurantSelect"
              :loading="loading"
              :disable="loading"
              option-label="nome"
              option-value="id"
              use-chips
              filled
              emit-value
              map-options
              use-input
              input-debounce="0"
              hide-selected
              fill-input
              @filter="filterRestaurant"
              :rules="[(val) => val.length !== 0 || 'Requerido']"
              lazy-rules
              options-selected-class="text-deep-orange teal"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    <q-btn @click="handleCreateRestaurant()">
                      Adicionar {{ newRestaurant }}?</q-btn
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              label="Valor"
              filled
              v-model="form.valor"
              mask="#,##"
              unmasked-value
              fill-mask="0"
              reverse-fill-mask
              prefix="R$"
              :loading="loading"
              :disable="loading"
              :rules="[(val) => val !== 0 || 'Requerido']"
            ></q-input>

            <div>
              Nota sentimental:
              <q-rating
                v-model="form.nota_sentimental"
                size="2em"
                hint
                :max="4"
                color="primary"
                :rules="[(val) => val !== 0 || 'Requerido']"
              />
            </div>
            <q-input
              filled
              autogrow
              v-model="form.obs_sentimental"
              label="Comentario sentimental"
              lazy-rules
            />
          </div>
        </div>

        <q-separator></q-separator>

        <div class="row justify-center">
          <div class="q-pr-lg q-pt-md text-center col-xs-12 col-sm-6">
            <q-uploader
              label="Fotos do prato"
              multiple
              :loading="loading"
              @added="addToState"
              hide-upload-btn
            />

            <div v-if="isUpdate">
              <div v-for="(photo, i) in form.photos" :key="photo">
                <q-card class="my-card" flat bordered>
                  <q-card-section horizontal>
                    <q-img
                      :src="photo"
                      spinner-color="white"
                      style="height: 140px; max-width: 150px"
                    />

                    <q-card-actions vertical class="justify-around">
                      <q-btn
                        flat
                        round
                        color="red"
                        icon="delete"
                        @click="form.photos.splice(i, 1)"
                      />
                    </q-card-actions>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <div class="col-xs-12 col-sm-6 q-py-md q-gutter-y-md">
            <q-select
              label="Tipo"
              filled
              v-model="form.tipo"
              use-chips
              use-input
              @new-value="createTipo"
              @filter="filterTipo"
              input-debounce="0"
              :options="tipoSelect"
              :loading="loading"
              :disable="loading"
              type="text"
              options-selected-class="text-deep-orange"
            />
            <q-select
              label="Período"
              filled
              v-model="form.periodo"
              :options="periodoOptions"
              use-chips
              type="text"
              use-input
              @new-value="createPeriodo"
              @filter="filterPeriodo"
              input-debounce="0"
              :loading="loading"
              :disable="loading"
              options-selected-class="text-deep-orange"
            >
            </q-select>
            <div>
              Nota tecnica:
              <q-rating
                v-model="form.nota_tecnica"
                size="2em"
                :max="5"
                color="primary"
              />
            </div>

            <q-input
              filled
              autogrow
              v-model="form.obs_tecnico"
              label="Comentario Tecnico"
              lazy-rules
            />

            <q-checkbox
              v-model="form.delivery"
              label="Delivery?"
              color="success"
            />
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
          :to="{ name: 'food-review' }"
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
const table = 'reviews';
const returnRouteName = { name: 'form-food-review' };
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
  valor: 0,
  prato: '',
  date: '',
  tipo: null,
  periodo: null,
  nota_sentimental: 0,
  obs_sentimental: '',
  nota_tecnica: 0,
  obs_tecnico: '',
  restaurant_id: null,
  photos: [],
});
let periodoOptions = ref([]);
let periodoSelect = ref([]);
const restaurantOptions = ref();
const restaurantSelect = ref();
const newRestaurant = ref('');
const photosState = ref([]);
let tipoSelect = ref([]);
let tipoOptions = ref([]);
// verify if path has id, if so shows edit form
const isUpdate = computed(() => route.params.id);
onMounted(() => {
  if (isUpdate.value) {
    handleGetById(isUpdate.value);
  }
  handleListOptions();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Se esta for uma solicitação POST de entrada para a
  // URL de "ação" registrada, responda a ela.
  if (event.request.method === 'POST' && url.pathname === '/form-food-review') {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const link = formData.get('link') || '';
        const responseUrl = await saveBookmark(link);
        return Response.redirect(responseUrl, 303);
      })()
    );
  }
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
