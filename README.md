# LinkForge Frontend

Frontend moderno para el acortador de URLs **LinkForge**.

## Stack

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS 4**
- **Framer Motion** (animaciones)
- **Lucide React** (iconos)
- **React Router** + **Axios**

## Diseño

- Estilo limpio inspirado en Notion
- Tema: redes / dominios / links
- Totalmente responsive
- Animaciones suaves

## Cómo correr

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Configurar URL del backend
# Crea un archivo .env:
# VITE_API_URL=http://localhost:8000

# 3. Iniciar
npm run dev
```

Abre `http://localhost:5173`

## Funcionalidades

| Página | Qué hace |
|--------|----------|
| `/` | Crear enlaces cortos (con slug opcional) |
| `/manage` | Buscar, editar slug, editar destino, ver analytics |

El `edit_token` se guarda automáticamente en `localStorage` al crear un enlace.

## Requisitos del backend

El backend debe estar corriendo en `http://localhost:8000` (o la URL que configures en `.env`).

Endpoints usados:
- `POST /api/v1/urls/shorten`
- `GET /api/v1/urls/{slug}/info`
- `PATCH /api/v1/urls/{slug}/slug`
- `PATCH /api/v1/urls/{slug}/destination`
- `DELETE /api/v1/urls/{slug}`
- `GET /api/v1/analytics/{slug}`

## Build de producción

```bash
npm run build
npm run preview
```
