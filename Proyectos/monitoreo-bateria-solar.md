````md
# Integrando mi Batería Solar al Ecosistema de la Cabaña: Ingeniería Inversa, Tráfico de Red y un Dashboard Propio

Uno de los mayores placeres de construir una cabaña **off-grid** es que cada sistema termina formando parte de un ecosistema mucho más grande.

No basta con instalar una batería, un inversor o un arreglo de paneles solares; el verdadero objetivo es que **todos los dispositivos hablen entre sí** y que la información esté disponible desde un único lugar.

Ese era exactamente el siguiente paso en la evolución de mi sistema de domótica.

---

## El Nuevo Integrante del Sistema

> 📷 **Fotografía sugerida:** `005.jpg` — La batería Felicity Solar recién instalada.

Hace algún tiempo adquirí una batería **Felicity Solar de 10 kWh**, encargada de almacenar toda la energía producida por los paneles solares de la cabaña.

Desde el primer momento quedé impresionado.

No solamente por su capacidad, sino porque el fabricante incluía una aplicación móvil capaz de mostrar prácticamente toda la información del sistema en tiempo real.

Entre los datos disponibles se encontraban:

- Estado de carga (SOC).
- Potencia de carga.
- Potencia de descarga.
- Voltaje.
- Corriente.
- Estado general del sistema.
- Alarmas.
- Diversos parámetros internos.

Era exactamente la información que siempre había querido conocer.

---

## El Problema

La emoción duró poco.

Cada vez que quería revisar el estado de la batería tenía que hacer exactamente el mismo proceso:

- sacar el teléfono;
- abrir la aplicación;
- esperar a que conectara;
- navegar hasta la pantalla correcta.

No era difícil.

Simplemente era incómodo.

Y había un problema aún mayor.

Toda la domótica de la cabaña ya contaba con un **dashboard web** desarrollado completamente por mí.

Desde ese panel podía controlar iluminación, sensores, sistemas automáticos y distintos dispositivos distribuidos por toda la propiedad.

La batería era el único componente importante que seguía viviendo dentro de una aplicación cerrada.

No quería depender de ella.

Quería que la información apareciera directamente dentro de mi propio ecosistema.

---

# El Objetivo

La meta era sencilla de describir, aunque no tanto de lograr.

Quería crear una nueva sección dentro de mi dashboard donde pudiera visualizar en tiempo real información como:

- porcentaje de carga;
- potencia entrando a la batería;
- potencia saliendo;
- estado actual;
- carga o descarga;
- indicadores generales del sistema.

Todo utilizando una interfaz diseñada completamente por mí.

Pero primero había que responder una pregunta.

**¿Cómo obtenía esa información la aplicación oficial?**

---

# La Investigación

> 📷 **Fotografía sugerida:** `006.jpg` — Captura de la aplicación oficial mostrando la información de la batería.

Las aplicaciones no generan información por arte de magia.

Si el teléfono mostraba esos datos, significaba que en algún lugar existía una comunicación entre la aplicación y la batería.

Lo único que tenía que hacer era descubrir cómo ocurría.

---

# Conectando la Batería a la Red

El primer paso consistió en conectar la batería a la red Wi-Fi de la cabaña utilizando el procedimiento oficial del fabricante.

Una vez conectada, la aplicación dejó de comunicarse mediante Bluetooth y comenzó a hacerlo a través de la red local.

Eso era exactamente lo que necesitaba.

Ahora todo el tráfico pasaba por mi infraestructura.

Y eso significaba que podía observarlo.

---

# Espiando la Comunicación

Aquí comenzó la parte divertida.

En lugar de intentar adivinar cómo funcionaba el protocolo, decidí observar directamente la conversación entre la aplicación y la batería.

Para ello utilicé una aplicación llamada **PCAPdroid**, una herramienta que permite capturar y analizar todo el tráfico de red generado por otras aplicaciones instaladas en Android.

> 📷 **Fotografía sugerida:** `007.jpg` — Captura de PCAPdroid mostrando las conexiones de red.

Cada petición, cada respuesta y cada paquete podían verse en tiempo real.

Era como colocar un micrófono entre dos dispositivos que estaban conversando.

Solo había que prestar atención.

