# Configuración de entorno para flujo real Hedera Testnet

## Variables requeridas

Definí estas variables en tu `.env.local` (no subas secretos al repo):

```bash
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_HCS_TOPIC_ID=0.0.xxxxx
APP_ENCRYPTION_KEY=una-clave-larga-aleatoria
```

## Qué hace cada variable

- `HEDERA_ACCOUNT_ID`: cuenta operadora custodial en Testnet.
- `HEDERA_PRIVATE_KEY`: private key de la cuenta operadora.
- `HEDERA_HCS_TOPIC_ID`: tópico HCS donde se publican ventas.
- `APP_ENCRYPTION_KEY`: clave usada para cifrar private keys de wallets de usuarios en `db.json`.

## Flujo implementado

1. Registro con correo + contraseña.
2. Creación real de cuenta Hedera Testnet por usuario.
3. Persistencia de usuario/wallet/sesión en `db.json`.
4. Registro de venta con envío real a HCS.
5. Persistencia local de venta + metadata de HCS.
