# Migraciones D1/SQLite

## Dos propietarios deliberados

- `0000_flashy_banshee.sql` y `0001_cool_scalphunter.sql` son migraciones
  generadas y figuran en `meta/_journal.json` y sus snapshots.
- `0002_dual_experiments.sql` y
  `0003_ss_professional_bizum_orders.sql` son migraciones SQL manuales. No se
  añaden al journal ni se crean snapshots falsos para que Drizzle crea que las
  generó.

`db/schema.ts` representa columnas, tipos, checks simples e índices que usa la
aplicación. La migración manual `0003` es la autoridad de ejecución para:

- índices únicos parciales de conciliación;
- invariantes entre pedido, acceso y devolución;
- protección append-only de `order_events`;
- mensajes de aborto de los triggers.

`drizzle-kit migrate` no es el runner de `0002` ni `0003`. `drizzle-kit check`
solo valida las entradas presentes en el journal y, por tanto, no demuestra que
estas dos migraciones manuales estén aplicadas.

## Orden y runner

En una base vacía, ejecutar exactamente una vez y en este orden:

```powershell
$SsD1Database = "<DATABASE_NAME>"
npx wrangler d1 execute $SsD1Database --local --file drizzle/0000_flashy_banshee.sql
npx wrangler d1 execute $SsD1Database --local --file drizzle/0001_cool_scalphunter.sql
npx wrangler d1 execute $SsD1Database --local --file drizzle/0002_dual_experiments.sql
npx wrangler d1 execute $SsD1Database --local --file drizzle/0003_ss_professional_bizum_orders.sql
```

Para la base remota, usar los mismos cuatro comandos y el mismo orden con
`--remote` en lugar de `--local`. Si la base ya tiene 0000–0002, aplicar solo
0003 después de comprobar que aún no existe la tabla `orders`. No repetir una
migración ni usar `--remote` sin backup y autorización de despliegue.

## Verificación reproducible

La prueba de migración usa SQLite real en memoria, activa foreign keys y aplica
0000–0003 en el orden anterior:

```powershell
node --experimental-strip-types --test tests/order-schema.test.mjs tests/order-migration.test.mjs
```

La prueba ejecuta inserciones y mutaciones válidas e inválidas. No considera la
presencia de texto en el SQL como evidencia suficiente de una restricción.
