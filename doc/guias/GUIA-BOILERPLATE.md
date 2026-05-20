# Guia simple del boilerplate

Esta guia explica, en palabras simples, para que sirve este proyecto y que hace cada herramienta o archivo importante.

Repositorio original: https://github.com/ixartz/Next-js-Boilerplate

## Idea general

Este boilerplate es una base ya armada para crear una aplicacion web profesional con Next.js.

En vez de empezar desde cero, ya trae preparadas muchas cosas que normalmente se agregan despues:

- paginas con Next.js
- componentes con React
- estilos con Tailwind CSS
- autenticacion con Clerk
- base de datos con Drizzle
- base de datos local con PGlite
- base de datos en produccion con Neon
- traducciones
- validaciones
- tests
- revision automatica del codigo
- monitoreo de errores
- Storybook para ver componentes aislados
- configuracion de VS Code
- herramientas para commits, releases y CI

Piensalo asi:

```text
Next.js = la aplicacion
React = las piezas visuales
Tailwind = los estilos
Drizzle = hablar con la base de datos
Clerk = usuarios y login
Vitest / Playwright = pruebas
Oxlint / Oxfmt / Ultracite = mantener el codigo ordenado
Lefthook / Commitlint = revisar antes de guardar cambios en Git
```

## Como se corre el proyecto

Comandos principales:

```bash
npm run dev
```

Levanta la app en desarrollo. Tambien inicia la base de datos local con PGlite.

```bash
npm run build
```

Prepara la app para produccion.

```bash
npm run build-local
```

Hace una build usando una base de datos temporal en memoria.

```bash
npm run test
```

Corre pruebas unitarias y de componentes.

```bash
npm run test:e2e
```

Corre pruebas completas en navegador con Playwright.

```bash
npm run lint
```

Revisa calidad de codigo, formato, tipos y reglas del proyecto.

```bash
npm run lint:fix
```

Intenta arreglar automaticamente formato y problemas simples.

```bash
npm run storybook
```

Abre Storybook para previsualizar componentes.

```bash
npm run db:studio
```

Abre una interfaz visual para explorar la base de datos.

## Herramientas principales

### Next.js

Es el framework principal. Maneja rutas, paginas, layouts, APIs, build, servidor de desarrollo y optimizacion.

En este proyecto se usa con App Router, por eso las paginas viven dentro de `src/app`.

### React

Es la libreria para crear componentes visuales: botones, formularios, menus, templates, paginas, etc.

### TypeScript

Es JavaScript con tipos. Ayuda a detectar errores antes de ejecutar la app.

Ejemplo simple:

```ts
const edad: number = 30;
```

Si luego intentas guardar texto en `edad`, TypeScript te avisa.

### Tailwind CSS

Sirve para dar estilos usando clases directamente en el HTML/JSX.

Ejemplo:

```tsx
<button className="rounded bg-blue-600 px-4 py-2 text-white">
  Guardar
</button>
```

### Clerk

Maneja autenticacion:

- registro
- login
- logout
- recuperar contraseña
- sesiones de usuario
- proveedores sociales si los configuras

En pocas palabras: evita que tengas que construir todo el sistema de usuarios desde cero.

### Drizzle ORM

Es la herramienta para hablar con la base de datos desde TypeScript.

En vez de escribir SQL suelto en todas partes, defines modelos y haces consultas con codigo tipado.

El archivo principal de modelos es:

```text
src/models/Schema.ts
```

### PGlite

Es una base de datos PostgreSQL local para desarrollo.

Sirve para trabajar en tu PC sin instalar Docker ni un PostgreSQL completo.

En este proyecto se usa cuando corres:

```bash
npm run dev
```

### Neon

Es PostgreSQL en la nube.

Usalo para produccion o ambientes remotos. La conexion va normalmente en `DATABASE_URL`.

### next-intl

Maneja multiples idiomas.

Los textos traducibles viven en:

```text
src/locales/en.json
src/locales/fr.json
```

La idea es no escribir textos fijos directamente en las paginas, sino leerlos desde los archivos de idioma.

