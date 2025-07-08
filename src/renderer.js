// Este script se ejecuta en el contexto de la ventana del navegador (el "renderer process").
// Aquí manejamos la lógica de la interfaz de usuario.

// Obtenemos referencias a los elementos HTML por su ID
const loginScreen = document.getElementById('login-screen');
const mainAppScreen = document.getElementById('main-app-screen');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');
const loggedInUserSpan = document.getElementById('loggedInUser');
const logoutButton = document.getElementById('logout-button');

// Nuevas referencias para la funcionalidad de Gemini API
const productNameInput = document.getElementById('productNameInput');
const generateDescriptionButton = document.getElementById('generateDescriptionButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const generatedDescriptionOutput = document.getElementById('generatedDescriptionOutput');


// Definimos credenciales de ejemplo. ¡ADVERTENCIA!
// En una aplicación real, NUNCA harías esto. Las credenciales se verificarían
// contra una base de datos o un servicio de autenticación seguro.
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'password';

/**
 * Muestra la pantalla principal de la aplicación y oculta la de login.
 * @param {string} username - El nombre de usuario que ha iniciado sesión.
 */
function showMainScreen(username) {
  loginScreen.style.display = 'none'; // Oculta la pantalla de login
  mainAppScreen.style.display = 'block'; // Muestra la pantalla principal
  loggedInUserSpan.textContent = username; // Muestra el nombre de usuario
}

/**
 * Muestra la pantalla de login y oculta la principal.
 * También limpia los campos de entrada y oculta el mensaje de error.
 */
function showLoginScreen() {
  loginScreen.style.display = 'block'; // Muestra la pantalla de login
  mainAppScreen.style.display = 'none'; // Oculta la pantalla principal
  usernameInput.value = ''; // Limpia el campo de usuario
  passwordInput.value = ''; // Limpia el campo de contraseña
  errorMessage.style.display = 'none'; // Oculta cualquier mensaje de error anterior
}

// Añadimos un "escuchador" de eventos al botón de login
loginButton.addEventListener('click', () => {
  const username = usernameInput.value; // Obtiene el valor del campo de usuario
  const password = passwordInput.value; // Obtiene el valor del campo de contraseña

  // Comprueba si las credenciales son correctas (solo para este ejemplo)
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    showMainScreen(username); // Si son correctas, muestra la pantalla principal
  } else {
    errorMessage.style.display = 'block'; // Si no, muestra el mensaje de error
  }
});

// Añadimos un "escuchador" de eventos al botón de cerrar sesión
logoutButton.addEventListener('click', () => {
  showLoginScreen(); // Al cerrar sesión, volvemos a la pantalla de login
});

// Event listener para el botón de la funcionalidad de Gemini API
generateDescriptionButton.addEventListener('click', async () => {
  const productName = productNameInput.value.trim();
  if (!productName) {
    generatedDescriptionOutput.textContent = 'Por favor, introduce un nombre de producto.';
    generatedDescriptionOutput.style.backgroundColor = '#ffe0b2'; // Naranja claro para advertencia
    generatedDescriptionOutput.style.borderColor = '#ffc107';
    generatedDescriptionOutput.style.color = '#856404';
    return;
  }

  generatedDescriptionOutput.textContent = ''; // Limpiar la salida anterior
  generatedDescriptionOutput.style.backgroundColor = '#e9f7ef'; // Restablecer fondo
  generatedDescriptionOutput.style.borderColor = '#c3e6cb';
  generatedDescriptionOutput.style.color = '#155724';
  loadingIndicator.style.display = 'block'; // Mostrar indicador de carga

  try {
    // El prompt para la API de Gemini
    const prompt = `Genera una descripción de producto corta y atractiva para el siguiente artículo, incluyendo sus posibles usos o características clave. El producto es: "${productName}".`;
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    // La clave API se proporcionará automáticamente por Canvas en tiempo de ejecución
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      generatedDescriptionOutput.textContent = text;
    } else {
      generatedDescriptionOutput.textContent = 'No se pudo generar la descripción. Inténtalo de nuevo.';
      generatedDescriptionOutput.style.backgroundColor = '#f8d7da'; // Rojo claro para error
      generatedDescriptionOutput.style.borderColor = '#f5c6cb';
      generatedDescriptionOutput.style.color = '#721c24';
    }
  } catch (error) {
    console.error('Error al llamar a la API de Gemini:', error);
    generatedDescriptionOutput.textContent = 'Error al conectar con el servicio de generación. Verifica tu conexión.';
    generatedDescriptionOutput.style.backgroundColor = '#f8d7da'; // Rojo claro para error
    generatedDescriptionOutput.style.borderColor = '#f5c6cb';
    generatedDescriptionOutput.style.color = '#721c24';
  } finally {
    loadingIndicator.style.display = 'none'; // Ocultar indicador de carga
  }
});


// Al cargar la aplicación, mostramos la pantalla de login por defecto
showLoginScreen();
