# Research Decisions

> **HISTORICO - SUPERSEDIDO.** Estas decisiones explican la prueba dual anterior y no gobiernan el producto actual. Consulte la [investigacion vigente](../002-ss-casolab-academy/research.md).

## RD-001: Usar el mismo precio de preventa

**Decision**: 49 € para SS CasoLab y GSI Caso 0 durante la primera comparación.

**Rationale**: Un embudo que compara pago con lead no permite atribuir la diferencia al mercado. El precio de 49 € está dentro de los intervalos de validación de ambos informes internos.

**Alternative rejected**: Mantener GSI a 290 €. Mezclaría cambio de mercado, producto, alcance y precio.

## RD-002: Un sitio, dos rutas

**Decision**: Reutilizar el despliegue y D1 actuales.

**Rationale**: Reduce coste, tiempo y mantenimiento, conservando atribución por experimento.

**Alternative rejected**: Crear dos proyectos y dos bases antes de validar. Añade operación sin mejorar la señal comercial.

## RD-003: Diagnóstico antes del curso

**Decision**: Producir una muestra autocorregible y el alcance de preventa; no el curso completo.

**Rationale**: Es la menor cantidad de contenido que demuestra método y permite pedir un pago.

## RD-004: Pago alojado externamente

**Decision**: Usar enlaces de checkout configurables.

**Rationale**: Evita custodiar tarjetas y construir una pasarela. La cuenta y los enlaces son la única dependencia que debe aportar el propietario.

## RD-005: Analítica propia mínima

**Decision**: Guardar eventos acotados en D1 sin IP ni texto libre.

**Rationale**: Permite comparar los embudos sin incorporar una plataforma analítica adicional ni ampliar innecesariamente los datos tratados.
