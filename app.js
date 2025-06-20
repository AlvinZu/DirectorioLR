// app.js
// Espera a que todo el contenido de la página se cargue
document.addEventListener("DOMContentLoaded", function () {

  // La misma configuración de Firebase que usaste antes
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

  // --- Parte 1: Pedir permiso al usuario ---
  // Es mejor no pedir permiso al cargar la página.
  // Vamos a asociarlo a un botón.

  // Añade un botón a tu index.html:
  // <button id="activar-notificaciones">Activar Notificaciones</button>

  const btnActivar = document.getElementById('activar-notificaciones');

  btnActivar.addEventListener('click', () => {
    console.log("Solicitando permiso para notificaciones...");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Permiso de notificación concedido.");
        obtenerToken();
      } else {
        console.log("Permiso de notificación denegado.");
        alert("No podremos notificarte de las novedades si no aceptas.");
      }
    });
  });


  // --- Parte 2: Obtener el token del dispositivo ---
  function obtenerToken() {
    // Obtenemos el token de registro del dispositivo
    messaging.getToken({ vapidKey: "BGkQS0paUdAKAMwT4jsidWnXbYb-h94QPyzMMrMb9lqnypRmYEIkSnjQ284EBExoO2o5DHId8aldMCTfu2Vm_s0" }) // MUY IMPORTANTE
      .then((currentToken) => {
        if (currentToken) {
          console.log("Token del cliente obtenido:");
          console.log(currentToken);
          // ¡ÉXITO! Este token es la dirección única de este usuario.
          // En una app real, enviarías este token a tu base de datos
          // para poder enviarle notificaciones personalizadas más tarde.
          // Por ahora, solo lo mostraremos en la consola para probar.
        } else {
          console.log("No se pudo obtener el token. Pide permiso primero.");
        }
      })
      .catch((err) => {
        console.log("Ocurrió un error al obtener el token.", err);
      });
  }

  // --- Parte 3: Manejar mensajes cuando la PWA está en primer plano ---
  messaging.onMessage((payload) => {
    console.log("Mensaje recibido en primer plano: ", payload);
    // Podrías mostrar una alerta o un banner personalizado dentro de tu app
    alert(`Noticia de DirectorioPro: ${payload.notification.title}`);
  });

});