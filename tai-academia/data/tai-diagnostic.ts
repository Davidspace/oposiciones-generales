export const TAI_BOE_URL = "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26262";

export type TaiQuestion = {
  id: string;
  part: "general" | "development" | "systems";
  area: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

export const generalQuestions: TaiQuestion[] = [
  {
    id: "g-constitution",
    part: "general",
    area: "Organización del Estado",
    prompt: "Según el artículo 1.1 de la Constitución, ¿cuál es un valor superior del ordenamiento jurídico español?",
    options: ["La coordinación", "La libertad", "La eficacia", "La descentralización"],
    correctIndex: 1,
    explanation: "El artículo 1.1 cita libertad, justicia, igualdad y pluralismo político. La pregunta comprueba lectura normativa, no memoria de términos administrativos parecidos.",
  },
  {
    id: "g-row",
    part: "general",
    area: "Bases de datos",
    prompt: "En una tabla de una base de datos relacional, ¿qué representa normalmente una fila?",
    options: ["Un registro", "Un índice", "Una relación entre tablas", "Un tipo de dato"],
    correctIndex: 0,
    explanation: "Una fila reúne los valores de un registro. Las columnas describen sus atributos y un índice es una estructura auxiliar de acceso.",
  },
  {
    id: "g-dhcp",
    part: "general",
    area: "Redes",
    prompt: "Un equipo se conecta a una red y obtiene automáticamente dirección IP, máscara y puerta de enlace. ¿Qué protocolo lo permite?",
    options: ["DNS", "DHCP", "SNMP", "SMTP"],
    correctIndex: 1,
    explanation: "DHCP entrega parámetros de configuración IP a los clientes. DNS resuelve nombres y SMTP transporta correo.",
  },
  {
    id: "g-kernel",
    part: "general",
    area: "Sistemas operativos",
    prompt: "¿Qué componente del sistema operativo administra procesos, memoria y acceso básico a dispositivos?",
    options: ["El intérprete de comandos", "El hipervisor", "El núcleo o kernel", "El compilador"],
    correctIndex: 2,
    explanation: "El kernel gestiona los recursos esenciales del sistema y media entre el software y el hardware.",
  },
  {
    id: "g-sql",
    part: "general",
    area: "SQL",
    prompt: "¿Qué operación SQL permite combinar filas de dos tablas usando una condición relacionada?",
    options: ["JOIN", "GROUP BY", "TRUNCATE", "COMMIT"],
    correctIndex: 0,
    explanation: "JOIN combina filas de tablas relacionadas. GROUP BY agrupa resultados y COMMIT confirma una transacción.",
  },
  {
    id: "g-tls",
    part: "general",
    area: "Seguridad",
    prompt: "¿Qué aporta TLS a una comunicación HTTPS correctamente configurada?",
    options: ["Compresión obligatoria", "Cifrado e integridad en tránsito", "Anonimato del servidor", "Eliminación de toda vulnerabilidad web"],
    correctIndex: 1,
    explanation: "TLS protege la confidencialidad e integridad de los datos en tránsito y autentica al servidor mediante certificados; no elimina vulnerabilidades de la aplicación.",
  },
  {
    id: "g-loop",
    part: "general",
    area: "Programación",
    prompt: "¿Qué estructura de control repite un bloque mientras se mantiene una condición?",
    options: ["Una constante", "Una bifurcación", "Un bucle", "Una excepción"],
    correctIndex: 2,
    explanation: "Un bucle ejecuta repetidamente un bloque mientras se cumpla la condición o durante un número definido de iteraciones.",
  },
  {
    id: "g-least-privilege",
    part: "general",
    area: "Seguridad",
    prompt: "¿Qué principio recomienda conceder a cada cuenta únicamente los permisos necesarios para su función?",
    options: ["Defensa en profundidad", "Mínimo privilegio", "Alta disponibilidad", "Tolerancia a fallos"],
    correctIndex: 1,
    explanation: "El principio de mínimo privilegio reduce la superficie de daño al limitar permisos a los estrictamente necesarios.",
  },
];

export const developmentQuestions: TaiQuestion[] = [
  {
    id: "d-parameterized",
    part: "development",
    area: "Desarrollo seguro",
    prompt: "Una aplicación concatena directamente en SQL el texto recibido de un formulario. ¿Qué cambio reduce de forma más directa el riesgo de inyección SQL?",
    options: ["Ocultar el formulario", "Usar consultas parametrizadas", "Comprimir la respuesta", "Cambiar el nombre de la tabla"],
    correctIndex: 1,
    explanation: "Las consultas parametrizadas separan datos y código SQL. Validar entradas ayuda, pero no sustituye la parametrización.",
  },
  {
    id: "d-normalization",
    part: "development",
    area: "Modelado de datos",
    prompt: "La dirección de un departamento se repite en cientos de registros de empleados y genera inconsistencias. ¿Qué medida es la más adecuada?",
    options: ["Duplicar también el teléfono", "Separar Departamento y referenciarlo mediante una clave", "Crear una vista por empleado", "Guardar todo en un campo de texto"],
    correctIndex: 1,
    explanation: "Separar la entidad Departamento evita redundancia y anomalías de actualización, manteniendo la relación mediante una clave.",
  },
  {
    id: "d-unit-test",
    part: "development",
    area: "Pruebas",
    prompt: "Se cambia una función que calcula una penalización. ¿Qué prueba detecta con mayor precisión una regresión en esa función aislada?",
    options: ["Una prueba unitaria con casos límite", "Una prueba de carga de toda la red", "Una copia de seguridad", "Una revisión del firewall"],
    correctIndex: 0,
    explanation: "Una prueba unitaria verifica la función de forma aislada y permite cubrir valores normales, límites y errores esperados.",
  },
  {
    id: "d-http-update",
    part: "development",
    area: "Aplicaciones web",
    prompt: "En una API REST, ¿qué método es idempotente y se usa habitualmente para sustituir completamente un recurso conocido?",
    options: ["POST", "PUT", "CONNECT", "TRACE"],
    correctIndex: 1,
    explanation: "PUT se utiliza habitualmente para crear o reemplazar el recurso identificado y debe ser idempotente.",
  },
];

export const systemsQuestions: TaiQuestion[] = [
  {
    id: "s-restore",
    part: "systems",
    area: "Continuidad",
    prompt: "Una organización realiza copias diarias, pero nunca ha intentado recuperar una. ¿Qué acción aporta la evidencia más útil de que el plan funciona?",
    options: ["Aumentar el tamaño del disco", "Probar periódicamente una restauración", "Renombrar los ficheros", "Desactivar los registros"],
    correctIndex: 1,
    explanation: "Una copia no está validada hasta que la restauración se prueba y se comprueba que cumple los objetivos de recuperación.",
  },
  {
    id: "s-vpn",
    part: "systems",
    area: "Comunicaciones",
    prompt: "Personal remoto necesita acceder de forma segura a servicios internos a través de Internet. ¿Qué solución encaja mejor?",
    options: ["Una VPN autenticada", "Un servidor DHCP público", "Una red Wi-Fi abierta", "Un proxy sin cifrado"],
    correctIndex: 0,
    explanation: "Una VPN autenticada establece un canal protegido sobre una red no confiable y permite controlar el acceso remoto.",
  },
  {
    id: "s-vlan",
    part: "systems",
    area: "Redes",
    prompt: "Se quiere separar lógicamente el tráfico de usuarios y administración sobre la misma infraestructura de conmutación. ¿Qué tecnología resulta adecuada?",
    options: ["VLAN", "NAT", "RAID", "DNSSEC"],
    correctIndex: 0,
    explanation: "Las VLAN crean dominios de difusión lógicos separados en una infraestructura de switching compartida.",
  },
  {
    id: "s-logs",
    part: "systems",
    area: "Operación y seguridad",
    prompt: "Tras varios intentos fallidos de acceso administrativo, ¿qué fuente debe revisarse primero para identificar origen, hora y cuenta afectada?",
    options: ["Los registros de autenticación", "La tabla ARP de otro equipo", "El historial del navegador del usuario", "El catálogo de software"],
    correctIndex: 0,
    explanation: "Los registros de autenticación documentan intentos, marcas temporales, cuentas y, según el sistema, origen del acceso.",
  },
];
