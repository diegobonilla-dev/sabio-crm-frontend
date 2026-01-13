# Contexto: Dashboard Fincas - Fase 3 (Contenido Dinámico)

**Fecha**: 2026-01-12
**Estado**: Fase 2 completada ✅ | Fase 3 pendiente ⏳

---

## Resumen de Progreso

### Fase 1 ✅ (Completada)
- Reorganización de navegación de fincas
- Creación de `/fincas/admin` (solo admins)
- Dashboard público en `/fincas`
- Actualización de sidebar y mobile menu

### Fase 2 ✅ (Completada)
- Layout responsive implementado:
  - **Desktop**: 75% fincas (3 cols) + 25% alertas
  - **Tablet**: Alertas arriba + Fincas 3 columnas
  - **Mobile**: Alertas colapsables + Fincas stack vertical
- Componentes Collapsible para alertas en mobile/tablet
- Placeholders estáticos en las 4 cards

---

## Tareas Pendientes - Fase 3

### TAREA 1: Corregir Fondo de Columna de Alertas
**Problema**: La columna de alertas tiene el mismo fondo que las otras 3 columnas de fincas
**Solución requerida**: Aplicar fondo blanco (`bg-white`) al contenedor de alertas

**Archivo**: `frontend/src/app/(app)/fincas/page.jsx`

**Cambios necesarios**:

**DESKTOP**:
```jsx
{/* Columna derecha 25% (1/4) - Alertas */}
<div className="col-span-1 bg-white rounded-lg p-4">
  {/* Card de alertas aquí */}
</div>
```

**TABLET/MOBILE**:
```jsx
{/* Alertas Colapsables */}
<div className="bg-white rounded-lg p-4">
  <Collapsible open={alertasOpen} onOpenChange={setAlertasOpen}>
    {/* Contenido alertas */}
  </Collapsible>
</div>
```

---

### TAREA 2: Crear Archivo JSON de Datos Mock

**Crear nuevo archivo**: `frontend/src/data/dashboard-fincas-mock.json`

**Estructura esperada**:
```json
{
  "fincas": {
    "columna1": [
      {
        "id": "f1c1-1",
        "titulo": "finca1col1",
        "descripcion": "Descripción placeholder",
        "color": "text-red-600"
      },
      {
        "id": "f1c1-2",
        "titulo": "finca2col1",
        "descripcion": "Descripción placeholder",
        "color": "text-red-600"
      },
      {
        "id": "f1c1-3",
        "titulo": "finca3col1",
        "descripcion": "Descripción placeholder",
        "color": "text-red-600"
      },
      {
        "id": "f1c1-4",
        "titulo": "finca4col1",
        "descripcion": "Descripción placeholder",
        "color": "text-red-600"
      },
      {
        "id": "f1c1-5",
        "titulo": "finca5col1",
        "descripcion": "Descripción placeholder",
        "color": "text-red-600"
      }
    ],
    "columna2": [
      {
        "id": "f1c2-1",
        "titulo": "finca1col2",
        "descripcion": "Descripción placeholder",
        "color": "text-amber-600"
      },
      {
        "id": "f1c2-2",
        "titulo": "finca2col2",
        "descripcion": "Descripción placeholder",
        "color": "text-amber-600"
      },
      {
        "id": "f1c2-3",
        "titulo": "finca3col2",
        "descripcion": "Descripción placeholder",
        "color": "text-amber-600"
      },
      {
        "id": "f1c2-4",
        "titulo": "finca4col2",
        "descripcion": "Descripción placeholder",
        "color": "text-amber-600"
      },
      {
        "id": "f1c2-5",
        "titulo": "finca5col2",
        "descripcion": "Descripción placeholder",
        "color": "text-amber-600"
      }
    ],
    "columna3": [
      {
        "id": "f1c3-1",
        "titulo": "finca1col3",
        "descripcion": "Descripción placeholder",
        "color": "text-green-600"
      },
      {
        "id": "f1c3-2",
        "titulo": "finca2col3",
        "descripcion": "Descripción placeholder",
        "color": "text-green-600"
      },
      {
        "id": "f1c3-3",
        "titulo": "finca3col3",
        "descripcion": "Descripción placeholder",
        "color": "text-green-600"
      },
      {
        "id": "f1c3-4",
        "titulo": "finca4col3",
        "descripcion": "Descripción placeholder",
        "color": "text-green-600"
      },
      {
        "id": "f1c3-5",
        "titulo": "finca5col3",
        "descripcion": "Descripción placeholder",
        "color": "text-green-600"
      }
    ]
  },
  "alertas": [
    {
      "id": "alert-1",
      "titulo": "Alerta 1",
      "descripcion": "Descripción alerta placeholder",
      "tipo": "warning"
    },
    {
      "id": "alert-2",
      "titulo": "Alerta 2",
      "descripcion": "Descripción alerta placeholder",
      "tipo": "info"
    },
    {
      "id": "alert-3",
      "titulo": "Alerta 3",
      "descripcion": "Descripción alerta placeholder",
      "tipo": "error"
    },
    {
      "id": "alert-4",
      "titulo": "Alerta 4",
      "descripcion": "Descripción alerta placeholder",
      "tipo": "warning"
    },
    {
      "id": "alert-5",
      "titulo": "Alerta 5",
      "descripcion": "Descripción alerta placeholder",
      "tipo": "info"
    }
  ]
}
```

