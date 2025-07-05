// firebase-messaging-sw.js

// Importamos los scripts de Firebase (esto es necesario en el Service Worker)
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// --- INICIO DE LA NUEVA LÓGICA DE CACHÉ ---

// Nombre y versión de nuestra caché. Cambiar la versión limpiará la caché vieja.
const CACHE_NAME = 'directoriopro-cache-v1';

// Lista de archivos y recursos que forman el "esqueleto" de la aplicación.
// Estos se guardarán en la memoria del dispositivo durante la instalación.
const URLS_TO_CACHE = [
  '/DirectorioLR/',
  '/DirectorioLR/index.html',
  '/DirectorioLR/app.js',
  '/DirectorioLR/manifest.json',
  '/DirectorioLR/icon-192x192.png',
  '/DirectorioLR/icon-512x512.png',
  'https://cdn.tailwindcss.com', // Tailwind CSS
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', // Font Awesome
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', // Swiper JS
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css' // Swiper CSS
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando y guardando en caché el esqueleto de la app...');
  // Esperamos a que la promesa de guardado en caché se complete.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la aplicación solicita un recurso (una imagen, un script, etc.).
self.addEventListener('fetch', event => {
  event.respondWith(
    // 1. Buscamos primero en la caché.
    caches.match(event.request)
      .then(response => {
        // Si encontramos una respuesta en la caché, la devolvemos inmediatamente.
        if (response) {
          // console.log('[Service Worker] Recurso encontrado en caché:', event.request.url);
          return response;
        }

        // 2. Si no está en la caché, vamos a la red a buscarlo.
        // console.log('[Service Worker] Recurso no encontrado en caché, buscando en la red:', event.request.url);
        return fetch(event.request);
      })
  );
});

// --- FIN DE LA NUEVA LÓGICA DE CACHÉ ---


// --- LÓGICA DE NOTIFICACIONES (SIN CAMBIOS) ---

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBM91yvFBEU9NDSEZKQyFHU6bhqCPgY3Uc",
  authDomain: "directoriopro-los-reyes.firebaseapp.com",
  projectId: "directoriopro-los-reyes",
  storageBucket: "directoriopro-los-reyes.firebasestorage.app",
  messagingSenderId: "689785400797",
  appId: "1:689785400797:web:5b91b320d6aa70ae669a34"
};

// Inicializamos la app de Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Obtenemos la instancia de Messaging
const messaging = firebase.messaging();

// Manejador para notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Mensaje recibido en segundo plano: ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/DirectorioLR/icon-192x192.png' // Asegúrate que la ruta del ícono sea correcta
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
