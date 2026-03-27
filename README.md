# 🛒 Tienda Online - Sistema Completo (Frontend & Backend)

Este proyecto es una aplicación web de comercio electrónico o tienda online que cuenta con un catálogo dinámico, un carrito de compras interactivo con gestión de stock en tiempo real y un panel de administración seguro para la creación de nuevos productos y categorías.

A diferencia de aplicaciones frontend estáticas, este proyecto implementa una arquitectura cliente-servidor completa, respaldada por una API REST construida en Node.js y una base de datos relacional MySQL.

## 🚀 Tecnologías Utilizadas

### Frontend (Interfaz de Usuario)
* **HTML5 & CSS3:** Estructuración y maquetación visual, incluyendo efectos personalizados de ampliación de imágenes.
* **JavaScript & jQuery:** Manipulación dinámica del DOM, gestión del carrito en memoria y consumo de la API REST mediante AJAX (`$.ajax`, `$.get`).
* **Bootstrap 5:** Componentes responsivos de interfaz (Offcanvas para el carrito, Modals para el inicio de sesión del administrador).

### Backend (Servidor & API)
* **Node.js & Express:** Creación del servidor local y enrutamiento de la API REST.
* **MySQL (librería `mysql2`):** Conexión y ejecución de consultas a la base de datos relacional.
* **Multer:** Middleware para la interceptación, renombrado y almacenamiento físico de archivos de imagen subidos desde el panel de control.
* **CORS:** Habilitación del intercambio de recursos de origen cruzado para conectar el frontend con el backend de forma segura.

## ✨ Funcionalidades Principales

1.  **Catálogo Dinámico:** Los productos y categorías se inyectan en el HTML en tiempo real extrayendo la información de la base de datos.
2.  **Gestión de Carrito y Stock:** Al añadir productos a la cesta, el stock visual se reduce. Si el stock llega a cero, el botón se bloquea y la tarjeta cambia su opacidad.
3.  **Modo Oscuro Persistente:** Alternancia entre modo claro y oscuro, guardando la preferencia del usuario en el `localStorage` del navegador.
4.  **Buscador Integrado:** Filtrado de productos en tiempo real utilizando animaciones de transición (`fadeIn`/`fadeOut`).
5.  **Panel de Administración:** Acceso protegido para la inserción de nuevas categorías y productos, incluyendo la subida de fotografías reales procesadas mediante `FormData`.

## 🛠️ Instalación y Despliegue

Sigue estos pasos para ejecutar el proyecto correctamente en cualquier entorno local.

### 1. Requisitos Previos
* Tener instalado [Node.js](https://nodejs.org/).
* Tener instalado un servidor MySQL (por ejemplo, XAMPP, WAMP o MySQL Workbench).

### 2. Configuración de la Base de Datos
1.  Inicia el servicio de MySQL.
2.  Abre tu gestor de base de datos preferido (ej. phpMyAdmin).
3.  Ejecuta el script SQL proporcionado en la carpeta del proyecto para crear la base de datos `tienda-db` y las tablas correspondientes (`productos`, `categorias`, etc.).

### 3. Configuración y Arranque del Backend
1.  Abre una terminal y navega hasta la carpeta `backend`:
    ```bash
    cd backend
    ```
2.  Instala todas las dependencias necesarias leyendo el archivo `package.json`:
    ```bash
    npm install
    ```
3.  Verifica las credenciales. Abre el archivo `backend/index.js` y asegúrate de que el usuario y la contraseña de la conexión MySQL coinciden con tu entorno local (por defecto en XAMPP suele ser `root` y contraseña vacía).
4.  Inicia el servidor:
    ```bash
    node index.js
    ```
    *La consola debería mostrar: "Servidor corriendo en http://localhost:3000".*

### 4. Arranque del Frontend (Importante)
Por motivos de seguridad (política de mismo origen / CORS), el archivo `index.html` **no debe abrirse haciendo doble clic** sobre él (protocolo `file:///`). Debe servirse a través de un servidor web local.

**Opción A: Usando Visual Studio Code**
1.  Abre la carpeta del proyecto en VS Code.
2.  Instala la extensión **Live Server**.
3.  Haz clic derecho sobre `html/index.html` y selecciona **"Open with Live Server"**.

**Opción B: Usando la terminal (Node.js)**
1.  Abre una **nueva** pestaña en la terminal (sin cerrar la del backend).
2.  Navega hasta la carpeta raíz del frontend o la carpeta `html`.
3.  Ejecuta el servidor estático rápido:
    ```bash
    npx http-server
    ```
4.  Abre el navegador y dirígete a la dirección proporcionada (usualmente `http://127.0.0.1:8080`).

## 📁 Estructura del Proyecto

```text
tienda-online/
├── backend/
│   ├── index.js           # Servidor Express y rutas API REST
│   ├── package.json       # Dependencias del servidor
│   └── package-lock.json  
├── frontend-js/
│   ├── admin.js           # Lógica del panel de control (AJAX, FormData)
│   ├── interfaz.js        # Lógica de UI (Modo oscuro, localStorage)
│   └── main.js            # Lógica de la tienda, carrito y llamadas GET
├── html/
│   ├── index.html         # Página principal y catálogo
│   └── admin.html         # Panel de creación de productos/categorías
├── css/
│   └── imagen-ampliada.css # Estilos para el visor de imágenes
└── uploads/               # Carpeta destino para las imágenes subidas por Multer
