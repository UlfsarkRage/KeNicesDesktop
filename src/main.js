// Este es el proceso principal de Electron (el "main process").
// Aquí se crea la ventana del navegador y se manejan las interacciones con el sistema operativo.

import { app, BrowserWindow, Menu } from 'electron'; // Importa los módulos necesarios de Electron. Se añade 'Menu'.
import { join } from 'path'; // Módulo para trabajar con rutas de archivos

// Función para crear la ventana principal de la aplicación
const createWindow = () => {
  // Crea una nueva ventana del navegador
  const mainWindow = new BrowserWindow({
    width: 400, // Ancho inicial de la ventana
    height: 550, // Alto inicial de la ventana
    webPreferences: {
      // Precarga un script que se ejecuta antes de cargar la página web en el renderizador.
      // Esto es útil para exponer APIs de Node.js de forma segura al renderizador.
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true, // Permite usar módulos de Node.js en el renderizador (¡usar con precaución!)
      contextIsolation: false, // Deshabilita el aislamiento de contexto para simplificar (¡no recomendado para producción!)
    },
    autoHideMenuBar: true, // Oculta automáticamente la barra de menú. El usuario puede mostrarla presionando Alt.
    // menu: null, // Descomentar esta línea si quieres eliminar completamente la barra de menú (no se puede mostrar con Alt)
  });

  // Carga el archivo HTML de tu interfaz de usuario en la ventana
  mainWindow.loadFile(join(__dirname, 'index.html'));

  // Opcional: Abre las Herramientas de Desarrollo (DevTools) para depuración.
  // mainWindow.webContents.openDevTools(); // Esta línea ha sido comentada para que no se abran automáticamente.

  // Elimina el menú por defecto de la aplicación (File, Edit, etc.)
  // Esto asegura una interfaz más limpia y sin opciones no relevantes.
  Menu.setApplicationMenu(null);
};

// Este método se llamará cuando Electron haya terminado la inicialización
// y esté listo para crear ventanas de navegador.
// Algunas APIs solo se pueden usar después de que este evento ocurra.
app.on('ready', createWindow);

// Sale de la aplicación cuando todas las ventanas están cerradas, excepto en macOS.
// En macOS, es común que las aplicaciones y su barra de menú permanezcan activas
// hasta que el usuario cierra explícitamente con Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// En macOS, es común volver a crear una ventana en la aplicación cuando el icono del dock
// se hace clic y no hay otras ventanas abiertas.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// El resto de este archivo es generado por Electron Forge y no necesita cambios para este ejemplo.
// Es la configuración de Webpack para el proceso principal.
// require('./main.js'); // Esto es para Webpack, no tocar.
