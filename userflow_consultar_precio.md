# Userflow — Consultar Precio Promedio

## Actors
- Agricultor (usuario final, autenticado vía OTP o credenciales simples)
- Backend de ChacraChain (custodial, gestiona consultas a HCS y base de datos)
- (Opcional) Servicio externo de indexación o base de datos que procesa mensajes de HCS

## Preconditions
- Agricultor tiene una cuenta en ChacraChain (creada previamente con autenticación tradicional)
- El backend tiene acceso a los datos históricos de ventas registrados en HCS (ya sea mediante indexación directa de nodos espejo o mediante una base de datos que se actualiza periódicamente)
- Existen suficientes registros de ventas en HCS para calcular un promedio estadísticamente significativo (al menos N registros, donde N podría ser 10-20 para el MVP)
- App está desplegada y funcionando

## Steps
1. Agricultor inicia sesión en ChacraChain (web o móvil)
   - Sistema: Valida credenciales (OTP, WhatsApp, etc.) y obtiene perfil del agricultor
   - Sistema: Muestra pantalla principal con opciones: "Registrar Venta" y "Consultar Precio"

2. Agricultor toca el botón "Consultar Precio"
   - Sistema: Abre pantalla de consulta de precios con los siguientes filtros (opcional para MVP):
     - Variedad de cultivo (dropdown: Papa Canchan, Papa Única, etc. - default: todas)
     - Mercado de destino (input de texto o dropdown - default: todos)
     - Rango de fechas (date picker - default: últimos 30 días)
   - Sistema: Por defecto, muestra consulta sin filtros (precio promedio general)

3. Agricultor toca "Consultar Precio" (o el sistema consulta automáticamente al abrir)
   - Sistema: Muestra spinner "Calculando precio promedio..."
   - Sistema: Llama al backend de ChacraChain para obtener el precio promedio de papa
   - Backend: Consulta su base de datos/indexador que contiene los mensajes de HCS indexados
   - Backend: Filtra los mensajes según los parámetros (variedad, mercado, fecha) si se especificaron
   - Backend: Extrae el campo "precio_unitario_pen" de cada mensaje válido
   - Backend: Calcula el promedio aritmético (suma de precios / cantidad de registros)
   - Backend: Redondea a 2 decimales y devuelve el resultado junto con la cantidad de registros usados
   - Sistema: Oculta spinner y muestra el resultado

4. Sistema muestra el precio promedio en formato destacado:
   - Precio promedio: S/ 1.20 por kg
   - Basado en 157 registros de los últimos 30 días
   - Última actualización: hace 2 minutos
   - (Opcional) Gráfica simple de tendencia de precios últimos 7 días

5. Sistema muestra mensaje informativo:
   - "Este precio es el promedio ponderado de todas las ventas verificadas en cadena de ChacraChain"
   - "Los precios individuales pueden variar según calidad, cantidad y condiciones específicas"

6. Agricultor puede:
   - Tocar "Actualizar" para obtener el promedio más reciente
   - Aplicar filtros y volver a consultar
   - Tocar "Volver al inicio"

## Acceptance Criteria
- [ ] Pantalla de consulta de precios se muestra correctamente con filtros opcionales
- [ ] Sistema llama al backend para obtener precio promedio cuando se solicita
- [ ] Backend consulta correctamente los datos indexados de HCS (mensajes de ventas)
- [ ] Backend calcula el promedio aritmético de los precios unitarios en PEN
- [ ] Sistema muestra el precio promedio con formato de moneda local (S/.) y 2 decimales
- [ ] Sistema indica la cantidad de registros usados y el período de tiempo
- [ ] UI es responsive y minimalista, adaptada al contexto agrícola (usando iconos y lenguaje sencillo)
- [ ] En caso de datos insuficientes, muestra mensaje amigable: "Necesitamos más registros para calcular un promedio confiable. Sigue vendiendo y registrando en ChacraChain!"