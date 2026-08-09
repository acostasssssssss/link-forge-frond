# LinkForge Frontend

Frontend oscuro estilo **red / nodos** para el acortador LinkForge.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Axios

## Diseño

- Tema oscuro (`#0B0F19`)
- Paleta indigo / network
- Cards como “nodos”
- Grid sutil de fondo
- Animaciones Framer Motion
- Toast, modal de edición, stats expandibles
- Lista de links en localStorage

## Cómo correr

```bash
npm install
npm run dev
```

Backend esperado en `http://localhost:8000`  
(o configura `VITE_API_URL` en un `.env`)

## Funcionalidades

- Acortar URL (con slug opcional)
- Lista de links creados (persistente en el navegador)
- Copiar, editar slug, editar destino, eliminar
- Panel de analytics por link
- Toast de éxito / error
