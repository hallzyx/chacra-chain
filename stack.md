# Stack — ChacraChain

## Decisions
- Language: TypeScript
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS (minimalista, enfocado en usabilidad agrícola)
- Blockchain SDK: @hashgraph/sdk v2.x (enfocado en HCS)
- Authentication: OTP via SMS/WhatsApp (simulado para demo) o credenciales simples
- Backend: Next.js Route Handlers (API interna para auth, registro de ventas y HCS)
- Database: `db.json` (simulación local de persistencia para demo)
- API Communication: REST entre frontend y Route Handlers
- Deploy: Vercel (frontend) + servicio backend separado (también en Vercel o similar)

## Agent Skills
| Skill | Reason | Usage |
|---|---|---|
| `nextjs-15` | Proyecto usa Next.js App Router | Páginas, routing, Server Actions |
| `tailwind-4` | Estilos con Tailwind | Componentes, layout responsivo |
| `react-19` | React moderno | Componentes de UI |

## Active MCPs
| MCP | Reason | Usage |
|---|---|---|
| `Hedera_search_hedera` | Consultar docs de Hedera | Queries de API HCS, transacciones |

## Folder Structure
```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # Home (registrar venta / consultar precio)
│   ├── registrar-venta/  # Formulario de registro de venta
│   └── consultar-precio/ # Consulta de precios promedio
├── components/       # Componentes UI (formularios, botones, indicadores)
├── lib/              # Hedera client utilities, funciones HCS
├── backend/          # Lógica del backend (simulada en el frontend para demo)
│   ├── auth.js       # Manejo de OTP y sesiones
│   ├── hedera.js     # Cliente Hedera y funciones HCS
│   └── db.js         # Simulación de base de datos para indexar HCS
└── types/            # TypeScript interfaces
```

## Environment Variables (para demo)
| Variable | Value for demo |
|---|---|
| `HEDERA_NETWORK` | testnet |
| `HEDERA_ACCOUNT_ID` | 0.0.123456 (cuenta custodial demo) |
| `HEDERA_PRIVATE_KEY` | 0x... (clave privada demo) |
| `OTP_PROVIDER` | twilio (simulado) |
| `HEDERA_HCS_TOPIC_ID` | 0.0.xxxxxxx (topic HCS de ventas) |
| `APP_ENCRYPTION_KEY` | clave-larga-aleatoria-para-cifrado |

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Deploy: `git push main` (Vercel auto-deploy)

## What we ARE building (ChacraChain MVP)
- ✅ Registro inmutable de ventas agrícolas vía HCS
- ✅ Oráculo de precios promedio basado en datos históricos de HCS
- ✅ Autenticación tradicional (OTP simulado) para onboard Web 2.5
- ✅ Backend custodiado que gestiona cuentas de Hedera y subsidia gas
- ✅ Interfaz minimalista enfocada en usabilidad para agricultores
- ✅ Uso de Hedera Consensus Service para ordenamiento y timestamping

## What we are NOT building (en este MVP)
- 🔲 Wallet de autocustodia (el usuario no gestiona sus claves de Hedera directamente)
- 🔲 Múltiples tipos de cultivo inicialmente (enfocado en papa)
- 🔲 Integración con mercados reales de precios (solo usamos nuestros propios datos)
- 🔲 Funcionalidad avanzada de cooperativas o gestión de inventario
- 🔲 Tokenización de activos agrícolas (Hedera Token Service) - fase futura
- 🔲 Producción real con claves reales - solo demo con testnet
