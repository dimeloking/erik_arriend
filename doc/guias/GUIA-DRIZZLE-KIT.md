# Mini tutorial de Drizzle Kit en este boilerplate

Esta app usa **Drizzle ORM** para escribir el modelo de la base en TypeScript y **Drizzle Kit** para crear/aplicar migraciones SQL.

## Archivos importantes

- `src/models/Schema.ts`: aquí vive el modelo de la base en TypeScript.
- `drizzle.config.ts`: configuración de Drizzle Kit.
- `migrations/`: carpeta donde Drizzle guarda los archivos `.sql`.
- `.env`: aquí está `DATABASE_URL`, que define a qué base se conecta Drizzle.

En este proyecto, `drizzle.config.ts` apunta a:

```ts
schema: './src/models/Schema.ts',
out: './migrations',
```

Eso significa:

- Drizzle lee el schema desde `src/models/Schema.ts`.
- Drizzle crea migraciones dentro de `migrations/`.

## Flujo normal recomendado

Cuando quieras cambiar la estructura de la base, hazlo así:

```bash
# 1. Edita el modelo TypeScript
src/models/Schema.ts

# 2. Genera el SQL de migración
npm run db:generate

# 3. Aplica la migración a la base
npm run db:migrate

# 4. Abre Drizzle Studio para mirar la base
npm run db:studio
```

Este es el flujo más sano:

```txt
Schema.ts -> migración SQL -> base de datos -> Drizzle Studio
```

## Qué hace cada comando

### `npm run db:generate`

Crea un archivo `.sql` nuevo en `migrations/` comparando el estado anterior con lo que cambiaste en `Schema.ts`.

Ejemplo:

```bash
npm run db:generate
```

Resultado típico:

```txt
migrations/0003_nombre_generado.sql
```

### `npm run db:migrate`

Aplica las migraciones pendientes a la base configurada en `.env`.

```bash
npm run db:migrate
```

Si tu `DATABASE_URL` apunta a Neon, aplica a Neon. Si apunta a PGlite local, aplica a local.

### `npm run db:studio`

Abre Drizzle Studio.

```bash
npm run db:studio
```

Importante: Studio no es quien actualiza tu schema. Studio solo muestra/permite editar la base que ya existe.

## Qué pasa con `npm run dev`

En este boilerplate, `npm run dev` corre:

```json
"dev": "run-p db-server:file dev:*"
```

y `db-server:file` ejecuta:

```json
"db-server:file": "pglite-server -m 100 --db=local.db --run \"cmd /c npm run db:migrate\""
```

Eso quiere decir:

- `npm run dev` sí intenta aplicar migraciones existentes.
- `npm run dev` no crea migraciones nuevas.

Si cambiaste `Schema.ts`, primero necesitas:

```bash
npm run db:generate
```

Luego puedes correr:

```bash
npm run dev
```

o directamente:

```bash
npm run db:migrate
```

## Caso inverso: hice cambios directo en Drizzle Studio / SQL Editor

Esto puede pasar:

```txt
Base de datos cambió -> Schema.ts quedó viejo
```

Ejemplo: en SQL Editor hiciste:

```sql
ALTER TABLE property ADD COLUMN payment_day integer DEFAULT 5 NOT NULL;
```

pero no agregaste `paymentDay` en `src/models/Schema.ts`.

En ese caso, Drizzle no “sincroniza mágico” el archivo `Schema.ts`. Tienes dos caminos.

## Opción recomendada: copiar el cambio manualmente a `Schema.ts`

Si sabes qué cambiaste, lo mejor es actualizar `Schema.ts` tú mismo.

Ejemplo:

```ts
paymentDay: integer('payment_day').notNull().default(5),
```

Luego genera una migración para que el historial del proyecto quede ordenado:

```bash
npm run db:generate
```

Pero ojo: si el cambio ya existe en la base, esa migración puede intentar aplicar algo que ya está aplicado. En ese caso revisa el `.sql` generado antes de correr `db:migrate`.

## Opción automática/parcial: introspección con Drizzle Kit

Drizzle Kit tiene comando de introspección/pull para leer una base existente y generar archivos TypeScript desde esa base.

El comando base es:

```bash
npx drizzle-kit pull
```

Usa `drizzle.config.ts` para conectarse a la base configurada en `DATABASE_URL`.

Pero para este proyecto recomiendo hacerlo en una carpeta temporal, no encima de tu schema principal:

```bash
npx drizzle-kit pull --out ./drizzle-introspected
```

Luego comparas:

```txt
drizzle-introspected/schema.ts
src/models/Schema.ts
```

y copias manualmente solo lo que necesitas.

Esto evita dañar tu `Schema.ts` actual, nombres, imports o estructura que ya adaptaste a la app.

## Flujo seguro si hiciste cambio remoto sin tocar `Schema.ts`

Usa este checklist:

```bash
# 1. Traer una foto del schema real de la base a carpeta temporal
npx drizzle-kit pull --out ./drizzle-introspected

# 2. Comparar lo generado con tu schema real
# Revisa:
# - drizzle-introspected/schema.ts
# - src/models/Schema.ts

# 3. Copiar manualmente el cambio a src/models/Schema.ts

# 4. Revisar si hace falta migración local
npm run db:generate

# 5. Aplicar solo si el SQL tiene sentido
npm run db:migrate
```

Si el cambio ya está aplicado en Neon pero no en local, puedes necesitar aplicar esa migración solo en local o ajustar el SQL para que no falle.

## Regla práctica

Evita cambiar estructura desde Drizzle Studio o SQL Editor salvo que sea algo urgente.

Lo ideal es:

```txt
1. Cambiar Schema.ts
2. Generar migración
3. Aplicar migración
4. Verificar en Studio
```

Ese flujo deja el proyecto ordenado y cualquier persona que clone el repo puede reconstruir la base con las migraciones.

## Diferencia simple

| Herramienta | Para qué sirve |
|---|---|
| `Schema.ts` | Modelo oficial de la base en el código |
| `db:generate` | Crea SQL desde `Schema.ts` |
| `db:migrate` | Aplica SQL a la base |
| `db:studio` | Ver/editar datos visualmente |
| `drizzle-kit pull` | Leer una base existente y generar schema TypeScript |

## Recomendación para esta app

Para tu app de arriendos, usa siempre este flujo:

```bash
npm run db:generate
npm run db:migrate
npm run check:types
npm run db:studio
```

Y si alguna vez hiciste un cambio directo en Neon/Studio:

```bash
npx drizzle-kit pull --out ./drizzle-introspected
```

Luego compara y copia el cambio a `src/models/Schema.ts`.

## Referencias oficiales

- Drizzle Kit overview: https://orm.drizzle.team/docs/kit-overview
- Drizzle migrations: https://orm.drizzle.team/docs/migrations
- Drizzle Studio: https://orm.drizzle.team/drizzle-studio/overview
- Drizzle Kit pull/introspection: https://orm.drizzle.team/docs/drizzle-kit-pull
