// app.js

document.addEventListener("DOMContentLoaded", function () {

    // ... (Aquí va todo tu otro código de la app que ya tienes) ...

    // --- LÓGICA DE NOTIFICACIONES PUSH ---

    // La misma configuración de Firebase que usaste antes
    const firebaseConfig = {
      apiKey: "AIzaSyBM91yvFBEU9NDSEZKQyFHU6bhqCPgY3Uc", // Reemplaza con tus datos
      authDomain: "directoriopro-los-reyes.firebaseapp.com", // Reemplaza con tus datos
      projectId: "directoriopro-los-reyes", // Reemplaza con tus datos
      storageBucket: "directoriopro-los-reyes.firebasestorage.app", // Reemplaza con tus datos
      messagingSenderId: "689785400797", // Reemplaza con tus datos
      appId: "1:689785400797:web:5b91b320d6aa70ae669a34" // Reemplaza con tus datos
    };

    // Inicializa Firebase
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    const btnActivar = document.getElementById('activar-notificaciones');

    // **NUEVA FUNCIÓN PARA VERIFICAR Y OCULTAR EL BOTÓN**
    function verificarEstadoNotificaciones() {
        if (!btnActivar) return; // Si el botón no existe, no hagas nada.
        
        // Notification.permission puede tener 3 valores: 'granted', 'denied', 'default'
        if (Notification.permission === 'granted') {
            console.log('El permiso para notificaciones ya fue concedido.');
            btnActivar.style.display = 'none'; // Oculta el botón
            // Opcional: Si ya tienes el token, podrías volver a obtenerlo por si cambió
            // obtenerToken(); 
        } else if (Notification.permission === 'denied') {
            console.log('El permiso para notificaciones fue denegado previamente.');
            btnActivar.style.display = 'none'; // También lo ocultamos si lo denegaron
        } else {
            console.log('El permiso para notificaciones aún no se ha solicitado.');
            btnActivar.style.display = 'block'; // Asegúrate de que el botón sea visible
        }
    }
    
    // Llama a la función de verificación tan pronto como la página cargue
    verificarEstadoNotificaciones();


    // --- Parte 1: Pedir permiso al usuario (Lógica Modificada) ---
    btnActivar.addEventListener('click', () => {
        console.log("Solicitando permiso para notificaciones...");
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Permiso de notificación concedido.");
                
                // **¡AQUÍ ESTÁ LA MAGIA!**
                btnActivar.style.display = 'none'; // Ocultamos el botón
                
                obtenerToken();
            } else {
                console.log("Permiso de notificación denegado.");
                btnActivar.style.display = 'none'; // También lo ocultamos si lo deniegan
                alert("Has denegado las notificaciones. Si cambias de opinión, deberás gestionarlo en la configuración de tu navegador.");
            }
        });
    });


    // --- Parte 2: Obtener el token del dispositivo (Sin cambios) ---
    function obtenerToken() {
        // Obtenemos el token de registro del dispositivo
        messaging.getToken({ vapidKey: "BHyQyA08xLbfXpZ1T4n_T3pT6jT7...TU_VAPID_KEY" }) // ¡RECUERDA PONER TU VAPID KEY REAL!
            .then((currentToken) => {
                if (currentToken) {
                    console.log("Token del cliente obtenido:");
                    console.log(currentToken);
                    // Aquí enviarías el token a tu servidor/base de datos
                } else {
                    console.log("No se pudo obtener el token. Pide permiso primero.");
                }
            })
            .catch((err) => {
                console.log("Ocurrió un error al obtener el token.", err);
            });
    }

    // --- Parte 3: Manejar mensajes cuando la PWA está en primer plano (Sin cambios) ---
    messaging.onMessage((payload) => {
        console.log("Mensaje recibido en primer plano: ", payload);
        alert(`Noticia de DirectorioPro: ${payload.notification.title}`);
    });

});
