// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA7YGIhZkl1wcro6M2XG51iHPYhmJCXVZ4",
    authDomain: "claveles-del-sur-3t.firebaseapp.com",
    projectId: "claveles-del-sur-3t",
    storageBucket: "claveles-del-sur-3t.firebasestorage.app",
    messagingSenderId: "523878964609",
    appId: "1:523878964609:web:93d2aedcca6a33b7f91c80"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Crear referencias a los servicios que usaremos
const db = firebase.firestore();
const storage = firebase.storage();

// Configurar Firestore para usar timestamps
const settings = { timestampsInSnapshots: true };
db.settings(settings);