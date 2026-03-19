# Product Specification — ChacraChain

## 1. Visión General
* **Nombre del Proyecto:** ChacraChain
* **Sector:** AgriTech / Web3
* **Usuarios Finales:** Productores agrícolas y cooperativas en Perú (enfocado inicialmente en el cultivo de papa).
* **Problema a Resolver:** La asimetría de información en el sector agrícola, donde los intermediarios dictan los precios. Los agricultores carecen de un registro confiable e inmutable de sus ventas y de una fuente verificable de los precios promedio del mercado.
* **Solución:** Una aplicación descentralizada (DApp) diseñada como un MVP de rápida adopción que permite registrar ventas de forma inmutable y consultar un oráculo de precios promedio, utilizando tecnología DLT de bajo costo.

## 2. Arquitectura Técnica y Web3
* **Red DLT:** Hedera Hashgraph.
* **Servicio Core:** Hedera Consensus Service (HCS).
* **Justificación de la Red:** HCS permite registrar eventos con marcas de tiempo precisas, ordenamiento justo y finalidad casi instantánea (2-3 segundos) a un costo microscópico ($0.0001 USD por mensaje), haciéndolo viable para la economía agrícola.
* **Estrategia de Onboarding (Web 2.5):** 
  * Cero fricción Web3 para el usuario final. No se requieren wallets como MetaMask o HashPack, ni frases semilla.
  * Autenticación tradicional (ej. OTP vía SMS, WhatsApp o credenciales estándar).
  * El backend de ChacraChain opera de forma custodial: gestiona los *Account IDs* de Hedera, firma las transacciones y subsidia el costo del gas para enviar los mensajes a la red.

## 3. Características Principales
1. **Registro Inmutable de Ventas:** Cada transacción de venta se envía como un mensaje a un *Topic* específico de HCS, generando una prueba criptográfica auditable.
2. **Oráculo de Precios (Promediador):** Un sistema que consulta y calcula el precio promedio de mercado basándose en los datos históricos verificables registrados en la red.

## 4. Estructura de Datos (Ejemplo de Payload en HCS)
Los mensajes enviados al Hedera Consensus Service siguen esta estructura JSON estándar para facilitar su posterior indexación a través de un *Mirror Node* o base de datos relacional:

```json
{
  "agricultor_id": "AGR-1042",
  "variedad_cultivo": "Papa Canchan",
  "cantidad_kg": 5000,
  "precio_unitario_pen": 1.20,
  "fecha_transaccion": "2026-03-17T19:11:23-05:00"
}
```