# SaBio CRM - Frontend

## Propósito
Aplicación web para gestión de CRM agrícola con módulos de administración, ventas (leads), fincas, diagnósticos, usuarios y corporativos.

## Stack Tecnológico
- **Framework**: Next.js 14.2.33 (App Router)
- **Lenguaje**: TypeScript 5 + JavaScript
- **UI Library**: React 18
- **Estado**: Zustand 5.0.8 (con persistencia)
- **Data Fetching**: TanStack React Query 5.90.7
- **Forms**: React Hook Form 7.66.0 + Zod 4.1.12
- **Styling**: Tailwind CSS 3.4.1 + Radix UI
- **HTTP Client**: Axios 1.13.2
- **Auth**: JWT (jose 6.1.2, jwt-decode 4.0.0)
- **Iconos**: Lucide React 0.553.0

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Route group: Autenticación
│   │   │   ├── login/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-otp/
│   │   │   └── layout.jsx       # Layout sin sidebar
│   │   ├── (app)/               # Route group: Aplicación protegida
│   │   │   ├── admin/           # Gestión usuarios y corporativos
│   │   │   ├── crm/             # Dashboard CRM (leads)
│   │   │   ├── fincas/          # Listado y gestión de fincas
│   │   │   │   └── diagnosticos/
│   │   │   │       ├── page.jsx
│   │   │   │       └── nuevo/page.jsx  # Wizard 9 pasos
│   │   │   └── layout.jsx       # Layout con sidebar + navegación
│   │   ├── api/                 # API routes
│   │   │   └── upload-proxy/    # Proxy para upload de imágenes
│   │   ├── lib/                 # Librerías core
│   │   │   ├── axios.js         # Instancia axios configurada
│   │   │   └── store.js         # Zustand auth store
│   │   ├── layout.tsx           # Root layout
│   │   ├── providers.tsx        # QueryClientProvider
│   │   ├── page.tsx             # Home (redirect)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # Componentes shadcn/ui (Radix)
│   │   ├── layout/              # Sidebar, Header, NavItem, etc.
│   │   ├── common/              # Componentes reutilizables
│   │   ├── fincas/              # Componentes específicos de fincas
│   │   ├── diagnosticos/        # Wizard y steps
│   │   │   ├── DiagnosticoWizard.jsx
│   │   │   ├── wizard-config.js
│   │   │   └── steps/           # 9 steps con variantes por tipo
│   │   ├── usuarios/
│   │   └── leads/
│   ├── hooks/                   # Custom hooks
│   │   ├── diagnosticos/
│   │   │   ├── useDiagnosticoDraft.js
│   │   │   └── useDiagnosticoMutations.js
│   │   ├── fincas/
│   │   ├── usuarios/
│   │   ├── useAutoSave.js       # Debounced auto-save
│   │   ├── useImageUpload.js
│   │   └── useSidebarCollapse.js
│   ├── lib/
│   │   ├── store/               # Zustand stores adicionales
│   │   │   ├── diagnosticoDraftStore.js
│   │   │   ├── fincaFilterStore.js
│   │   │   └── ...FilterStore.js
│   │   ├── validations/         # Esquemas Zod
│   │   │   ├── finca.schema.js
│   │   │   ├── user.schema.js
│   │   │   ├── diagnostico.schema.js
│   │   │   └── ...
│   │   └── utils.ts             # Helpers (cn, etc.)
│   ├── utils/
│   │   └── indexedDB.js         # Storage para imágenes (File objects)
│   └── middleware.ts            # Auth middleware (JWT verification)
├── public/                      # Assets estáticos
├── .env.local                   # Variables de entorno
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Arquitectura

### App Router con Route Groups

Next.js 14 usa carpetas con paréntesis para agrupar rutas lógicamente sin afectar la URL:

```
(auth)/    → Rutas públicas: /login, /forgot-password, etc.
(app)/     → Rutas protegidas: /admin, /crm, /fincas
```