### Crowdin

Es una plataforma para manejar traducciones con otras personas o con flujo automatico.

El archivo `crowdin.yml` le dice a Crowdin donde estan tus traducciones.

### T3 Env

Valida variables de entorno.

Archivo principal:

```text
src/libs/Env.ts
```

Sirve para que si falta una variable como `DATABASE_URL` o `CLERK_SECRET_KEY`, la app falle claro y rapido.

### React Hook Form

Ayuda a crear formularios sin escribir demasiado codigo.

Sirve para manejar:

- valores del formulario
- errores
- envio
- campos requeridos

### Zod

Sirve para validar datos.

Ejemplo: confirmar que un email sea email, que un texto no venga vacio, que un numero sea valido, etc.

Normalmente se usa junto con React Hook Form.

### Oxlint

Reemplaza a ESLint en este proyecto.

Un linter revisa errores y malas practicas en el codigo.

Archivo:

```text
oxlint.config.ts
```

### Ultracite

Es un conjunto de reglas para Oxlint y Oxfmt.

Piensalo como una configuracion ya preparada de estilo y calidad.

En este repo se usa dentro de:

```text
oxlint.config.ts
oxfmt.config.ts
```

### Oxfmt

Reemplaza a Prettier.

Un formateador acomoda automaticamente el codigo para que todos los archivos tengan un estilo consistente.

Archivo:

```text
oxfmt.config.ts
```

### Lefthook

Reemplaza a Husky.

Sirve para ejecutar comandos automaticamente cuando haces commits.

Archivo:

```text
lefthook.yml
```

En este proyecto hace dos cosas importantes:

- antes del commit, corre Ultracite y Knip
- al escribir el mensaje del commit, corre Commitlint

### Lint-staged

La idea de lint-staged es revisar solo archivos preparados para commit.

En este repo no aparece como herramienta principal en `package.json`; el flujo equivalente lo maneja `lefthook.yml` con reglas sobre archivos modificados.

### Commitlint

Revisa que tus mensajes de commit tengan un formato correcto.

Ejemplo valido:

```text
feat: add user dashboard
fix: correct login redirect
docs: update setup guide
```

Archivo:

```text
commitlint.config.ts
```

### Commitizen

Ayuda a escribir commits con formato correcto.

Comando:

```bash
npm run commit
```

### Knip

Busca archivos, exports y dependencias que parecen no usarse.

Comando:

```bash
npm run check:deps
```

Archivo:

```text
knip.config.ts
```

### i18n-check

Revisa que los archivos de traduccion esten completos.

Comando:

```bash
npm run check:i18n
```

### Vitest

Sirve para pruebas rapidas de funciones, utilidades y componentes.

Archivo:

```text
vitest.config.ts
```

Ejemplos en este repo:

```text
src/utils/Helpers.test.ts
src/templates/BaseTemplate.test.tsx
```

### Vitest Browser Mode

Permite probar componentes en un navegador real, sin tener que usar React Testing Library como herramienta principal.

### Playwright

Sirve para pruebas completas en navegador.

Ejemplo: abrir la pagina, hacer click, llenar un formulario y verificar que todo funcione.

Archivo:

```text
playwright.config.ts
```

Pruebas:

```text
tests/e2e
tests/integration
```

### GitHub Actions

Ejecuta tareas automaticamente en GitHub.

Por ejemplo:

- correr tests
- revisar codigo
- publicar releases
- sincronizar traducciones

Carpeta:

```text
.github/workflows
```

### Storybook

Sirve para ver componentes aislados sin abrir toda la app.

Comando:

```bash
npm run storybook
```

Archivos:

```text
.storybook/main.ts
.storybook/preview.ts
```

Ejemplo de story:

```text
src/templates/BaseTemplate.stories.tsx
```

### CodeRabbit

Hace revisiones automaticas de Pull Requests con IA.

Archivo:

```text
.coderabbit.yaml
```

### Sentry

Monitorea errores en produccion.

Si algo falla para un usuario real, Sentry ayuda a ver que paso.

