<template>
  <Suspense>
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
            <div class="q-pr-lg q-pt-md text-center col-xs-12 col-sm-4">
              <q-date
                v-model="form.date"
                today-btn
                mask="YYYY-MM-DD"
                style="width: 250px"
              />
            </div>

            <div class="col-xs-12 col-sm-8 q-py-md q-gutter-y-md">
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
            <div class="q-pr-lg q-pt-md text-center col-xs-12 col-sm-4">
              <q-uploader
                label="Fotos do prato"
                multiple
                style="max-width: 300px"
                :loading="loading"
              />
            </div>

            <div class="col-xs-12 col-sm-8 q-py-md q-gutter-y-md">
              <q-select
                label="Tipo"
                v-model="form.tipo"
                use-chips
                use-input
                @new-value="createTipo()"
                @filter="filterTipo()"
                :options="tipoOptions"
                :loading="loading"
                :disable="loading"
                options-selected-class="text-deep-orange"
              />
              <q-select
                label="Período"
                v-model="form.periodo"
                :options="periodoOptions"
                :loading="loading"
                :disable="loading"
                use-chips
                use-input
                hide-dropdown-icon
                input-debounce="0"
                new-value-mode="add-unique"
                options-selected-class="text-deep-orange teal"
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
            :label="isUpdate ? 'Editar' : 'Salvar'"
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
            :to="{ name: 'review' }"
          ></q-btn>
        </q-form>
      </div>
      <!-- loading state -->
      <template #fallback> Loading... </template>
    </q-page>
  </Suspense>
</template>

<script setup>
import useApi from 'src/composables/UseApi';

import useNotify from 'src/composables/UseNotify';
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  defineAsyncComponent,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
const table = 'reviews';
const returnRouteName = { name: 'review' };
const router = useRouter();
const route = useRoute();
const {
  post,
  simplePost,
  getById,
  update,
  uploadImg,
  list,
  removeFile,
  getAccountsFromProject,
  listUniqueFromColumn,
} = useApi();
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
let nota = ref([]);
let comprovante = ref([]);
let periodoOptions = ref([]);
const restaurantOptions = await list('restaurants');
let restaurantSelect = ref([]);
const newRestaurant = ref('');
let tipoOptions = ref([]);
let tipoOptionsRaw = ref([]);
// verify if path has id, if so shows edit form
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
    // if (comprovante.value?.length > 0) {
    //   const receiptUrl = await uploadImg(comprovante.value[0], 'receipt');
    //   form.value.receipt_url = receiptUrl;
    // }
    // if (nota.value?.length > 0) {
    //   const invoiceUrl = await uploadImg(nota.value[0], 'invoice');
    //   form.value.invoice_url = invoiceUrl;
    // }
    if (isUpdate.value) {
      await update(table, form.value);
      notifySuccess('Editado com Sucesso');
    } else {
      await post(table, form.value);
      notifySuccess('Adicionado com Sucesso');
    }
    loading.value = false;
    router.push(returnRouteName);
  } catch (error) {
    notifyNegative(error.message);
    loading.value = false;
  }
};
const handleCreateRestaurant = async () => {
  try {
    loading.value = true;
    await simplePost('supplier', { name: newRestaurant.value });
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
    // restaurantOptions.value = await list('restaurants');
    const reviewList = await list(table);
    restaurantSelect.value = restaurantOptions.value;
    tipoOptionsRaw.value = [
      ...new Set(reviewList.map((d) => d.tipo).filter((d) => d)),
    ];
    tipoOptions.value = tipoOptionsRaw.value;
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
function comprovanteAdded(file) {
  comprovante.value = file;
}
async function comprovanteRemoved() {
  try {
    loading.value = true;
    await removeFile(form.value.receipt_url, 'receipt');
    comprovante.value = null;
    form.value.receipt_url = null;
    loading.value = false;
    notifySuccess('Arquivo apagado');
  } catch (error) {
    notifyNegative(error.message);
    loading.value = false;
  }
}
function createTipo(val, done) {
  // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
  // and it resets the input textbox to empty string
  // ----
  // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
  // only if is not already set
  // and it resets the input textbox to empty string
  // ----
  // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
  // (adds to model if not already in the model, removes from model if already has it)
  // and it resets the input textbox to empty string
  // ----
  // If "var" content is undefined/null, then it doesn't tampers with the model
  // and only resets the input textbox to empty string

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
      tipoOptions.value = tipoOptionsRaw.value;
    } else {
      const needle = val.toLowerCase();
      tipoOptions.value = tipoOptions.value.filter(
        (v) => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}
</script>
