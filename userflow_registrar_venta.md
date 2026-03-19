# Userflow — Registrar Venta Agrícola

## Actors
- Agricultor (usuario final, autenticado vía correo + contraseña)
- Backend de ChacraChain (custodial, gestiona cuentas de Hedera y firma transacciones)

## Preconditions
- Agricultor tiene una cuenta en ChacraChain (creada previamente con autenticación tradicional)
- El backend tiene una cuenta de Hedera asociada al agricultor (o una cuenta maestra que actúa en nombre)
- El tópico HCS para registros de ventas ya está creado (tópico ID conocido por el backend)
- App está desplegada y funcionando

## Steps
1. Agricultor inicia sesión en ChacraChain (web o móvil)
   - Sistema: Valida credenciales (correo + contraseña) y obtiene perfil del agricultor
   - Sistema: Muestra pantalla principal con opciones: "Registrar Venta" y "Consultar Precio"

2. Agricultor toca el botón "Registrar Venta"
   - Sistema: Abre formulario de registro de venta con los siguientes campos:
     - Agricultor ID (prellenado, solo lectura)
     - Variedad de cultivo (dropdown: Papa Canchan, Papa Única, etc.)
     - Cantidad en kg (input numérico)
     - Precio unitario en PEN (input numérico, con símbolo S/.)
     - Fecha y hora de transacción (auto-llenado con ahora, pero editable opcionalmente)

3. Agricultor llena el formulario y toca "Confirmar Registro"
   - Sistema: Valida que todos los campos estén completados y sean válidos
   - Sistema: Construye el payload JSON según la estructura acordada:
     ```json
     {
       "agricultor_id": "AGR-1042",
       "variedad_cultivo": "Papa Canchan",
       "cantidad_kg": 5000,
       "precio_unitario_pen": 1.20,
       "fecha_transaccion": "2026-03-17T19:11:23-05:00"
     }
     ```
   - Sistema: Llama al backend de ChacraChain para enviar este payload como mensaje a HCS
   - Sistema: Muestra spinner "Registrando venta en cadena..."

4. Backend recibe la solicitud
   - Backend: Firma la transacción HCS con la cuenta custodial asociada al agricultor
   - Backend: Envía la transacción a la red Hedera mediante @hashgraph/sdk
   - Hedera: Consenso alcanza en 2-3 segundos, asigna timestamp de consenso y ordena el mensaje
   - Nodo espejo: Almacena el mensaje y su timestamp de consenso
   - Backend: Recibe el recibo de la transacción con el ID de transacción y el consenso timestamp

5. Backend responde al frontend con éxito y el tx hash (o ID de mensaje en HCS)
   - Sistema: Oculta spinner y muestra mensaje de éxito: "¡Venta registrada en cadena!"
   - Sistema: Muestra el ID de la transacción en Hedera (abreviado) y opcionalmente el consenso timestamp
   - Sistema: Opción para "Ver detalle en explorador" (enlace a HashScan o similar para testnet)

6. Agricultor toca "Volver al inicio"
   - Sistema: Regresa a pantalla principal

## Acceptance Criteria
- [x] Formulario de registro de venta se muestra correctamente con validación de campos
- [x] Payload JSON se construye según la estructura especificada
- [x] Backend envía correctamente el mensaje a HCS usando la cuenta custodial
- [x] Transacción se confirma en Hedera y devuelve metadata de consenso
- [x] Sistema muestra éxito con tx hash y enlace a explorador (HashScan)
- [x] UI es responsive y minimalista, adaptada al contexto agrícola (usando iconos y lenguaje sencillo)
