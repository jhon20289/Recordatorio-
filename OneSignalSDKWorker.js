<!-- Cargar el SDK de OneSignal -->
<script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"></script>
<script>
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(() => {
    OneSignal.init({
      appId: "TU-APP-ID-DE-ONESIGNAL", // Reemplaza con tu App ID real
      serviceWorkerPath: "OneSignalSDKWorker.js" // Ajusta la ruta si tu archivo worker está en otro lugar
    });
  });
</script>
