# 🔗 LinkForge Frontend

Frontend moderno del acortador de URLs **LinkForge**.  
Diseño oscuro inspirado en redes y nodos, pensado para uso libre (open source), sin login, con links temporales y control total del propietario mediante `edit_token`.

## ✨ Características

### Acortado de URLs
- Crear links cortos a partir de cualquier URL
- Slug personalizado opcional (ej: `promo-verano`)
- Respuesta inmediata con el link corto listo para copiar

### Privacidad sin cuentas
- **Sin login**: cualquiera puede usarlo
- La lista de “Tus links” vive solo en **localStorage** del navegador
- Cada usuario ve únicamente los links que creó en ese dispositivo
- No se muestra un listado global de todos los usuarios

### Token de edición
- Al crear un link se muestra un **modal** con el `edit_token`
- Aviso claro para guardarlo (es la llave para editar o eliminar)
- El token se guarda automáticamente en el navegador para esa sesión/dispositivo
- Sin el token no se pueden modificar slug ni destino

### Caducidad
- Los links expiran a los **6 días**
- El modal de creación informa la fecha de expiración
- Tras caducar, hay que crear un link nuevo

### Gestión de links
- Copiar link corto al portapapeles
- **Editar slug** (renombrar sin perder analytics)
- **Editar destino** (cambiar la URL final manteniendo el mismo slug)
- **Eliminar / desactivar** con animación de salida
- Código **QR** por link (vista previa + descarga PNG)

### Analytics
- Clicks totales y clicks únicos
- Último click (tiempo relativo)
- Sparkline de clicks por día (si el backend lo envía)
- Top referrers y países (si están disponibles)

### Historial de cambios
- Renombres de slug (`old_code → new_code`)
- Cambios de destino (`old_url → new_url`)
- Fechas de cada modificación  
  *(requiere endpoint de historial en el backend)*

### UX / UI
- Tema oscuro (`#0B0F19`) estilo red / nodos
- Animaciones con Framer Motion (entrada, salida, modales)
- Toasts de éxito / error
- Diseño responsive (móvil, tablet, desktop)
- Empty state cuando aún no hay links

---

## 🛠️ Stack

| Tecnología | Uso |
|------------|-----|
| **React 19** | UI |
| **TypeScript** | Tipado estático |
| **Vite 6** | Build y dev server |
| **Tailwind CSS 4** | Estilos |
| **Framer Motion** | Animaciones |
| **Lucide React** | Iconos |
| **Axios** | Cliente HTTP |
| **qrcode.react** | Generación de QR |
| **React Router** | Rutas |

---

## 🚀 Cómo correr

### Requisitos
- Node.js 18+
- Backend LinkForge en ejecución (por defecto `http://localhost:8000`)

### Instalación

```bash
# Clonar / entrar al proyecto
cd linkforge-frontend

# Instalar dependencias
npm install

# Variables de entorno (opcional)
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# Desarrollo
npm run dev
```

Abre `http://localhost:5173`.

### Producción

```bash
npm run build
npm run preview
```

---

## ⚙️ Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| VITE_API_URL | URL base del backend | http://localhost:8000 |

Ejemplo `.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## 📡 API que consume

| Método | Endpoint | Uso en el frontend |
|--------|----------|--------------------|
| POST | /api/v1/urls/shorten | Crear link |
| GET | /api/v1/urls/{slug}/info | Refrescar info tras editar |
| PATCH | /api/v1/urls/{slug}/slug | Renombrar slug |
| PATCH | /api/v1/urls/{slug}/destination | Cambiar destino |
| DELETE | /api/v1/urls/{slug}?edit_token=... | Desactivar link |
| GET | /api/v1/analytics/{slug} | Stats / analytics |
| GET | /api/v1/urls/{slug}/history | Historial de cambios |

> La lista de la UI **no** usa GET /api/v1/urls/ (listado global), para no mezclar links de otros usuarios.

---

## 📁 Estructura relevante

```text
src/
├── components/
│   ├── ui/           # Button, Input, Toast
│   ├── Header.tsx
│   ├── UrlCard.tsx   # Card de cada link (nodo)
│   ├── EditModal.tsx
│   ├── TokenModal.tsx    # Modal post-creación (token + 6 días)
│   ├── QrModal.tsx
│   ├── AnalyticsPanel.tsx
│   └── HistoryPanel.tsx
├── hooks/
│   └── useLocalLinks.ts  # Persistencia solo en localStorage
├── lib/
│   ├── api.ts            # Cliente y tipos del backend
│   └── utils.ts
├── pages/
│   └── Home.tsx
└── App.tsx
```

---

## 🔐 Modelo de seguridad (sin login)

```text
Crear link
   → Backend genera edit_token + expires_at (6 días)
   → Frontend muestra modal y guarda token en localStorage

Editar / eliminar
   → Se envía el edit_token guardado (o pegado por el usuario)

Lista “Tus links”
   → Solo localStorage de ese navegador
```

Quien tenga el `edit_token` puede modificar ese link. Quien no lo tenga solo puede usar el link corto hasta que expire.

---

## 🎨 Diseño

- Fondo: #0B0F19
- Cards / paneles: #151B2B
- Acento: indigo #6366F1 / #818CF8
- Tipografía: Inter + JetBrains Mono (slugs, tokens, URLs)
- Metáfora visual: nodos de una red (cards con glow al hover)

---

## 📄 Licencia

Proyecto open source. Libre para usar, modificar y distribuir junto con el backend LinkForge.

---

**LinkForge** — Forja links que evolucionan.
