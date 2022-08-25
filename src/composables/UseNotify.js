import { useQuasar } from 'quasar';
export default function useNotify() {
  const $q = useQuasar();

  const notifySuccess = (message) => {
    $q.notify({
      type: 'positive',
      message: message || 'Success',
    });
  };
  const notifyNegative = (message) => {
    $q.notify({
      type: 'negative',
      message: message || 'Failed',
    });
  };
  const notifyWarning = (message) => {
    $q.notify({
      type: 'warning',
      message: message || 'Warning',
    });
  };

  return {
    notifyNegative,
    notifySuccess,
    notifyWarning,
  };
}
