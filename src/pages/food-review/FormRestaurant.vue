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
          </div>
          <div class="col-xs-12 col-sm-8 q-py-md q-gutter-y-md">
            <q-input v-model="form.cidade" label="Cidade" filled />
          </div>
          <div class="col-xs-12 col-sm-8 q-py-md q-gutter-y-md">
            <q-input v-model="form.latlng" label="Lat Lng" filled />
          </div>
        </div>
        <mapbox-map
          :accessToken="myAccessToken"
          :center="[lat, lng]"
          :zoom="10"
          @update:center="mapUpdate"
        >
          <mapbox-geocoder-control
            countries="br,py"
            :accessToken="myAccessToken"
            types="poi,place"
            :trackProximity="true"
            @result="handleResult"
          >
          </mapbox-geocoder-control>
          <mapbox-marker
            :lngLat="[mlng, mlat]"
            :draggable="true"
            color="#f268F2"
            @dragend="handleDragend"
          />
          <mapbox-geolocate-control />
        </mapbox-map>

        <!-- <div id="map" class="map-container" style="height: 400px"></div> -->
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

<script setup lang="ts">
import useApi from 'src/composables/UseApi';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import useNotify from 'src/composables/UseNotify';
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import {
  MapboxMap,
  MapboxGeocoderControl,
  MapboxMarker,
  MapboxGeolocateControl,
} from 'vue-mapbox-ts';

const myAccessToken =
  'pk.eyJ1IjoiYm9sb2tvem9yZCIsImEiOiJjbDdkd3doeGkxNmxsM3Vxb2V2ZHU1bHptIn0.Fv6KN808iR-NcgYUoX91gw';
// const mapContainer = ref(null);
// const map = ref(null);
const lat = ref(-54.5816576);
const lng = ref(-20.4505088);
const mlat = ref(-54.5816576);
const mlng = ref(-20.4505088);

const table = 'restaurants';

// watchEffect(() => {
//   if (map.value?.current) return;
// });
const returnRouteName = { name: 'restaurant' };
const router = useRouter();
const route = useRoute();
const { post, simplePost, getById, update, uploadImg, list, removeFile } =
  useApi();
const { notifyNegative, notifySuccess } = useNotify();
const loading = ref(false);
const marker = ref([12, 32]);
const browserLocation = ref();
let item = {};
// let supplierNames = ref([]);
// let supplierNew = ref('');
const form = ref({
  nome: '',
  latlng: '',
  cidade: '',
});
const isUpdate = computed(() => route.params.id);

function handleResult(response) {
  form.value.nome = response.text;
  form.value.latlng = response?.center.toString();
  form.value.cidade = response?.context[2].text;
}

function mapUpdate(e) {
  console.log('map udpate', e);
  mlng.value = e[0];
  mlat.value = e[1];
}

onMounted(() => {
  if (isUpdate.value) {
    handleGetById(isUpdate.value);
  }
  handleListOptions();
});
const handleSubmit = async () => {
  try {
    loading.value = true;
    // if (photosState.value.length > 0) {
    //   for await (const photo of photosState.value) {
    //     await uploadImg(photo, 'reviews').then((res) =>
    //       form.value.photos.push(res)
    //     );
    //   }
    // }
    if (isUpdate.value) {
      // console.log('update', form.value);
      await update(table, form.value);
      notifySuccess('Editado com Sucesso');
    } else {
      // console.log('insert', form.value);
      await post(table, form.value);
      notifySuccess('Adicionado com Sucesso');
    }
    loading.value = false;
    router.push({ name: 'restaurant' });
  } catch (error) {
    notifyNegative(error.message);
    loading.value = false;
  }
};
function handleDragend(e) {
  console.log(e);
  lat.value = e.target._lngLat.lat;
  lng.value = e.target._lngLat.lng;
}

// function mapLoaded() {
//   MapboxMap.fly;
// }
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
    await navigator.geolocation.getCurrentPosition((pos) => {
      // console.log(pos.coords);
      lat.value = pos?.coords.latitude;
      lng.value = pos?.coords.longitude;
      // console.log('arr', arr);
      browserLocation.value = {
        lat: pos?.coords.latitude,
        lng: pos?.coords.longitude,
      };
      marker.value = [lat.value, lng.value];
      // loadMap(pos?.coords.latitude, pos?.coords.longitude);
    });
    loading.value = false;
  } catch (error) {
    notifyNegative(error.message);
    loading.value = false;
  }
};
const loadMap = async (lat: number, lng: number) => {
  mapboxgl.accessToken = myAccessToken;
  console.log('location', lat, lng);
  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [lng, lat],
    zoom: 14,
  });
  map.value.on('load', (e) => {
    console.log('map loaded', e);
  });
  return {};
};
const handleGetById = async (id) => {
  try {
    loading.value = true;
    item = await getById(table, id);
    form.value = item;
    marker.value = form.value?.latlng;
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
