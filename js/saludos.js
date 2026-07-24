import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import { getDatabase, onValue, push, ref, set } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyCPrsb-hNWTrMXxGYbhsP_9cv5h1pV1hq0',
    authDomain: 'saludosilvestre.firebaseapp.com',
    databaseURL: 'https://saludosilvestre-default-rtdb.firebaseio.com',
    projectId: 'saludosilvestre',
    storageBucket: 'saludosilvestre.firebasestorage.app',
    messagingSenderId: '1002272084717',
    appId: '1:1002272084717:web:247777032c8fcdb0d6b2e4'
};

const button = document.querySelector('#salute-button');
const status = document.querySelector('#salute-status');
const toast = document.querySelector('#salute-toast');
let responseTimer;
let hideToastTimer;
let unsubscribeGreeting;

function showResponseToast() {
    window.clearTimeout(hideToastTimer);
    toast.classList.add('is-visible');
    hideToastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 5000);
}

function finishGreeting() {
    window.clearTimeout(responseTimer);
    if (unsubscribeGreeting) unsubscribeGreeting();
    unsubscribeGreeting = undefined;

    // El botón SE MANTIENE DESHABILITADO (No cambiamos button.disabled a false)
    status.textContent = '';
    showResponseToast(); // Muestra la notificación de que Silvestre respondió
}

function showBusyMessage() {
    // Si pasaron 10 segundos y la OrangePi no cambió el estado, se limpia el texto de espera
    status.innerHTML = 'Lo siento, en estos momentos no puedo responder tu saludo.</span>';
}

if (button && status && toast) {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    button.addEventListener('click', async() => {
        console.log("Enviando saludo a Silvestre...");

        // 1. Deshabilitar botón y poner el circulito/texto de carga
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Saludo enviado'; // Asegúrate de tener la clase CSS para el circulito

        // 2. Cambiar el texto de estado inmediatamente
        status.textContent = 'Saludo enviado.';

        try {
            const greetingRef = push(ref(database, 'Saludos'));
            await set(greetingRef, { estado: 'enviado', fecha: Date.now() });

            // Escuchar cambios de la OrangePi
            unsubscribeGreeting = onValue(greetingRef, (snapshot) => {
                const data = snapshot.val();

                // Si la OrangePi responde desde la cabaña
                if (data && data.estado === 'respondido') {
                    finishGreeting();
                }
            }, (error) => {
                console.error(error);
                window.clearTimeout(responseTimer);
                status.textContent = 'No fue posible recibir una respuesta en este momento.';
            });

            // 3. Temporizador ajustado a 10 segundos (10000 ms)
            responseTimer = window.setTimeout(showBusyMessage, 10000);

        } catch (error) {
            console.error(error);
            status.textContent = 'No fue posible enviar tu saludo. Intenta de nuevo más tarde.';
        }
    });
}
