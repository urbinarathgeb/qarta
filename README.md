# Qarta - Sistema de Gestión de Menú para Restaurantes

Este proyecto es una aplicación web para gestionar la carta y promociones de un restaurante, desarrollada con Astro, React, TypeScript y Supabase.

## Mejoras implementadas

### Estructura y organización del código

- Centralización de tipos e interfaces en carpetas específicas
- Componentes UI reutilizables para mejorar la coherencia
- Sistema de manejo de errores unificado
- Estructura de carpetas optimizada
- Eliminación de componentes obsoletos para mantener el código limpio

### Calidad de código

- Configuración de ESLint y Prettier
- Tests unitarios con Vitest
- Hooks pre-commit con Husky para verificar la calidad del código
- Eliminación progresiva de código no utilizado

### Componentes reutilizables

- Componentes UI básicos (Button, FormField, ErrorMessage)
- Tipos TypeScript mejorados y reutilizables
- Utilidades para formato y manejo de errores
- Gestores especializados por dominio (DishManager, PromoManager)

## Estructura del proyecto

```
src/
├── assets/         # Imágenes y archivos estáticos
├── components/     # Componentes de la aplicación
│   ├── admin/      # Componentes para el área administrativa (dashboard, cards)
│   └── ui/         # Componentes UI reutilizables
│       ├── atoms/      # Componentes básicos (Button, ErrorMessage)
│       ├── molecules/  # Componentes medios (FormField, FilterTabs)
│       └── organisms/  # Componentes complejos (EntityCardGrid)
├── features/       # Funcionalidades por dominio
│   ├── admin/      # Características de administración
│   └── menu/       # Características para el menú público
├── hooks/          # Hooks personalizados de React
├── layouts/        # Layouts de Astro
├── lib/            # Funciones de biblioteca y clientes
├── pages/          # Páginas de Astro
├── styles/         # Estilos globales
├── types/          # Interfaces y tipos TypeScript
└── utils/          # Utilidades y funciones auxiliares
    ├── error/      # Manejo y formateo de errores
    └── formatting/ # Formateo de datos (fechas, moneda, texto)
```

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Vista previa de la versión de producción
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run format` - Formatea el código con Prettier
- `npm run test` - Ejecuta las pruebas unitarias
- `npm run test:watch` - Ejecuta las pruebas en modo observador

## Variables de entorno

La aplicación requiere las siguientes variables de entorno:

```
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Recomendaciones para desarrollo

1. Utiliza los componentes UI reutilizables de `src/components/ui`
2. Sigue las convenciones de nombres establecidas
3. Asegúrate de que el código pase las verificaciones de ESLint y Prettier
4. Escribe tests unitarios para componentes nuevos
5. Utiliza los tipos centralizados en `src/types`
6. Elimina código obsoleto cuando migres a nuevos componentes