---

# El Descubrimiento

Después de analizar varias solicitudes comenzó a aparecer un patrón.

La aplicación realizaba peticiones HTTP hacia la dirección IP de la batería.

Cada cierto tiempo consultaba distintos endpoints para actualizar la información mostrada en pantalla.

Y entonces apareció el que estaba buscando.

Un endpoint llamado:

```text
realtInfo
```

Bastaba realizar un simple **GET** para obtener una enorme cantidad de información en formato JSON.

Sin autenticaciones complicadas.

Sin cifrado adicional.

Sin protocolos propietarios.

Simplemente una petición HTTP.

Fue uno de esos momentos en los que todo el proyecto cambia por completo.

---

# El JSON que lo Cambió Todo

> 📷 **Fotografía sugerida:** `008.jpg` — Captura del JSON recibido desde la batería.

La respuesta incluía prácticamente todo lo que la aplicación oficial mostraba en pantalla.

Entre muchos otros datos se encontraban:

- porcentaje de batería;
- potencia de carga;
- potencia de descarga;
- voltajes;
- corrientes;
- estados internos;
- indicadores del BMS;
- parámetros de funcionamiento.

En realidad, la aplicación oficial no hacía nada extraordinario.

Simplemente tomaba ese JSON y lo dibujaba de una manera agradable.

Ahora yo podía hacer exactamente lo mismo.

---

# Integrando la Información al Dashboard

Con el endpoint descubierto, el resto del trabajo fue mucho más sencillo.

Mi servidor comenzó a consultar periódicamente la batería mediante peticiones HTTP.

Cada respuesta era procesada por una función encargada de interpretar el JSON.

Después de convertir todos esos valores a un formato más amigable, la información era enviada directamente a mi interfaz web.

Ya no dependía de la aplicación oficial.

Ahora todo aparecía integrado dentro del dashboard de la cabaña.

> 📷 **Fotografía sugerida:** `009.jpg` — Nueva pestaña del dashboard mostrando el estado de la batería.

---

# Una Interfaz Pensada para Mí

La ventaja de tener acceso directo a los datos es que ahora puedo presentarlos exactamente como necesito.

Ya no estoy limitado al diseño del fabricante.

Puedo decidir qué indicadores son importantes, qué gráficas mostrar y cómo organizar la información.

Entre los datos disponibles ahora se encuentran:

- Estado de carga (SOC).
- Potencia de entrada.
- Potencia de salida.
- Flujo energético en tiempo real.
- Estado de carga o descarga.
- Información general del sistema.
- Indicadores adicionales para futuras automatizaciones.

Y como todo forma parte del mismo dashboard, puedo visualizar el estado completo de la cabaña desde un único lugar.

---

# Más Allá de Mostrar Datos

Este proyecto no consistía únicamente en copiar la información de una aplicación.

El verdadero objetivo era integrar la batería al ecosistema inteligente de la cabaña.

Ahora que los datos están disponibles dentro de mi propio software, puedo utilizarlos para crear nuevas automatizaciones.

Por ejemplo:

- limitar ciertos consumos cuando el SOC sea bajo;
- generar alertas personalizadas;
- registrar históricos;
- construir gráficas de rendimiento;
- correlacionar la energía almacenada con la producción solar y el consumo de la cabaña.

En otras palabras, la batería dejó de ser un dispositivo aislado para convertirse en un componente más del sistema de domótica.

---

# Conclusión

Muchas veces la información que necesitamos ya existe.

El verdadero reto consiste en descubrir cómo obtenerla.

En este caso, bastó con observar cuidadosamente la comunicación entre la aplicación oficial y la batería para descubrir que toda la información estaba disponible mediante una sencilla API local.

A partir de ese momento, integrar la batería al ecosistema de la cabaña fue simplemente cuestión de escribir el software adecuado.

Hoy ya no necesito abrir la aplicación del fabricante para saber cómo se encuentra mi sistema de almacenamiento.

Toda la información aparece directamente en el dashboard que desarrollé para administrar la cabaña, convirtiendo otro dispositivo comercial en una pieza completamente integrada dentro de mi propio ecosistema tecnológico.

Y lo mejor de todo es que este es solo el comienzo.
````
