// app.js

document.addEventListener("DOMContentLoaded", function () {

    // ... (Aquí va todo tu otro código de la app que ya tienes) ...

    // --- LÓGICA DE NOTIFICACIONES PUSH ---

// Configuración de Firebase (sin cambios)
const firebaseConfig = {
    apiKey: "AIzaSyBM91yvFBEU9NDSEZKQyFHU6bhqCPgY3Uc",
    authDomain: "directoriopro-los-reyes.firebaseapp.com",
    projectId: "directoriopro-los-reyes",
    storageBucket: "directoriopro-los-reyes.firebasestorage.app",
    messagingSenderId: "689785400797",
    appId: "1:689785400797:web:5b91b320d6aa70ae669a34"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const btnActivar = document.getElementById('activar-notificaciones');

// Función para verificar y ocultar el botón (sin cambios)
function verificarEstadoNotificaciones() {
    if (!btnActivar) return;
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
        btnActivar.style.display = 'none';
    } else {
        btnActivar.style.display = 'block';
    }
}
verificarEstadoNotificaciones();

// --- CAMBIO CLAVE: Lógica de registro y obtención de token modificada ---

// Se ejecuta al hacer clic en el botón
btnActivar.addEventListener('click', () => {
    pedirPermisoYObtenerToken();
});

async function pedirPermisoYObtenerToken() {
    try {
        console.log("Solicitando permiso para notificaciones...");
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            console.log("Permiso de notificación concedido.");
            btnActivar.style.display = 'none';

            console.log("Registrando el Service Worker en la ruta correcta...");
            // 1. Registramos el Service Worker indicando la ruta completa dentro de tu proyecto
            const registration = await navigator.serviceWorker.register('/DirectorioLR/firebase-messaging-sw.js');
            console.log('Service Worker registrado exitosamente:', registration);

            // 2. Obtenemos el token, pasándole el Service Worker que acabamos de registrar
            const currentToken = await messaging.getToken({
                vapidKey: "BGkQS0paUdAKAMwT4jsidWnXbYb-h94QPyzMMrMb9lqnypRmYEIkSnjQ284EBExoO2o5DHId8aldMCTfu2Vm_s0",
                serviceWorkerRegistration: registration // <- Le pasamos el registro manual
            });

            if (currentToken) {
                console.log("¡Éxito! Token del cliente obtenido:");
                console.log(currentToken);
            } else {
                console.log("No se pudo obtener el token. Asegúrate de que los permisos estén correctos.");
            }

        } else {
            console.log("Permiso de notificación denegado.");
            btnActivar.style.display = 'none';
            alert("Has denegado las notificaciones. Si cambias de opinión, deberás gestionarlo en la configuración de tu navegador.");
        }
    } catch (err) {
        console.error("Ocurrió un error durante el proceso de notificación:", err);
    }
}


// Manejar mensajes cuando la PWA está en primer plano (sin cambios)
messaging.onMessage((payload) => {
    console.log("Mensaje recibido en primer plano: ", payload);
    alert(`Noticia de DirectorioPro: ${payload.notification.title}`);
});

// FIN DE LA LÓGICA DE NOTIFICACIONES PUSH
