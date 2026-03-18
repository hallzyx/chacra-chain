# ChacraChain - AgriTech Web3 Solution

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Proyecto: ChacraChain

ChacraChain es una aplicación descentralizada (DApp) diseñada para resolver la asimetría de información en el sector agrícola peruano, permitiendo el registro inmutable de ventas y el acceso a un oráculo de precios promedio utilizando Hedera Consensus Service (HCS).

## Características Principales

- **Registro Inmutable de Ventas:** Cada transacción de venta se envía como un mensaje a un Topic específico de HCS, generando una prueba criptográfica auditable.
- **Oráculo de Precios Promedio:** Sistema que consulta y calcula el precio promedio de mercado basándose en los datos históricos verificables registrados en la red.
- **Onboarding Web 2.5:** Autenticación tradicional (OTP vía SMS/WhatsApp) para eliminar la fricción Web3 para usuarios finales.
- **Backend Custodial:** Gestión de cuentas de Hedera y subsidización de costos de gas por parte del backend.

## Tecnologías Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **SDK Blockchain:** @hashgraph/sdk (enfocado en HCS)
- **Red DLT:** Hedera Hashgraph (Testnet para demo)

## Empezando con el Desarrollo

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

Puedes comenzar a editando las páginas en el directorio `src/app/`. La página se actualiza automáticamente conforme editas los archivos.

## Estructura del Proyecto

```
src/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Página principal (registrar venta / consultar precio)
│   ├── registrar-venta/     # Formulario de registro de venta
│   └── consultar-precio/    # Consulta de precios promedio
├── components/              # Componentes UI reutilizables
├── lib/                     # Utilidades de Hedera y funciones HCS
├── backend/                 # Lógica del backend (simulada para demo)
└── types/                   # Interfaces TypeScript
```

## Flujo de Trabajo para el Hackathon

El jurado verá:
1. Pantalla principal con opciones para registrar venta o consultar precios
2. Botón "Registrar Venta" → formulario para ingresar datos de transacción agrícola
3. Botón "Consultar Precio" → muestra precios promedio del mercado para papa
4. Tras registrar venta → confirma envío a HCS y muestra tx hash
5. Tras consultar precio → muestra precio promedio basado en datos históricos en HCS

## Despliegue en Vercel

La forma más fácil de desplegar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Consulta nuestra [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## Variables de Entorno

Para ejecutar localmente, crea un archivo `.env.local` basado en `.env.example`:

```
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=0x...
OTP_PROVIDER=twilio
DB_CONNECTION_STRING=postgres://...
```

> **Nota:** Para el demo hackathon, estas variables se simulan en el código.

## Lo que NO estamos construyendo (en este MVP)

- Wallet de autocustodia (el usuario no gestiona sus claves de Hedera directamente)
- Múltiples tipos de cultivo inicialmente (enfocado en papa)
- Integración con mercados reales de precios (solo usamos nuestros propios datos)
- Funcionalidad avanzada de cooperativas o gestión de inventario
- Tokenización de activos agrícolas (Hedera Token Service) - fase futura
- Producción real con claves reales - solo demo con testnet

---

ChacraChain: Donde la agricultura se encuentra con la cadena de bloques para crear transparencia y justicia en el mercado agrícola peruano.# chacra-chain
