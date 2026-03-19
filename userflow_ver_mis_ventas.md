# Userflow — Ver Mis Ventas

## Actors
- Agricultor (usuario final, autenticado vía correo + contraseña)
- Backend de ChacraChain (custodial, gestiona consultas a base de datos local)

## Preconditions
- Agricultor tiene una cuenta en ChacraChain (creada previamente con autenticación tradicional)
- El agricultor tiene al menos una sesión activa (token JWT válido)
- Existen ventas registradas previamente por el agricultor (opcional)
- App está desplegada y funcionando

## Steps

1. Agricultor inicia sesión en ChacraChain (web o móvil)
   - Sistema: Valida credenciales (correo + contraseña) y obtiene perfil del agricultor
   - Sistema: Muestra pantalla principal con opciones: "Registrar Venta", "Consultar Precio" y "Mis Ventas"

2. Agricultor toca el botón "Mis Ventas"
   - Sistema: Verifica autenticación (token JWT en localStorage)
   - Sistema: Si no hay token válido, redirige a `/login`
   - Sistema: Si está autenticado, navega a `/mis-ventas`

3. Sistema carga el historial de ventas del agricultor
   - Sistema: Muestra spinner "Cargando tus ventas..."
   - Sistema: Realiza petición GET a `/api/user/sales` con header `Authorization: Bearer {token}`
   - Backend: Valida token JWT y extrae userId
   - Backend: Consulta base de datos local (`db.json`) para obtener ventas del usuario
   - Backend: Para cada venta, busca el evento HCS asociado (topicId, transactionId, consensusTimestamp)
   - Backend: Retorna array de ventas con metadata HCS
   - Sistema: Oculta spinner y renderiza lista de ventas

4. Sistema muestra el historial de ventas
   - Si hay ventas:
     - Sistema: Muestra tabla o lista de cards con cada venta
     - Campos mostrados por venta:
       - Variedad de cultivo
       - Cantidad (kg)
       - Precio unitario (S/.)
       - Fecha de transacción
       - Fecha de registro en sistema
     - Acciones por venta:
       - "Ver en HashScan": Link externo a `https://hashscan.io/testnet/transaction/{transactionId}`
       - "Ver detalle": Expandir/collapse para ver JSON completo del mensaje HCS
   - Si no hay ventas:
     - Sistema: Muestra estado vacío con mensaje "Aún no registraste ninguna venta"
     - Sistema: Muestra CTA "Registrar mi primera venta" con link a `/registrar-venta`

5. Agricultor puede interactuar con el historial
   - Opciones disponibles:
     - Aplicar filtros (opcional para MVP): por variedad, rango de fechas
     - Ordenar por: fecha (más reciente/primera), cantidad, precio
     - Buscar por palabra clave en variedad
     - Actualizar: Pull-to-refresh o botón de recarga para obtener datos más recientes
   - Al aplicar filtros u ordenamiento:
     - Sistema: Re-renderiza lista con datos filtrados/ordenados (client-side)
     - No requiere nueva llamada a API salvo que se requiera paginación

6. Agricultor navega fuera de la pantalla
   - Opciones de navegación:
     - "Volver al inicio": Navega a `/` (dashboard principal)
     - "Registrar nueva venta": Navega a `/registrar-venta`
     - "Consultar precio": Navega a `/consultar-precio`
     - Menú de navegación/bottom bar (si existe) para otras secciones

## Acceptance Criteria
- [ ] Pantalla "Mis Ventas" se muestra correctamente solo para usuarios autenticados
- [ ] Sistema redirige a `/login` si el usuario no tiene sesión activa
- [ ] Sistema carga el historial de ventas del usuario autenticado mediante API `/api/user/sales`
- [ ] Lista de ventas muestra: variedad, cantidad, precio unitario, fecha de transacción, fecha de registro
- [ ] Cada venta tiene link "Ver en HashScan" que abre el explorador de Hedera con el transactionId
- [ ] Opción "Ver detalle" expande para mostrar el JSON completo del mensaje HCS
- [ ] Si no hay ventas registradas, sistema muestra mensaje amigable y CTA a "Registrar mi primera venta"
- [ ] Sistema muestra estados de loading (spinner) durante carga inicial y refresh
- [ ] Sistema maneja errores de API mostrando mensaje de error amigable con opción de retry
- [ ] UI es responsive y minimalista, adaptada al contexto agrícola (iconos y lenguaje sencillo)
- [ ] Filtros opcionales: por variedad de cultivo y rango de fechas (MVP+ o futuras versiones)