### Flujo de Autenticación

1. Usuario hace login en `/login`
2. Submit → POST a `NEXT_PUBLIC_API_URL/auth/login`
3. Backend retorna `{token, user}`
4. Zustand store decodifica JWT con `jwt-decode`
5. Token guardado en:
   - localStorage (Zustand persist)
   - Cookie `sabio-auth-token` (7 días)
6. Middleware lee cookie y valida JWT con `jose`
7. Adjunta headers: `x-user-id`, `x-user-email`, `x-user-role`
8. Rutas protegidas verifican middleware

### Middleware (middleware.ts)

```typescript
// Verifica JWT en cookie
// Rutas protegidas: /admin/*, /crm/*, /fincas/*
// Redirige a /login si no hay token
// Decodifica y agrega headers para server components
```

### Manejo de Estado

#### Zustand Stores

1. **authStore** (app/lib/store.js)
   - Estado global de autenticación
   - Persist en localStorage
   - Sincronización con cookies

2. **Draft Stores** (lib/store/)
   - diagnosticoDraftStore: Multi-capa (localStorage + IndexedDB)
   - Guarda formularios parciales
   - Auto-limpieza de drafts antiguos (30 días)

3. **Filter Stores**
   - fincaFilterStore, diagnosticoFilterStore, etc.
   - Estado de filtros y búsquedas

#### React Query

- Cache de datos del servidor
- Invalidación automática después de mutaciones
- staleTime: 60s
- refetchOnWindowFocus: false

## Rutas Principales

```
/login                          → LoginPage
/forgot-password                → PasswordResetPage
/verify-otp                     → OTPVerificationPage
/reset-password                 → ResetPasswordPage

/admin                          → Admin Dashboard
/admin/usuarios                 → User Management (solo admin)
/admin/corporativos             → Corporativos Management

/crm                            → CRM Dashboard (leads)

/fincas                         → Listado de fincas
/fincas/diagnosticos            → Listado de diagnósticos
/fincas/diagnosticos/nuevo      → Wizard 9 pasos (crear diagnóstico)
```

## Componentes Importantes

### Layout Components

- **DashboardLayout**: Sidebar + main content
- **Sidebar**: Navegación con colapso persistente
- **ProtectedRoute**: Guard para rutas protegidas

### Feature Components

1. **DiagnosticoWizard** (9 pasos)
   - Step1: Información General
   - Step2: Sistema Productivo (variantes por tipo: Ganadería, Flores, Frutales, Aguacate, Café)
   - Step3: Fertilización y Fumigación
   - Step4: Manejo Pastoreo/Cultivo
   - Step5: Indicadores P4G
   - Step6: Sostenibilidad
   - Step7: Biofabrica
   - Step8: Observaciones
   - Step9: Validación y Cierre

2. **FincasTable**
   - Tabla con filtros (buscar + tipo + empresa)
   - Integrado con fincaFilterStore

3. **CorporativoAssignModal**
   - Asignar corporativos a fincas (M-N)

### UI Components (shadcn/ui + Radix)

- Button, Input, Label, Form
- Dialog, AlertDialog, Popover
- Table, Card, Badge, Alert
- Select, Checkbox, RadioGroup
- Toast, Tooltip, Progress
- Collapsible, Textarea

## Validación con Zod

Esquemas ubicados en `src/lib/validations/`:

```javascript
// finca.schema.js
createFincaSchema = {
  nombre: z.string().min(3),
  area: z.number().positive(),
  tipo_produccion: z.enum(['Ganaderia', 'Flores', ...]),
  municipio, departamento, vereda,
  coordenadas_gps: z.object({lat, lng}),
  empresa_owner: z.string()
}

// user.schema.js
roles = ['sabio_admin', 'sabio_vendedor', ...]

// diagnostico.schema.js (complejo, 39KB)
// Campos condicionales según tipo_produccion
```

## Custom Hooks

