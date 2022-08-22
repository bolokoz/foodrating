<template>
  <q-page padding class="row items-center justify-evenly">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-date v-model="date" today-btn mask="YYYY-MM-DD"> </q-date>

      <q-select
        label="Restaurante"
        :options="restauranteOptions"
        filled
        option-value="Id"
        option-label="nome"
        emit-value
        map-options
        v-model.lazy="restaurante"
        use-input
        input-debounce="0"
        use-chips
        hide-selected
        fill-input
        options-selected-class="text-deep-orange teal"
        lazy-rules
        @filter="filterRestaurant"
        @new-value="newRestaurantCreated"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.nome }}</q-item-label>
              <q-item-label caption>{{ scope.opt.tipo }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              <q-btn @click="createNewRestaurant">
                Adicionar {{ newRestaurant }}?</q-btn
              >
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input
        filled
        v-model="prato"
        label="Nome de prato"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-select
        rounded
        standout
        v-model="tipo"
        use-chips
        :options="tiposOptions"
        label="Tipo de prato"
      />
      <q-select
        rounded
        standout
        v-model="periodo"
        use-chips
        :options="periodoOptions"
        label="Periodo da refeição"
      />

      <q-checkbox v-model="delivery" label="Delivery?" />

      <q-input
        filled
        type="number"
        v-model="valor"
        label="Valor"
        prefix="R$"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Colocar o valor do prato',
          (val) => val > 0 || 'Please coloca valor positivo',
        ]"
      />

      <div>
        Nota sentimental:
        <q-rating
          v-model="nota_sentimental"
          size="2em"
          hint
          :max="4"
          color="primary"
        />
      </div>
      <q-input
        filled
        autogrow
        v-model="comentario_sentimental"
        label="Comentario sentimental"
        lazy-rules
      />

      <div>
        Nota tecnica:
        <q-rating v-model="nota_tecnica" size="2em" :max="5" color="primary" />
      </div>

      <q-input
        filled
        autogrow
        v-model="comentario_tecnico"
        label="Comentario Tecnico"
        lazy-rules
      />

      <q-uploader
        :factory="factoryFn"
        label="Fotos do prato"
        multiple
        style="max-width: 300px"
        :loading="loading"
      />

      <div>
        <q-btn
          label="Enviar"
          type="submit"
          color="primary"
          :loading="loading"
        />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar, useDialogPluginComponent, Loading } from 'quasar';
import { api } from 'boot/axios';
import newRestaurantDialog from 'src/components/newRestaurantDialog.vue';

import FormData from 'form-data';

const $q = useQuasar();

// const prisma = new PrismaClient();

const prato = ref('');
const restaurante = ref();
const periodo = ref();
const date = ref();
const valor = ref(20);
const tipo = ref();
const delivery = ref(false);
const nota_sentimental = ref(0);
const comentario_sentimental = ref('');
const nota_tecnica = ref(0);
const comentario_tecnico = ref('');
const fotos = ref();
const uploaded = ref(false);
const loading = ref(false);

const tiposOptions = ['lanche', 'pratos', 'pizza', 'saudável', 'café', 'doces'];
const periodoOptions = ['janta', 'almoço', 'café da manhã', 'tarde'];

const newRestaurant = ref('');
const newRestaurantLatLng = ref('');

const restauranteOptions = ref();
const restaurantList = ref();
const tipoOptions = ref([]);
const cloudinary = ref([]);

onMounted(() => {
  get();
});

function onSubmit() {
  post();
}