---

### TAREA 3: Implementar Mapeo de Datos en Dashboard

**Archivo**: `frontend/src/app/(app)/fincas/page.jsx`

**Cambios necesarios**:

#### 1. Import del JSON
```jsx
import dashboardData from '@/data/dashboard-fincas-mock.json';
```

#### 2. Mapear columnas de fincas (Desktop)
```jsx
{/* Columna izquierda 75% (3/4) - Fincas */}
<div className="col-span-3 grid grid-cols-3 gap-4">
  {/* Columna 1 */}
  <div className="space-y-4">
    {dashboardData.fincas.columna1.map((finca) => (
      <Card key={finca.id} className="min-h-[120px] hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className={finca.color}>{finca.titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{finca.descripcion}</p>
        </CardContent>
      </Card>
    ))}
  </div>

  {/* Columna 2 */}
  <div className="space-y-4">
    {dashboardData.fincas.columna2.map((finca) => (
      <Card key={finca.id} className="min-h-[120px] hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className={finca.color}>{finca.titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{finca.descripcion}</p>
        </CardContent>
      </Card>
    ))}
  </div>

  {/* Columna 3 */}
  <div className="space-y-4">
    {dashboardData.fincas.columna3.map((finca) => (
      <Card key={finca.id} className="min-h-[120px] hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className={finca.color}>{finca.titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{finca.descripcion}</p>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

#### 3. Mapear alertas
```jsx
{/* Columna derecha 25% (1/4) - Alertas */}
<div className="col-span-1 bg-white rounded-lg p-4">
  <div className="space-y-4">
    {dashboardData.alertas.map((alerta) => (
      <Card key={alerta.id} className="border-orange-200 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-orange-600 text-sm">{alerta.titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-xs">{alerta.descripcion}</p>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

---

### TAREA 4: Implementar Scroll Vertical y Horizontal

**Requerimientos**:

#### DESKTOP:
- **Contenedor de fincas (3 columnas)**: Scroll vertical
- **Contenedor de alertas**: Scroll vertical

#### TABLET:
- **Contenedor de fincas (3 columnas)**: Scroll vertical
- **Contenedor de alertas**: Scroll horizontal

#### MOBILE:
- **Contenedor de fincas (stack vertical)**: Scroll vertical
- **Contenedor de alertas colapsables**: Scroll horizontal

**Implementación con Tailwind**:

```jsx
// DESKTOP - Fincas scroll vertical
<div className="col-span-3 grid grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
  {/* Columnas de fincas */}
</div>

// DESKTOP - Alertas scroll vertical
<div className="col-span-1 bg-white rounded-lg p-4 max-h-[600px] overflow-y-auto">
  {/* Alertas */}
</div>

// TABLET - Alertas scroll horizontal
<div className="bg-white rounded-lg p-4 md:max-h-[300px] md:overflow-x-auto lg:hidden">
  <div className="md:flex md:space-x-4 md:min-w-max">
    {/* Alertas en horizontal */}
  </div>
</div>

// TABLET - Fincas scroll vertical
<div className="hidden md:grid md:grid-cols-3 gap-4 md:max-h-[600px] md:overflow-y-auto lg:hidden">
  {/* Fincas */}
</div>

// MOBILE - Fincas scroll vertical
<div className="md:hidden space-y-4 max-h-[600px] overflow-y-auto">
  {/* Fincas stack vertical */}
</div>

// MOBILE - Alertas scroll horizontal (dentro del Collapsible)
<CollapsibleContent>
  <div className="flex space-x-4 overflow-x-auto pb-2">
    {/* Alertas en horizontal con min-width */}
  </div>
</CollapsibleContent>
```

---

## Estructura de Archivos Involucrados

```
frontend/
├── src/
│   ├── app/
│   │   └── (app)/
│   │       └── fincas/
│   │           └── page.jsx          # ⚠️ A MODIFICAR
│   └── data/
│       └── dashboard-fincas-mock.json # ✅ A CREAR
```

---

## Checklist de Verificación Fase 3

Una vez completada la Fase 3, verificar:

### Tarea 1: Fondo de Alertas
- [ ] Columna de alertas tiene fondo blanco en desktop
- [ ] Contenedor de alertas tiene fondo blanco en tablet
- [ ] Contenedor de alertas tiene fondo blanco en mobile

### Tarea 2: Archivo JSON
- [ ] Archivo `dashboard-fincas-mock.json` creado
- [ ] 5 items en cada columna de fincas (columna1, columna2, columna3)
- [ ] 5 items en alertas
- [ ] Colores correctos: rojo (col1), ámbar (col2), verde (col3)
- [ ] IDs únicos en cada item

### Tarea 3: Mapeo de Datos
- [ ] Import del JSON funciona correctamente
- [ ] Columnas de fincas mapean correctamente el JSON
- [ ] Alertas mapean correctamente el JSON
- [ ] Colores de texto se aplican dinámicamente
- [ ] NO hay cards hardcodeadas (todo mapeado)

### Tarea 4: Scroll Vertical/Horizontal
- [ ] Desktop: Contenedor de fincas con scroll vertical funcional
- [ ] Desktop: Contenedor de alertas con scroll vertical funcional
- [ ] Tablet: Contenedor de fincas con scroll vertical funcional
- [ ] Tablet: Contenedor de alertas con scroll horizontal funcional
- [ ] Mobile: Fincas con scroll vertical funcional
- [ ] Mobile: Alertas con scroll horizontal funcional (dentro de Collapsible)
- [ ] Alturas máximas (`max-h-[600px]`) aplicadas correctamente
- [ ] Scrollbars visibles cuando hay overflow

---

## Consideraciones Adicionales

### Scroll Styling (Opcional)
Para mejorar la UX del scroll, considerar agregar estilos custom:

```jsx
// En el componente o en globals.css
<style jsx>{`
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`}</style>
```

O usar plugin de Tailwind para scrollbar styling.

### Imagen de Referencia
El usuario compartirá una imagen con más detalles sobre el diseño de las cards.

---

## Próximas Fases (Post Fase 3)

1. **Fase 4**: Integrar datos reales desde backend API
2. **Fase 5**: Implementar filtros y búsqueda
3. **Fase 6**: Sistema de alertas funcional
4. **Fase 7**: Gráficos y estadísticas

---

## Notas Técnicas

### Colores de Tailwind usados:
- **Rojo**: `text-red-600`
- **Ámbar**: `text-amber-600`
- **Verde**: `text-green-600`
- **Naranja (alertas)**: `text-orange-600`, `border-orange-200`

### Componentes UI necesarios:
- `Card`, `CardHeader`, `CardTitle`, `CardContent` (shadcn/ui)
- `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger` (shadcn/ui)
- `ChevronDown` (lucide-react)

### Archivo actual:
- **Ubicación**: `C:\Users\DiegoB\Desktop\sabio-crm-fs\frontend\src\app\(app)\fincas\page.jsx`
- **Estado**: Placeholders estáticos, layout responsive funcional

---

**Última actualización**: 2026-01-12
**Autor**: Claude Code + DiegoB
**Estado del proyecto**: Fase 2 ✅ | Fase 3 ⏳
