# Solución de Vida Aislada: Cómo Llevar Agua 150 Metros Cuesta Arriba Utilizando Únicamente Energía Solar

Cuando alguien visita una casa normalmente da por sentado que, al abrir una llave, el agua aparecerá inmediatamente. En una cabaña off-grid, esa realidad simplemente no existe. No hay red municipal, no hay bombas de la ciudad, ni hay presión proveniente de una infraestructura construida durante décadas. Aquí, cada litro de agua representa un problema de ingeniería que debe resolverse desde cero.

Este proyecto documenta la solución hidráulica que permitió abastecer de agua la cabaña de Programador Silvestre, elevando agua desde un arroyo ubicado en el fondo de un cañón hasta la parte más alta de la montaña, utilizando exclusivamente energía solar.

---

## Vista General del Proyecto

La cabaña fue construida estratégicamente sobre una cresta. Esta ubicación ofrece enormes ventajas como una excelente ventilación, mayor seguridad frente a inundaciones, un mejor aprovechamiento de la energía solar, vista privilegiada del bosque y menor humedad durante todo el año. Sin embargo, tiene un inconveniente enorme: toda el agua se encuentra 150 metros más abajo, en un arroyo permanente que atraviesa el fondo del cañón. En otras palabras, el recurso más importante para la vida estaba exactamente en el peor lugar posible.

![Vista de la ruta del agua desde el arroyo hasta la cabaña](../Images/Proyectos/002.jpg)

La gravedad no negocia. No importa qué tan potente sea una bomba o cuánto dinero inviertas, si deseas subir agua hasta la cima de una montaña debes suministrarle la energía suficiente para vencer toda la columna hidráulica. En este proyecto las cifras fueron un desnivel vertical neto de 150 metros, una longitud del tendido de 300 metros, y una línea secundaria de 150 metros con pendiente a favor hacia la cabaña.

Eso significa que la bomba debía generar una presión superior a 15 bar o 217 PSI, sin contar las pérdidas por fricción del agua recorriendo la tubería HDPE. Para ponerlo en perspectiva, una bomba doméstica típica trabaja entre 20 y 50 PSI, por lo que una bomba común simplemente trabajaría fuera de su rango de diseño, consumiría demasiada energía y terminaría dañándose rápidamente.

---

## La Solución Elegida: Sistema Kolos

Después de analizar distintas alternativas se seleccionó un sistema de bombeo solar de uso agrícola e industrial: el Sistema Kolos3-150-180-11. Este equipo incluye una bomba sumergible multietapas con cuerpo de acero inoxidable y un motor brushless de imanes permanentes que funciona con corriente continua variable. La bomba permanece instalada directamente dentro del arroyo, impulsando agua durante todas las horas de buena radiación solar.

La bomba únicamente hace el trabajo mecánico, pero el verdadero cerebro es su controlador electrónico. Este dispositivo decide en todo momento cómo debe operar el sistema mediante un algoritmo MPPT (Maximum Power Point Tracking), el cual analiza continuamente la energía entregada por los paneles solares y ajusta la velocidad del motor para aprovechar hasta el último watt disponible. Gracias a esto, la bomba arranca temprano y continúa funcionando incluso con nubosidad parcial.

![Instalación de la bomba y el controlador en el sitio](../Images/Proyectos/003.jpg)

Además, el controlador incorpora un arranque suave (Soft Start). Mover instantáneamente una columna de agua de cientos de metros genera el fenómeno del golpe de ariete, que provocaría enormes sobrepresiones. Para evitarlo, el controlador acelera lentamente el motor para que la columna se desplace de forma gradual. También cuenta con protección contra trabajo en seco para detener el motor si el nivel del arroyo disminuye, y una entrada híbrida por si en una emergencia extrema se requiere conectar un generador de corriente alterna.

---

## Cosechando la Energía del Sol e Infraestructura

Subir el agua requiere una cantidad considerable de energía, por lo que el sistema se acompaña de un arreglo fotovoltaico de 5 paneles solares monocristalinos PERC de 590 Watts cada uno, sumando 2.95 kW de potencia instalada. Los paneles fueron conectados en serie para aumentar el voltaje del sistema y disminuir las pérdidas eléctricas provocadas por la distancia hasta el controlador.

Para soportar los paneles se requirió obra civil. Se realizaron excavaciones profundas hasta localizar terreno firme, se construyeron dados de concreto armado utilizando varilla corrugada y se instaló una estructura galvanizada diseñada para soportar el viento, la lluvia y la humedad permanente del bosque.

![Estructura de concreto y montaje de los paneles solares](../Images/Proyectos/004.jpg)

El tendido hidráulico requirió instalar aproximadamente 300 metros de tubería HDPE atravesando pendientes, piedras y raíces. Cada tramo tuvo que colocarse cuidadosamente y fijarse en varios puntos para impedir que las contracciones del material o los golpes de ariete mecánicos modificaran su posición.

Una vez que el agua llega a la cima se almacena en el tinaco principal, funcionando como una batería de agua. A partir de ese momento vuelve a entrar en acción la gravedad: gracias a un desnivel de cinco metros entre el tinaco y la cabaña, el agua fluye naturalmente hacia la cocina, baño y sistemas de riego sin necesidad de usar bombas adicionales. El sistema trabaja en un ciclo automático diario: sale el sol, el controlador arranca suavemente, la bomba vence los 150 metros de desnivel y la cabaña dispone de agua limpia todos los días de forma autosuficiente.
