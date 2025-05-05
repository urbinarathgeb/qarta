# Componentes UI

Esta carpeta contiene componentes de interfaz de usuario reutilizables organizados según el patrón de Diseño Atómico.

## Estructura

```
ui/
├── atoms/       # Componentes básicos independientes
├── molecules/   # Combinaciones de átomos y componentes simples
└── organisms/   # Componentes complejos que combinan moléculas
```

## Componentes disponibles

### Atoms

Componentes básicos que no dependen de otros componentes:

- `Button`: Botón con diferentes variantes (primary, outline, danger, success) y tamaños
- `ErrorMessage`: Componente para mostrar mensajes de error formateados

### Molecules

Componentes que combinan átomos y aportan funcionalidad adicional:

- `FormField`: Campo de formulario que incluye etiqueta, input y mensaje de error
- `FilterTabs`: Selector de pestañas para filtrar contenido (reemplaza a StatusFilter)

### Organisms

Componentes complejos que combinan múltiples elementos:

- `EntityCardGrid`: Grilla de tarjetas para mostrar entidades con acciones (reemplaza a CrudCardList)

## Buenas prácticas

1. Usar `index.ts` para exportar todos los componentes desde cada nivel
2. Documentar los componentes con JSDoc para mejor autocompletado
3. Usar tipos/interfaces TypeScript para los props de los componentes
4. Seguir las convenciones de nombre establecidas
5. Importar componentes desde el nivel más alto posible `@/components/ui`
