# AGENTS.md — ChacraChain
> Project orchestration for ARZ Lite.
> Always read this first.

## Documentation Map

| File | Status |
|---|---|
| `product.md` | ✅ complete |
| `stack.md` | ✅ complete |
| `userflow_registrar_venta.md` | ✅ complete |
| `userflow_consultar_precio.md` | ✅ complete |

## Loading Rules
- Before any task → read this AGENTS.md first.
- Before implementing a feature → read `userflow_*.md` for that feature.
- Before any technical decision → read `stack.md`.
- Before understanding the product → read `product.md`.

## Demo Flow Summary
El jurado va a ver:
1. Pantalla principal con opciones para registrar venta o consultar precios
2. Botón "Registrar Venta" → formulario para ingresar datos de transacción agrícola
3. Botón "Consultar Precio" → muestra precios promedio del mercado para papa
4. Tras registrar venta → confirma envío a HCS y muestra tx hash
5. Tras consultar precio → muestra precio promedio basado en datos históricos en HCS

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @hashgraph/sdk

## Current Focus
MVP funcional - registro inmutable de ventas agrícolas y oráculo de precios usando HCS

## Running Locally
```bash
npm run dev
```

## Active MCPs
| MCP | Reason | Usage |
|---|---|---|
| `Hedera_search_hedera` | Docs de Hedera | Queries, transacciones HCS |

## Active Skills
| Skill | Reason | Usage |
|---|---|---|
| `nextjs-15` | Proyecto usa Next.js | Páginas, routing |
| `tailwind-4` | Estilos minimalistas | UI components |