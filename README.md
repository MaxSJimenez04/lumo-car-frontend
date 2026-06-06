# LUMO CAR CLIENT

## Cliente para el sistema LUMO CAR

---
# Requisitos previos
 Para poder realizar la instalación del cliente, se debe contar con las siguientes herramientas:
 * NodeJS versión 24.16.0 o similar
 * Tener acceso al servidor de la API LUMO CAR
 * Para el desarrollo de nuevas funcionalidades, se deben descargar las siguientes dependencias:
    - Vite
    - React (react, react-dom, react-router-dom) se pueden descargar después de clonar el repositorio ejecutar `npm install`.

# Configuración del entorno
Se debe crear un archivo `.env` en la raíz del proyecto que contenga:
 * `VITE_URL_API`: El link a la **raiz de la API de LUMO CAR** ej. *http://127.0.0.1:8080* o *http://www.lumocar.com*
El proyecto tiene varias configuraciones de arranque:
- Para development, ejecutar en la termina de la raíz del proyecto `npm run dev`.
- Para build, ejecutar `npm run vite build`

# Instrucciones de instalación
1. Clonar el repositorio
2. Ejecutar `npm install` para instalar las dependencias descritas en el punto de Requisitos Previos
3. Agregar el archivo `.env` en la raíz del proyecto con lo descrito en el punto de Configuración del Entorno
4. Ejecutar el proyecto con `npm run dev` para comprobar que se ha configurado correctamente
5. En un navegador, ingresar a `[Liga ingresada en archivo .ENV]:5173` en modo de desarrollador

# Accesibilidad
La gran parte del sistema permite manejarse mediante teclado usando las teclas <kbd>Enter</kbd> y <kbd>Tab</kbd> para navegar por todos los componentes del sistema
Además los colores del tema del cliente se han elegido para tener un contraste alto y evitar confusión a personas con baja visión, fátiga visual y cansancio al pasar largos periodos de tiempo dentro del sistema

# Almacenamiento de Cliente
Se han establecido sesiones con tokens JWT que se guardan mediante LocalStorage, evitando que se deba iniciar sesión cada vez que se ingresa al sistema. Además se ha activa mecanismos para guardar temporalmente resultados de consultas, disminuyendo el tráfico desde el cliente a la API

# Single Page Application
Se han establecido mecanismos para que la web sea de una aplicación de una sóla página.

# Estructura del cliente
* **Utils**: Recursos como íconos, imágenes de fondo y estilos en CSS quie se utilizan en varias partes del cliente
* **Pages**: La vista de una ventana del sistema, que se crea utilizando los componentes seleccionados y que sirven para marcar la navegación dentro del sistema
* **Components**: Estructuras que le dan la forma a las ventanas, contienen las llamadas a los servicios y manejan la lógica de negocio
* **Services**: Servicios que realizan las llamadas a la API del Servidor
* **Routes**: Definición de las rutas del sistema