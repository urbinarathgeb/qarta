# Utilidades (Utils)

Esta carpeta contiene funciones de utilidad generales usadas en toda la aplicación.

## Estructura actual

```
utils/
├── formatting/          # Utilidades de formateo 
│   ├── currencyFormat.ts  # Formateo de moneda
│   ├── dateFormat.ts      # Formateo de fechas
│   ├── textFormat.ts      # Formateo de texto
│   └── index.ts           # Exportaciones
├── error/               # Utilidades de manejo de errores
│   ├── errorFormatter.ts  # Formateo de mensajes de error
│   ├── errorLogger.ts     # Registro de errores
│   ├── errorParser.ts     # Análisis y normalización de errores
│   ├── types.ts           # Tipos de errores
│   └── index.ts           # Exportaciones
└── index.ts             # Exportación central de todas las utilidades
```

## ✅ Migración completada

Se ha finalizado la migración de las utilidades a la nueva estructura:

- Los archivos duplicados `format.ts` y `errorHandler.ts` han sido eliminados
- Todas las importaciones han sido actualizadas para usar la nueva estructura
- Las utilidades ahora están organizadas por dominio funcional

## Convenciones de nomenclatura

- **Nombres de archivos**: Usar camelCase descriptivo (ej: `currencyFormat.ts`)
- **Nombres de funciones**: Usar verbos o acciones descriptivas (ej: `formatPriceCLP`)
- **Archivos de exportación**: Usar `index.ts` en cada carpeta

## Cómo importar utilidades

Para importar utilidades, se recomienda:

```typescript
// Importaciones específicas
import { formatPriceCLP, formatDate } from "@/utils/formatting";
import { logError, formatErrorMessage } from "@/utils/error";

// O importaciones generales desde la raíz de utils
import { formatPriceCLP, logError } from "@/utils";
``` 