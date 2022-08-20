<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-date v-model="date" today-btn mask="DD/MM/YYYY"> </q-date>

      <q-select
        label="Restaurante"
        :options="restauranteOptions"
        filled
        option-value="Id"
        option-label="nome"
        emit-value
        map-options
        v-model="restaurante"
        use-input
        use-chips
        input-debounce="0"
        new-value-mode="add-unique"
        style="width: 250px"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.nome }}</q-item-label>
              <q-item-label caption>{{ scope.opt.tipo }}</q-item-label>
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

      <q-input
        filled
        type="number"
        v-model="valor"
        label="Valor"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Colocar o valor do prato',
          (val) => val > 0 || 'Please coloca valor positivo',
        ]"
      />

      <q-input
        filled
        v-model="comentario_sentimental"
        label="Comentario sentimental"
        lazy-rules
      />

      <q-input
        filled
        v-model="comentario_tecnico"
        label="Comentario Tecnico"
        lazy-rules
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
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
import { useQuasar } from 'quasar';

import { api } from 'boot/axios';
import { PrismaClient } from '@prisma/client';

const $q = useQuasar();

// const prisma = new PrismaClient();

const date = ref(new Date().toLocaleDateString());

const prato = ref('');
const tipo = ref('');
const valor = ref(20);
const restaurante = ref();
const comentario_sentimental = ref('');
const comentario_tecnico = ref('');
const nota_sentimental = ref(0);
const nota_tecnica = ref(0);
const allUsers = ref();

const restauranteOptions = ref([]);
const tipoOptions = ref([]);

onMounted(() => {
  get();
});

function onSubmit() {
  post();
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

async function post() {
  let postData = {
    prato: prato.value,
    valor: valor.value,
    tipo: tipo.value,
    date: date.value,
    comentario_sentimental: comentario_sentimental.value,
    comentario_tecnico: comentario_tecnico.value,
    nota_sentimental: nota_sentimental.value,
    nota_tecnica: nota_tecnica.value,
    restaurante: restaurante.value,
  };
  await api
    .post('food', postData)
    .then(function (response) {
      console.log('response ', response);

      updateRowRestaurant(response.data.Id, postData.restaurante);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(onReset());
}

function testToSeeIfWorks() {
  axios
    .get(
      `http://localhost:8000/wp-json/wp/v2/blog/${this.props.match.params.id}`
    )
    .then((res) =>
      this.setState(
        {
          graduatepost: res.data,
          category: res.data.categories[0],
          featured_media: res.data.featured_media,
          isLoaded: true,
        },
        () =>
          axios
            .get(
              `http://localhost:8000/wp-json/wp/v2/media/${this.state.featured_media}`
            )
            .then((res) => {
              this.setState({
                imgURL: res[0].data.media_details.sizes.full.source_url,
                isLoaded: true,
              });
            })
      )
    )
    .catch((err) => console.log(err));
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
      console.log(
        'get',
        data
        // data.map((d) => d.restaurante[0]?.nome)
      );
      restauranteOptions.value = data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally();
}
</script>