Archivos relacionados:

```text
src/instrumentation.ts
src/instrumentation-client.ts
```

### Sentry Spotlight

Es como Sentry, pero para desarrollo local.

Comando:

```bash
npm run dev:spotlight
```

### Codecov

Mide que porcentaje del codigo esta cubierto por tests.

Archivo:

```text
codecov.yml
```

### LogTape

Sirve para registrar logs de la aplicacion.

Archivo:

```text
src/libs/Logger.ts
```

### Better Stack

Servicio externo para guardar, buscar y revisar logs.

### Checkly

Sirve para monitoreo como codigo.

Ejemplo: revisar cada cierto tiempo que una pagina o flujo siga funcionando.

Archivo:

```text
checkly.config.ts
```

### Arcjet

Protege la app contra abuso:

- bots
- ataques comunes
- exceso de requests
- trafico sospechoso

Archivo:

```text
src/libs/Arcjet.ts
```

### PostHog

Sirve para analitica de producto.

Ejemplo: saber que botones se usan, que paginas visitan los usuarios y como se comportan dentro de la app.

### Semantic Release

Automatiza versiones y changelog.

Cuando los commits siguen el formato correcto, puede generar releases automaticamente.

Configuracion en:

```text
package.json
```

### Visual Regression Testing

Sirve para detectar cambios visuales inesperados.

Ejemplo: si un boton se movio, un color cambio o una pantalla se rompio visualmente.

En este repo se apoya en Playwright y Chromatic.

### Absolute imports con `@`

Permite importar archivos desde `src` sin rutas largas.

Ejemplo:

```ts
import { Env } from '@/libs/Env';
```

En vez de:

```ts
import { Env } from '../../../libs/Env';
```

Configuracion:

```text
tsconfig.json
```

### Bundler Analyzer

Sirve para ver que tan grande queda el paquete final de la app.

Comando:

```bash
npm run build-stats
```

## Archivos y carpetas que ves en VS Code

### `.github`

Configuracion de GitHub.

Dentro estan los workflows que se ejecutan automaticamente, como CI, releases, traducciones y Checkly.

### `.storybook`

Configuracion de Storybook.

- `main.ts`: dice donde buscar stories y que addons usar.
- `preview.ts`: configuracion global de Storybook.
- `vitest.config.mts`: permite correr stories como tests.
- `vitest.setup.ts`: preparacion para tests de Storybook.

### `.vscode`

Configuracion recomendada para VS Code.

- `extensions.json`: extensiones sugeridas.
- `settings.json`: ajustes del editor.
- `launch.json`: configuracion para debug.
- `tasks.json`: tareas que puedes ejecutar desde VS Code.

### `.agents`

Instrucciones y skills para agentes de IA.

No afecta directamente al usuario final de la app. Sirve para que herramientas como Codex trabajen mejor en este repo.

### `.next`

Carpeta generada por Next.js.

No se edita manualmente. Se crea al correr la app o hacer build.

### `agents-md`

Carpeta auxiliar relacionada con instrucciones para agentes.

### `doc`

Documentacion o prototipos guardados dentro del proyecto.

En tu repo aparece ignorada por Knip para que no la marque como codigo muerto.

### `local.db`

Base de datos local generada por PGlite.

Sirve para desarrollo local.

### `migrations`

Historial de cambios de la base de datos.

Cuando cambias `src/models/Schema.ts`, generas una migracion con:

```bash
npm run db:generate
```

Y la aplicas con:

```bash
npm run db:migrate
```

### `node_modules`

Todas las dependencias instaladas por npm.

No se edita manualmente.

### `public`

Archivos publicos.

Aqui van imagenes, iconos o archivos que el navegador puede pedir directamente.

### `src`

Codigo principal de la aplicacion.

Es la carpeta mas importante.

### `tests`

Pruebas de integracion y pruebas completas en navegador.

## Carpetas importantes dentro de `src`

### `src/app`

Rutas y paginas de Next.js.

Si creas una nueva pagina, normalmente va aqui.

### `src/app/[locale]`

