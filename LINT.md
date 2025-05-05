# Guía de Linting y Formateo de Código

Este documento proporciona instrucciones para mantener la calidad del código en el proyecto.

## Problemas comunes y cómo solucionarlos

### 1. Tipos `any`

Actualmente, los tipos `any` están permitidos pero se recomienda reemplazarlos gradualmente:

```typescript
// ❌ Evitar
function procesar(data: any) {
  return data.value;
}

// ✅ Preferir
function procesar(data: { value: string }) {
  return data.value;
}
```

### 2. Variables no utilizadas

Para variables que necesitas declarar pero no usar, usa el prefijo `_`:

```typescript
// ❌ Generará warning
import { filtrarPorEstado } from '@/lib/promoUtils';
// No se usa filtrarPorEstado...

// ✅ No generará warning
import { filtrarPorEstado as _filtrarPorEstado } from '@/lib/promoUtils';
// o
const _unusedVar = 123; // Variable declarada pero no usada
```

### 3. Manejo de errores en bloques catch

Usa correctamente el tipado de errores en bloques catch:

```typescript
// ❌ Evitar
try {
  // código...
} catch (error) {
  console.error(error.message); // Error: error es tipo 'unknown'
}

// ✅ Preferir
try {
  // código...
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  console.error(errorMessage);
}
```

### 4. Propiedades en archivos Astro

En componentes Astro, usa `class` en lugar de `className` (está configurado para ignorar este error).

## Comandos útiles

Ejecuta estos comandos para mantener la calidad del código:

- `pnpm lint` - Verificar problemas de linting
- `pnpm lint:fix` - Arreglar automáticamente problemas de linting
- `pnpm format` - Formatear código con Prettier
- `pnpm fix-all` - Ejecutar lint:fix y format a la vez

## Configuración actual

La configuración de ESLint y Prettier está en los archivos:

- `.eslintrc.json`
- `.prettierrc`

Husky ejecutará verificaciones antes de cada commit, pero permitirá continuar mostrando advertencias.
