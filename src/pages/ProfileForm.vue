<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Editar Perfil</p>
      </div>
      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <q-input
          label="Seu apelido"
          :loading="loading"
          v-model="form.name"
          :rules="[(val) => (val && val.length > 0) || 'Apelido']"
        />

        <q-input
          label="Telefone"
          :loading="loading"
          v-model="form.phone"
          mask="(##) #####-####"
          unmasked-value
        />

        <q-avatar v-if="form.avatar_url.length > 0">
          <img :src="form.avatar_url" />
        </q-avatar>

        <q-input
          :label="form.avatar_url.length > 0 ? 'Editar' : 'Nova foto de perfil'"
          stack-label
          :loading="loading"
          v-model="avatar"
          type="file"
          accept="image/*"
        />

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-color
            v-model="form.primary"
            :loading="loading"
            class="col-md-4 col-sm-12 col-xs-12"
            size="250px"
          />

          <q-color
            v-model="form.secondary"
            class="col-md-4 col-sm-12 col-xs-12"
          />
        </div>

        <q-btn
          label="Salvar"
          color="primary"
          class="full-width"
          rounded
          :loading="loading"
          :disable="loading"
          type="submit"
        />

        <q-btn
          label="Cancelar"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'home' }"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import useApi from 'src/composables/UseApi';
import useNotify from 'src/composables/UseNotify';
import useBrand from 'src/composables/UseBrand';
import userAuthUser from 'src/composables/UseAuthUser';

export default defineComponent({
  name: 'PageFormProfile',
  setup() {
    const table = 'profile';
    const router = useRouter();
    const { post, listPublic, update, uploadImg } = useApi();
    const { notifyNegative, notifySuccess } = useNotify();
    const { setBrand } = useBrand();
    const { user } = userAuthUser();

    let profile = {};
    const avatar = ref([]);
    const loading = ref(false);
    const form = ref({
      name: '',
      phone: '',
      primary: '',
      secondary: '',
      avatar_url: '',
    });

    onMounted(() => {
      handleGetProfile();
    });

    watch(form, (newValue) => {
      setBrand(form.value.primary, form.value.secondary);
    });
    const handleSubmit = async () => {
      try {
        if (avatar.value.length > 0) {
          const avatar_url = await uploadImg(avatar.value[0], 'avatars');
          form.value.avatar_url = avatar_url;
        }
        if (form.value.id) {
          loading.value = true;
          await update(table, form.value);
          loading.value = false;
          notifySuccess('Update Successfully');
        } else {
          loading.value = true;
          await post(table, { id: user.value.id, ...form.value });
          loading.value = false;
          notifySuccess('Saved Successfully');
        }
        setBrand(form.value.primary, form.value.secondary);
        router.push({ name: 'home' });
      } catch (error) {
        notifyNegative(error.message);
        loading.value = false;
      }
    };

    const handleGetProfile = async () => {
      try {
        loading.value = true;
        profile = await listPublic(table, user.value.id);

        if (profile.length > 0) {
          form.value = profile[0];
        }
        loading.value = false;
      } catch (error) {
        notifyNegative(error.message);
        loading.value = false;
      }
    };

    return {
      handleSubmit,
      form,
      avatar,
      loading,
    };
  },
});
</script>
