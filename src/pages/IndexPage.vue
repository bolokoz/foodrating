<template>
  <q-page class="row items-center justify-evenly">
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
        style="width: 250px"
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
import { useQuasar, useDialogPluginComponent } from 'quasar';
import { api } from 'boot/axios';
import newRestaurantDialog from 'src/components/newRestaurantDialog.vue';

const $q = useQuasar();

// const prisma = new PrismaClient();

const date = ref();

const prato = ref('');
const tipo = ref('');
const valor = ref(20);
const restaurante = ref();
const comentario_sentimental = ref('');
const comentario_tecnico = ref('');
const nota_sentimental = ref(0);
const nota_tecnica = ref(0);

const newRestaurant = ref('');
const newRestaurantLatLng = ref('');

const restauranteOptions = ref();
const restaurantList = ref();
const tipoOptions = ref([]);

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

// const handleGetCategory = async (id) => {
//   try {
//     category = await getById(table, id);
//     form.value = category;
//   } catch (error) {
//     notifyError(error.message);
//   }
// };

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
      onReset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally();
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
      restaurantList.value = data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally((restauranteOptions.value = restaurantList.value));
}
</script>
