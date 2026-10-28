<div align="center">

# 🔗 LinkForge Frontend

**Interfaz moderna, reactiva y open source para acortar, renombrar y administrar enlaces con arquitectura híbrida (Modo Libre + Cuentas Multi-Tenant con enlaces permanentes).**

[![Vercel](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=flat&logo=vercel&logoColor=white)](https://link-forge-frond-mkrj.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🚀 **Ver Sitio en Producción (Vercel)**](https://link-forge-frond-mkrj.vercel.app) • [🌐 Backend API (Render)](https://cort-link.onrender.com) • [📚 Swagger Docs](https://cort-link.onrender.com/docs)

</div>

---

## 🌐 Demo en Producción

Puedes probar la aplicación directamente en producción aquí:
👉 **[https://link-forge-frond-mkrj.vercel.app](https://link-forge-frond-mkrj.vercel.app)**

---

## ✨ Características Principales

### 🔀 Arquitectura Híbrida: Modo Cuenta Permanente vs. Modo Libre
LinkForge está diseñado tanto para pruebas rápidas sin fricción como para gestión permanente por usuario (**Multi-Tenant**):

| Característica | 🔓 Modo Libre (Sin iniciar sesión) | 🔐 Modo Cuenta (Autenticado con JWT) |
|---|---|---|
| **Creación de links** | Inmediata, sin registro | Inmediata, vinculada a tu cuenta (`user_id`) |
| **Duración del enlace** | Temporal (**6 días** en base de datos) | **Permanente (`∞`)** hasta que decidas eliminarlo |
| **Persistencia de la vista** | Guardado localmente en `localStorage` del navegador | **Sincronizado en PostgreSQL** (accesible desde cualquier navegador o dispositivo) |
| **Aislamiento (Multi-Tenant)** | Solo ves los links guardados en tu navegador actual | **Aislamiento estricto por cuenta**: cada usuario ve y controla únicamente sus propios links |
| **Edición y eliminación** | Requiere el `edit_token` generado al crear el link | Reconocimiento automático por sesión JWT (sin pedir `edit_token` manual) |

### 🔗 Acortado y Evolución de Enlaces
- **Slugs personalizados:** Crea enlaces con alias propios (ej. `promo-verano`) o generados automáticamente.
- **Edición en caliente del Slug:** Renombra el código corto sin perder las métricas ni el historial de clics.
- **Cambio de Destino:** Actualiza la URL final a la que apunta tu enlace en cualquier momento sin afectar enlaces de otros usuarios.
- **Generador de QR integrado:** Vista previa instantánea y descarga directa en formato PNG de alta resolución.

### 📊 Analytics y Auditoría en Tiempo Real
- Clics totales, clics únicos y tiempo relativo del último acceso.
- Gráfico *sparkline* de actividad diaria, principales *referrers* y distribución por países.
- **Historial de cambios:** Registro cronológico auditable de cada cambio de slug (`old_code ➔ new_code`) y de destino (`old_url ➔ new_url`).

### 🎨 Diseño & UX
- Estética oscura inspirada en nodos y redes (`#0B0F19`, `#151B2B`, acentos `#6366F1` / `#818CF8`).
- Vistas integradas de **Iniciar sesión (`/login`)** y **Crear cuenta (`/register`)** con transiciones fluidas mediante **Framer Motion**.
- Indicadores visuales en tiempo real del estado de sesión y de enlaces **Permanentes** vs. **Temporales (6d)**.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React 19** | Biblioteca de interfaz de usuario |
| **TypeScript** | Tipado estático de extremo a extremo |
| **Vite 6** | Empaquetador y servidor de desarrollo |
| **Tailwind CSS 4** | Sistema de estilos utilitario y diseño oscuro |
| **Framer Motion** | Animaciones declarativas para tarjetas, pestañas y modales |
| **Axios** | Cliente HTTP con interceptores automáticos para JWT (`Bearer`) |
| **Lucide React** | Iconografía limpia y consistente |
| **qrcode.react** | Renderizado y exportación de códigos QR |
| **React Router 7** | Enrutamiento SPA (`/`, `/login`, `/register`) |

---

## 📡 Integración con el Backend API

El cliente HTTP (`src/lib/api.ts`) inyecta automáticamente el encabezado `Authorization: Bearer <access_token>` cuando el usuario tiene una sesión activa:

### Autenticación (`/api/v1/auth`)
| Método | Endpoint | Uso en el Frontend |
|--------|----------|--------------------|
| `POST` | `/api/v1/auth/register` | Registro de cuenta nueva y obtención inmediata de JWT |
| `POST` | `/api/v1/auth/login` | Inicio de sesión con email y contraseña |
| `GET` | `/api/v1/auth/me` | Verificación y restauración automática de la sesión activa |

### Gestión de Enlaces y Analytics (`/api/v1/urls` & `/api/v1/analytics`)
| Método | Endpoint | Uso en el Frontend |
|--------|----------|--------------------|
| `POST` | `/api/v1/urls/shorten` | Crear link (permanente si hay JWT; expira en 6 días en modo libre) |
| `GET` | `/api/v1/urls/` | Obtener todos los links permanentes de la cuenta autenticada |
| `POST` | `/api/v1/urls/batch-info` | Sincronizar estado de links locales en modo invitado |
| `GET` | `/api/v1/urls/{slug}/info` | Refrescar metadatos tras editar un enlace |
| `PATCH` | `/api/v1/urls/{slug}/slug` | Renombrar el slug (autorizado por JWT de propietario o `edit_token`) |
| `PATCH` | `/api/v1/urls/{slug}/destination` | Cambiar la URL de destino |
| `DELETE` | `/api/v1/urls/{slug}` | Desactivar / eliminar un enlace |
| `GET` | `/api/v1/analytics/{slug}` | Consultar métricas detalladas de clics |
| `GET` | `/api/v1/urls/{slug}/history` | Consultar historial de renombres y cambios de destino |

---

## 📁 Estructura del Proyecto

```text
src/
├── components/
│   ├── ui/                  # Componentes base reutilizables (Button, Input, Toast)
│   ├── Header.tsx           # Barra superior con estado de sesión, Docs y GitHub
│   ├── UrlCard.tsx          # Tarjeta de enlace con distintivo Permanente / 6d
│   ├── EditModal.tsx        # Modal de edición (directo con cuenta o con edit_token)
│   ├── TokenModal.tsx       # Modal post-creación adaptado al modo de sesión
│   ├── QrModal.tsx          # Generación y descarga de código QR
│   ├── AnalyticsPanel.tsx   # Panel desplegable de métricas
│   └── HistoryPanel.tsx     # Panel desplegable de historial de cambios
├── context/
│   └── AuthContext.tsx      # Estado global de autenticación JWT y persistencia
├── hooks/
│   └── useLocalLinks.ts     # Sincronización híbrida (Cloud Multi-Tenant + localStorage)
├── lib/
│   ├── api.ts               # Cliente Axios, interceptores JWT y contratos TypeScript
│   └── utils.ts             # Utilidades de formato y fechas
├── pages/
│   ├── Home.tsx             # Panel principal de creación y gestión de enlaces
│   └── AuthPage.tsx         # Vista unificada de Login y Registro (/login y /register)
└── App.tsx                  # Proveedor de autenticación y rutas principales
```

---

## 🚀 Instalación y Ejecución Local

### Requisitos previos
- **Node.js** 18 o superior
- Backend de **LinkForge** en ejecución local (`http://localhost:8000`) o apuntando al servicio en Render

### Pasos

```bash
# 1. Entrar a la carpeta del frontend
cd FROND-2

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env
# Definir VITE_API_URL=http://localhost:8000 en .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Compilación para Producción

```bash
npm run build
npm run preview
```

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia **MIT** — Libre para aprender, adaptar y utilizar en portafolios o entornos comerciales.