### useAutoSave
```javascript
// Debounce automático (300ms)
// Guarda draft sin incluir onSave en deps
// Preserva File objects
useAutoSave(onSave, values, delay)
```

### useImageUpload
```javascript
// Upload a IMAGE_SERVICE_URL
// Tracking de progreso
// Retorna URLs de 3 versiones (original, thumbnail, small)
```

### useDiagnosticoDraft
```javascript
// Load/save/delete drafts
// IndexedDB para imágenes (File objects)
// localStorage para datos JSON
// Cálculo de completitud (%)
```

### useXxxMutations
```javascript
// CRUD operations con TanStack Query
// Invalidación automática de queries
// Error handling con toast
```

## Almacenamiento Local

### localStorage
- Zustand persist: authStore, draftStore
- Draft data (sin Files)

### IndexedDB
- Database: `sabio-diagnostico-images`
- Store: `images`
- Key: `{fincaId}_{userId}`
- Value: Array de File objects

**Helpers (utils/indexedDB.js):**
- initDB()
- saveImagesToIndexedDB()
- loadImagesFromIndexedDB()
- collectAllImages() - Recursivo
- restoreImagesInFormData()

## Variables de Entorno

```env
# JWT
JWT_SECRET=clave-secreta-larga

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Image Service
NEXT_PUBLIC_IMAGE_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_IMAGE_SERVICE_API_KEY=api-key
```

## Configuración Importante

### Axios Instance (app/lib/axios.js)

```javascript
baseURL: NEXT_PUBLIC_API_URL
headers: { 'Content-Type': 'application/json' }

// Request interceptor: agrega JWT
// Response interceptor: 401 → logout + redirect
```

### Tailwind Config

```javascript
// Dark mode: class
// CSS variables para colores (HSL)
// Alias: @/* → ./src/*
// Plugins: tailwindcss-animate
```

### Next.js Config

```javascript
output: 'standalone'  // Para Docker
env: { NEXT_PUBLIC_API_URL }
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Start producción
npm start

# Lint
npm run lint
```

## Flujos Principales

### Crear Diagnóstico

1. Usuario selecciona finca
2. Abre wizard (9 pasos)
3. useAutoSave() guarda draft cada 300ms
4. Draft persiste en localStorage + IndexedDB (imágenes)
5. Usuario puede cerrar y volver (draft se carga)
6. Paso 9: Validación final
7. collectAllImages() recolecta Files recursivamente
8. Upload secuencial a image-service
9. POST /diagnosticos con URLs de imágenes
10. invalidateQueries(['diagnosticos'])
11. Toast éxito + redirect

### Filtrado de Fincas

1. Usuario escribe en búsqueda
2. setSearchQuery() actualiza store
3. FincasTable con useMemo() filtra por:
   - nombre (includes)
   - municipio (includes)
   - empresa.nombre_comercial (includes)
4. Renderiza resultados filtrados

## Integración con Servicios

### Backend API
- Autenticación (login, reset password)
- CRUD completo de todos los recursos
- Upload proxy (via backend a image-service)

### Image Service
- Upload directo desde frontend
- Headers: `X-API-KEY` + `Authorization`
- Respuesta: URLs de 3 versiones

## Patrones de Código

### Server Components + Client Components
```javascript
// Por defecto: Server Components (sin "use client")
// Client: necesario para hooks, estado, eventos

// Ejemplo:
'use client'  // En top del archivo
import { useState } from 'react'
```

### Path Alias
```javascript
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
```

### cn() Utility
```javascript
import { cn } from '@/lib/utils'

<div className={cn("base-class", condition && "conditional-class")} />
```

## Próximos Pasos Recomendados

- Agregar tests (Jest + React Testing Library)
- Implementar Storybook para componentes UI
- Mejorar error boundaries
- Optimizar imágenes con next/image
- Implementar lazy loading de routes
- Agregar loading.tsx y error.tsx en routes
- Implementar skeleton loading states
- Mejorar accesibilidad (ARIA)
- Agregar internacionalización (i18n)
