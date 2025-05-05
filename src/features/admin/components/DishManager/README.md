# Migración de AdminDishes a DishManager

Este directorio contiene los componentes relacionados con la gestión de platos en el panel de administración.

## Cambios realizados

Se ha migrado el antiguo componente `AdminDishes.tsx` al nuevo componente `DishManager.tsx`, siguiendo la nueva estructura de directorios y las convenciones de nomenclatura del proyecto.

### Mejoras principales:

1. Separado el formulario en su propio componente `DishForm.tsx`
2. Migrado de `StatusFilter` a `FilterTabs` para la selección de filtros
3. Migrado de `CrudCardList` a `EntityCardGrid` para mostrar los platos
4. Implementado manejo de errores mejorado con `ErrorMessage`
5. Mejorados los tipos y la documentación con JSDoc

### Archivos eliminados:

- `src/components/admin/StatusFilter.tsx` → Reemplazado por `src/components/ui/molecules/FilterTabs`
- `src/components/admin/CrudCardList.tsx` → Reemplazado por `src/components/ui/organisms/EntityCardGrid`

### Próximos pasos:

- Migrar completamente el componente `AdminDishes.tsx`
- Actualizar las páginas que utilizan el componente antiguo 