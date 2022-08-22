<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div>lat {{ coords.latitude }}</div>
        <div>lng {{ coords.longitude }}</div>
        <div>acc {{ coords.accuracy }}</div>
        <div>alt {{ coords.altitude }}</div>
        <div>alt acc {{ coords.altitudeAccuracy }}</div>
        <div>heading {{ coords.heading }}</div>
        <div>speed {{ coords.speed }}</div>
        <div>timestamp {{ coords.timestamp }}</div>
        <div>located at {{ locatedAt }}</div>
        <div>error {{ error }}</div>

        {{ text }}
      </q-card-section>

      <button @click="requestDevice()">Request Bluetooth Device</button>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
// const { coords, locatedAt, error } = useGeolocation();
import { useDialogPluginComponent } from 'quasar';
const props = defineProps({
  // ...your custom props
  text: {
    type: String,
  },
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  // onDialogOK({ coords, locatedAt });
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
