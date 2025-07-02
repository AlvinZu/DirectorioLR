// firebase-messaging-sw.js

// Importamos los scripts de Firebase (esto es necesario en el Service Worker)
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Tu configuración de Firebase, la misma que en el paso 1
const firebaseConfig = {
  apiKey: "AIzaSyBM91yvFBEU9NDSEZKQyFHU6bhqCPgY3Uc",
  authDomain: "directoriopro-los-reyes.firebaseapp.com",
  projectId: "directoriopro-los-reyes",
  storageBucket: "directoriopro-los-reyes.firebasestorage.app",
  messagingSenderId: "689785400797",
  appId: "1:689785400797:web:5b91b320d6aa70ae669a34"
};

// Inicializamos la app de Firebase
firebase.initializeApp(firebaseConfig);

// Obtenemos la instancia de Messaging
const messaging = firebase.messaging();

// Este manejador se ejecuta cuando una notificación push llega
// y la PWA está en segundo plano o cerrada.
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Personalizamos la notificación que se mostrará
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
