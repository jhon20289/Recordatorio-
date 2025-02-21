importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

self.addEventListener('push', function(event) {
    let notificationData = {};
    
    if (event.data) {
        notificationData = event.data.json();
    }

    const title = notificationData.title || "📢 Notificación";
    const message = notificationData.message || "Tienes un nuevo recordatorio.";
    const icon = notificationData.icon || "/icon.png";

    const options = {
        body: message,
        icon: icon,
        badge: "/icon-192x192.png",
        vibrate: [200, 100, 200],
        actions: [
            { action: "open", title: "Abrir" },
            { action: "close", title: "Cerrar" }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === "open") {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