Rutas con idioma.

`[locale]` significa que la URL puede cambiar segun idioma, por ejemplo:

```text
/en
/fr
```

### `src/app/[locale]/(auth)`

Paginas relacionadas con autenticacion.

Ejemplo: login, registro, cuenta, etc.

Los parentesis en `(auth)` son grupos de rutas de Next.js. Ayudan a organizar, pero no aparecen en la URL.

### `src/app/[locale]/(marketing)`

Paginas publicas o de marketing.

Ejemplo: home, landing, informacion publica.

### `src/app/[locale]/api`

Rutas de API.

Son endpoints del backend dentro de Next.js.

### `src/components`

Componentes compartidos.

Ejemplo: botones, banners, switchers, contadores.

### `src/features`

Codigo agrupado por funcionalidad.

En tu repo aparece:

```text
src/features/casero
```

Ese modulo tiene componentes, acciones, consultas, validacion y datos de ejemplo relacionados con esa funcionalidad.

### `src/libs`

Configuraciones de librerias externas.

Ejemplos:

- `Arcjet.ts`: seguridad.
- `DB.ts`: acceso a base de datos.
- `Env.ts`: variables de entorno validadas.
- `I18n.ts`: traducciones.
- `Logger.ts`: logs.

### `src/locales`

Textos traducidos.

Ejemplo:

```text
en.json
fr.json
```

### `src/models`

Modelos de base de datos.

Archivo clave:

```text
src/models/Schema.ts
```

### `src/styles`

Estilos globales.

Archivo clave:

```text
src/styles/global.css
```

### `src/templates`

Plantillas de UI reutilizables.

Aqui esta `BaseTemplate`, que sirve como estructura base de paginas.

### `src/types`

Tipos TypeScript compartidos.

### `src/utils`

Funciones auxiliares.

Ejemplo: helpers, conexion DB, configuracion general.

### `src/validations`

Esquemas de validacion.

Normalmente usa Zod.

## Archivos de configuracion en la raiz

### `.coderabbit.yaml`

Configura CodeRabbit para revisiones automaticas con IA.

### `.env`

Variables de entorno para desarrollo local.

Aqui van secretos y configuraciones como:

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- claves publicas de Clerk
- URLs locales

No deberias subir secretos reales a GitHub.

### `.env.production`

Variables para produccion.

Normalmente aqui pondrias valores reales de Neon, Clerk, Sentry, etc.

### `.gitignore`

Lista archivos que Git debe ignorar.

Ejemplo: `node_modules`, `.next`, bases locales, archivos temporales.

### `.oxlintignore`

Lista archivos que Oxlint debe ignorar.

### `AGENTS.md`

Instrucciones para agentes de IA como Codex.

En tu caso incluye reglas importantes del proyecto.

### `CLAUDE.md`

Instrucciones para Claude Code.

Parecido a `AGENTS.md`, pero orientado a otra herramienta de IA.

### `checkly.config.ts`

Configura Checkly para monitoreo automatico.

### `codecov.yml`

Configura Codecov para cobertura de tests.

### `commitlint.config.ts`

Configura las reglas de mensajes de commit.

### `crowdin.yml`

Configura sincronizacion de traducciones con Crowdin.

### `drizzle.config.ts`

Configura Drizzle Kit.

Le dice:

- donde esta el schema
- donde guardar migraciones
- que tipo de base de datos se usa
- de donde leer `DATABASE_URL`

### `knip.config.ts`

Configura Knip.

Le dice que archivos o dependencias ignorar cuando busca codigo sin usar.

### `lefthook.yml`

Configura tareas automaticas de Git.

En este proyecto:

- antes de commit: corre Ultracite y Knip
- al crear mensaje de commit: corre Commitlint

### `LICENSE`

Licencia del proyecto.

Indica que puedes hacer legalmente con este codigo.

### `next-env.d.ts`

Archivo generado por Next.js para que TypeScript entienda tipos de Next.

No se edita manualmente.

### `next.config.ts`

Configuracion principal de Next.js.

