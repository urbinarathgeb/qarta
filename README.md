# Qarta - Sistema de Gestión de Menú para Restaurantes

Este proyecto es una aplicación web para gestionar la carta y promociones de un restaurante, desarrollada con Astro, React, TypeScript y Supabase.

## Mejoras implementadas

### Estructura y organización del código
- Centralización de tipos e interfaces en carpetas específicas
- Componentes UI reutilizables para mejorar la coherencia
- Sistema de manejo de errores unificado
- Estructura de carpetas optimizada

### Calidad de código
- Configuración de ESLint y Prettier
- Tests unitarios con Vitest
- Hooks pre-commit con Husky para verificar la calidad del código

### Componentes reutilizables
- Componentes UI básicos (Button, FormField, ErrorMessage)
- Tipos TypeScript mejorados y reutilizables
- Utilidades para formato y manejo de errores

## Estructura del proyecto

```
src/
├── assets/         # Imágenes y archivos estáticos
├── components/     # Componentes de la aplicación
│   ├── admin/      # Componentes para el área administrativa
│   ├── menu/       # Componentes para el menú público
│   └── ui/         # Componentes UI reutilizables
├── hooks/          # Hooks personalizados de React
├── layouts/        # Layouts de Astro
├── lib/            # Funciones de biblioteca y clientes
├── pages/          # Páginas de Astro
├── styles/         # Estilos globales
├── types/          # Interfaces y tipos TypeScript
└── utils/          # Utilidades y funciones auxiliares
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

```sh
pnpm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