function createNewRestaurant() {
  $q.dialog({
    component: newRestaurantDialog,

    // props forwarded to your custom component
    componentProps: {
      text: newRestaurant.value,
      // ...more..props...
    },
  })
    .onOk(({ coords, location }) => {
      console.log(coords.value);
      console.log('OK');
      newRestaurantLatLng.value =
        coords.value.latitude.toString() +
        ',' +
        coords.value.longitude.toString();
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}

function filterRestaurant(val, update) {
  newRestaurant.value = val;
  if (val === '') {
    update(() => {
      restauranteOptions.value = restaurantList.value;
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    restauranteOptions.value = restaurantList.value.filter(
      (v) => v?.nome.toLowerCase().indexOf(needle) > -1
    );
  });
}

function newRestaurantCreated(val, done) {
  if (val.length > 0) {
    if (!restauranteOptions.value.includes(val)) {
      alert(val);
      restauranteOptions.value.push({ id: 4123, nome: val, cidade: 'teste' });
    }
    done(null);
  }
}

function onReset() {
  (prato.value = null),
    (valor.value = null),
    (tipo.value = null),
    (date.value = null),
    (comentario_sentimental.value = null),
    (comentario_tecnico.value = null),
    (nota_sentimental.value = null),
    (nota_tecnica.value = null),
    (restaurante.value = null);
}

async function makeNewRestaurantGetId() {
  let postData = {
    nome: newRestaurant.value,
    latlng: newRestaurantLatLng.value,
  };
  const res = await api
    .post('restaurant', postData)
    .then()
    .catch((err) => {
      console.log(err);
    })
    .finally();
  console.log('responsa novo restaurant', res);
  return res.data.Id;
}

async function uploadFiles() {
  const formData = new FormData();
  formData.append('file', fotos.value);
  formData.append(
    'json',
    JSON.stringify({
      api: 'xcAttachmentUpload',
      project_id: 'p_zyl1kbbklpcs4f',
      dbAlias: 'db',
      args: {},
    })
  );
  console.log('formData', formData);

  const res = await api({
    url: 'https://nocolubri.herokuapp.com/api/v1/db/storage/upload?path=noco%2Fboloko%2Ffood%2Ffotos',
    // url: 'https://nocolubri.herokuapp.com/dashboard',
    data: formData,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
    method: 'post',
    params: { project_id: 'p_zyl1kbbklpcs4f' },
  }).then((res) => {
    console.log(res);

    //  insert/update  record
  });
}

function factoryFn(files) {
  const url = 'https://api.cloudinary.com/v1_1/boloko/image/upload';

  loading.value = true;

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    formData.append('file', file);
    formData.append('upload_preset', 'hs8ogswg');

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json()) // retorna uma
      .then((result) => {
        cloudinary.value.push(result.url);
      })
      .catch((err) => {
        // trata se alguma das promises falhar
        console.error('Failed retrieving information', err);
      });
    uploaded.value = true;
    loading.value = false;
  }
}

function uploadToCloudnary() {
  const url = 'https://api.cloudinary.com/v1_1/boloko/image/upload';

  const formData = new FormData();

  for (let i = 0; i < fotos.value.length; i++) {
    let file = fotos.value[i];
    formData.append('file', file);
    formData.append('upload_preset', 'hs8ogswg');

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        cloudinary.value.push(data);
      });
  }
}

function insertImage(callbackOK, callbackError) {
  const image_path = 'C:\Users\debor\OneDrive\Imagens\tstes.png';
  const project_id = 'p_zyl1kbbklpcs4f';
  const formData = new FormData();
  formData.append('file', fotos.value);
  formData.append(
    'json',
    JSON.stringify({
      api: 'xcAttachmentUpload',
      project_id: project_id,
      dbAlias: 'db',
      args: {},
    })
  );
  api({
    url: 'https://nocolubri.herokuapp.com/api/v1/db/storage/upload',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
    method: 'post',
    params: { path: 'noco/boloko/food/fotos' },
  })
    .then(function (response) {
      // handle success
      //console.log(response.data);
      return callbackOK(response.data);
    })
    .catch(function (error) {
      // handle error
      //console.log(error);
      return callbackError(error);
    });
}

async function post() {
  let postData = {
    prato: prato.value,
    valor: valor.value,
    tipo: tipo.value,
    date: date.value,
    nota_sentimental: nota_sentimental.value,
    comentario_sentimental: comentario_sentimental.value,
    nota_tecnica: nota_tecnica.value,
    comentario_tecnico: comentario_tecnico.value,
    periodo: periodo.value,
    delivery: delivery.value,
    fotos: JSON.stringify(cloudinary.value),
  };
  postData.restaurante =
    restaurante.value == undefined
      ? await makeNewRestaurantGetId()
      : restaurante.value;
  await api
    .post('food', postData)
    .then(function (response) {
      console.log('response ', response);

      updateRowRestaurant(response.data.Id, postData.restaurante);
      // onReset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally();
}

async function updateRowRestaurant(postId, restauranteId) {
  await api.post(`food/${postId}/mm/restaurant/${restauranteId}`);
}

async function get() {
  await api
    .get(
      'http://nocolubri.herokuapp.com/api/v1/db/data/noco/p_zyl1kbbklpcs4f/restaurant/views/restaurant'
    )
    .then(async (response) => {
      let data = response.data.list;
      // console.log(
      //   'get',
      //   data
      //   // data.map((d) => d.restaurante[0]?.nome)
      // );
      restaurantList.value = data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally((restauranteOptions.value = restaurantList.value));
}
</script>