Puede controlar imagenes, plugins, headers, redirects, bundle analyzer, etc.

### `oxfmt.config.ts`

Configuracion del formateador Oxfmt.

Reemplaza a Prettier.

### `oxlint.config.ts`

Configuracion del linter Oxlint.

Reemplaza a ESLint.

### `package.json`

Archivo central del proyecto.

Contiene:

- scripts
- dependencias
- devDependencies
- configuracion de release
- overrides de paquetes

Si quieres saber que comandos existen, mira la seccion `scripts`.

### `package-lock.json`

Archivo generado por npm.

Guarda las versiones exactas instaladas.

No se edita manualmente.

### `playwright.config.ts`

Configuracion de Playwright.

Sirve para pruebas en navegador.

### `README.md`

Documentacion original del proyecto.

### `skills-lock.json`

Archivo relacionado con skills de agentes de IA.

### `tsconfig.json`

Configuracion de TypeScript.

Aqui vive, entre otras cosas, el alias `@`.

### `tsconfig.tsbuildinfo`

Cache generado por TypeScript.

No se edita manualmente.

### `vitest.config.ts`

Configuracion de Vitest.

Sirve para pruebas unitarias y de componentes.

## Comparacion rapida: herramientas antiguas vs este boilerplate

| Antes comunmente | En este boilerplate | Para que sirve |
| --- | --- | --- |
| ESLint | Oxlint + Ultracite | Revisar errores y reglas de codigo |
| Prettier | Oxfmt | Formatear codigo |
| Husky | Lefthook | Ejecutar revisiones antes de commits |
| lint-staged | Lefthook con glob | Revisar archivos modificados |
| Jest | Vitest | Tests unitarios |
| React Testing Library | Vitest Browser Mode | Tests de componentes en navegador |
| SQL manual | Drizzle ORM | Consultar base de datos con tipos |
| PostgreSQL local manual | PGlite | Base local sin instalar PostgreSQL completo |

## Flujo recomendado para trabajar

1. Correr el proyecto:

```bash
npm run dev
```

2. Crear o editar paginas en:

```text
src/app
```

3. Crear componentes compartidos en:

```text
src/components
```

4. Crear logica por funcionalidad en:

```text
src/features
```

5. Si cambias base de datos, editar:

```text
src/models/Schema.ts
```

Luego correr:

```bash
npm run db:generate
npm run db:migrate
```

6. Antes de guardar cambios finales:

```bash
npm run lint
npm run test
```

7. Para commits con formato correcto:

```bash
npm run commit
```

## Que archivos normalmente si editas

- `src/app/**`
- `src/components/**`
- `src/features/**`
- `src/libs/**`
- `src/models/Schema.ts`
- `src/locales/*.json`
- `src/styles/global.css`
- `.env`
- `.env.production`

## Que archivos normalmente no editas a mano

- `node_modules`
- `.next`
- `package-lock.json`, salvo cuando instalas paquetes
- `next-env.d.ts`
- `tsconfig.tsbuildinfo`
- `local.db`, salvo que quieras borrar la base local

## Traduccion mental rapida

Si ves esto:

```text
config.ts
```

Normalmente significa: "archivo que le dice a una herramienta como comportarse".

Si ves esto:

```text
.yml
```

Normalmente significa: "configuracion para una herramienta externa o automatizacion".

Si ves esto:

```text
.test.ts / .test.tsx
```

Es una prueba.

Si ves esto:

```text
.stories.tsx
```

Es una historia de Storybook para previsualizar un componente.

Si ves esto:

```text
migrations
```

Es historial de cambios de base de datos.

## Resumen en una frase

Este boilerplate es una base de Next.js preparada para construir una app real: login, base de datos, estilos, traducciones, tests, monitoreo, seguridad, calidad de codigo y despliegue automatizado.

La parte importante para ti al empezar es:

```text
src/app        -> paginas
src/components -> componentes
src/features   -> funcionalidades
src/models     -> base de datos
src/locales    -> textos traducidos
.env           -> claves y configuracion local
package.json   -> comandos del proyecto
```

