# Estructura del Proyecto Qarta

Este documento explica la estructura y organización del código del proyecto Qarta.

## Estructura de Directorios

```
src/
├── assets/              # Recursos estáticos (imágenes, iconos, etc.)
├── components/          # Componentes reutilizables
│   ├── ui/              # Componentes de UI generales
│   │   ├── atoms/       # Componentes básicos (Button, ErrorMessage, etc.)
│   │   ├── molecules/   # Componentes más complejos (FormField, FilterTabs, etc.)
│   │   └── organisms/   # Conjuntos de componentes (EntityCardGrid, Forms, etc.)
│   └── admin/           # Componentes admin (dashboard, cards, etc.)
├── constants/           # Valores constantes (etiquetas, opciones, etc.)
├── features/            # Organizado por dominio de negocio
│   ├── menu/            # Todo lo relacionado con el menú público
│   │   ├── components/  # Componentes específicos del menú
│   │   ├── hooks/       # Hooks específicos del menú
│   │   └── types/       # Tipos específicos del menú
│   ├── admin/           # Todo lo relacionado con el panel admin
│   │   ├── components/  # Componentes específicos de administración
│   │   │   ├── DishManager/  # Gestión de platos
│   │   │   └── PromoManager/ # Gestión de promociones
│   │   ├── hooks/       # Hooks de administración
│   │   └── types/       # Tipos de administración
├── hooks/               # Hooks reutilizables
├── layouts/             # Layouts de Astro
├── lib/                 # Bibliotecas y servicios
│   ├── api/             # Servicios de API (cliente Supabase)
│   └── utils/           # Utilidades específicas
├── pages/               # Páginas de Astro
├── styles/              # Estilos globales
├── types/               # Tipos compartidos centralizados
├── utils/               # Utilidades generales
│   ├── formatting/      # Utilidades de formateo
│   │   ├── currencyFormat.ts  # Formateo de moneda
│   │   ├── dateFormat.ts      # Formateo de fechas
│   │   └── textFormat.ts      # Formateo de texto
│   └── error/           # Manejo de errores
│       ├── errorLogger.ts     # Registro de errores
│       ├── errorParser.ts     # Análisis de errores
│       └── errorFormatter.ts  # Formateo de mensajes de error
```

## Convenciones de Nomenclatura

### Componentes

- **Componentes React**: Usar PascalCase para nombres de componentes (`Button.tsx`)
- **Carpetas de componentes**: PascalCase, nombre igual al componente (`Button/`)
- **Archivos de prueba**: Añadir `.test` al nombre (`Button.test.tsx`)

### Hooks

- **Hooks**: Prefijo `use` en camelCase (`useCrudList.ts`)

### Utilidades

- **Utilidades**: camelCase descriptivo (`errorFormatter.ts`)
- **Archivos de barril**: Nombre `index.ts` en cada carpeta para exportaciones

### Tipos

- **Interfaces/Types**: Nombrados en PascalCase (`DishProps`)
- **Enums**: PascalCase (`DishCategory`)

## Estructura de Componentes UI

Se sigue el patrón de Diseño Atómico para organizar los componentes UI:

### Atoms

Componentes básicos que no dependen de otros componentes:

- `Button`: Botón con variantes y tamaños
- `ErrorMessage`: Componente para mostrar mensajes de error
- `Icon`: Iconos del sistema

### Molecules

Componentes que combinan átomos:

- `FormField`: Campo de formulario con etiqueta y mensaje de error
- `FilterTabs`: Selector de pestañas para filtrar contenido

### Organisms

Componentes complejos que combinan moléculas:

- `EntityCardGrid`: Grilla de tarjetas para mostrar entidades con acciones

## Estructura de Features

Cada feature (característica) debe agrupar todo lo relacionado a un dominio de negocio:

```
feature-name/
├── components/          # Componentes específicos de esta feature
│   └── ComponentName/   # Agrupación de archivos por componente
│       ├── ComponentName.tsx    # Implementación principal
│       ├── ComponentName.test.tsx # Pruebas
│       └── index.ts     # Exportaciones
├── hooks/               # Hooks específicos
├── types/               # Tipos específicos
└── index.ts             # Exportaciones
```

## Consideraciones de Importación

- Usar imports con alias `@/` para importaciones absolutas desde `src/`
- Utilizar archivos `index.ts` para exportaciones de barrel
- Preferir importar desde directorios en lugar de archivos específicos
- Ejemplo: `import { Button } from '@/components/ui'` en lugar de `import Button from '@/components/ui/atoms/Button/Button'`

## Migración Progresiva

El proyecto ha completado la migración de varios componentes a la nueva estructura.

### Componentes migrados completamente

- ✅ `StatusFilter` → `FilterTabs`
- ✅ `CrudCardList` → `EntityCardGrid`
- ✅ `AdminDishes` → `DishManager` (componente obsoleto eliminado)
- ✅ `AdminPromos` → `PromoManager` (componente obsoleto eliminado)

### Componentes oficiales actuales

- `DishManager` - Gestión completa de platos en el panel administrativo
- `PromoManager` - Gestión completa de promociones en el panel administrativo  
- `EntityCardGrid` - Visualización uniforme de colecciones de datos en tarjetas

### Componentes pendientes de migración

- `AdminDashboard` → `Dashboard`
