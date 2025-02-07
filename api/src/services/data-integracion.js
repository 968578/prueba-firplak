const dataOp = [
  {
    id: 1,
    op: "USVT56",
    tipo: "Mueble",
    cantidad: 23,
    descripcion: "Mueble lavamanos color chantilli",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Listo" },
      { id: 2, operacion: "ENSAMBLAR", estado: "Listo" },
      { id: 3, operacion: "ENSAMBLAR", estado: "Listo" },
      { id: 4, operacion: "COMPRAR MARMOL", estado: "Listo" }
    ]
  },
  {
    id: 2,
    op: "USVT57",
    tipo: "Baño",
    cantidad: 10,
    descripcion: "Bañera de mármol blanca",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "MONTAR BAÑERA", estado: "Pendiente" },
      { id: 4, operacion: "PINTAR DETALLES", estado: "Pendiente" }
    ]
  },
  {
    id: 3,
    op: "USVT58",
    tipo: "Ducha",
    cantidad: 15,
    descripcion: "Ducha de mármol gris",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Listo" },
      { id: 2, operacion: "MONTAR", estado: "Listo" },
      { id: 3, operacion: "PULIR", estado: "Listo" },
      { id: 4, operacion: "INSTALAR GRIFERÍA", estado: "Listo" }
    ]
  },
  {
    id: 4,
    op: "USVT59",
    tipo: "Mueble",
    cantidad: 18,
    descripcion: "Mueble zona húmeda de madera",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "ENSAMBLAR", estado: "Pendiente" },
      { id: 3, operacion: "LACAR", estado: "Pendiente" },
      { id: 4, operacion: "INSTALAR PUERTAS", estado: "Listo" }
    ]
  },
  {
    id: 5,
    op: "USVT60",
    tipo: "Lavamanos",
    cantidad: 30,
    descripcion: "Lavamanos de mármol beige",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "MONTAR", estado: "Pendiente" },
      { id: 4, operacion: "PINTAR DETALLES", estado: "Pendiente" }
    ]
  },
  {
    id: 6,
    op: "USVT61",
    tipo: "Bañera",
    cantidad: 12,
    descripcion: "Bañera cuadrada de mármol gris",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Listo" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "MONTAR BAÑERA", estado: "Listo" },
      { id: 4, operacion: "PINTAR DETALLES", estado: "Listo" }
    ]
  },
  {
    id: 7,
    op: "USVT62",
    tipo: "Mueble",
    cantidad: 25,
    descripcion: "Mueble bajo lavamanos color negro",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "ENSAMBLAR", estado: "Pendiente" },
      { id: 3, operacion: "INSTALAR GRIFERÍA", estado: "Listo" },
      { id: 4, operacion: "PINTAR", estado: "Pendiente" }
    ]
  },
  {
    id: 8,
    op: "USVT63",
    tipo: "Ducha",
    cantidad: 20,
    descripcion: "Ducha de zona húmeda de granito",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "PULIR", estado: "Pendiente" },
      { id: 3, operacion: "MONTAR", estado: "Pendiente" },
      { id: 4, operacion: "INSTALAR", estado: "Listo" }
    ]
  },
  {
    id: 9,
    op: "USVT64",
    tipo: "Baño",
    cantidad: 14,
    descripcion: "Bañera de mármol beige",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "PULIR", estado: "Pendiente" },
      { id: 3, operacion: "INSTALAR", estado: "Pendiente" },
      { id: 4, operacion: "PINTAR DETALLES", estado: "Listo" }
    ]
  },
  {
    id: 10,
    op: "USVT65",
    tipo: "Mueble",
    cantidad: 20,
    descripcion: "Mueble lavabo mármol negro",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "ENSAMBLAR", estado: "Pendiente" },
      { id: 3, operacion: "PULIR", estado: "Pendiente" },
      { id: 4, operacion: "PINTAR", estado: "Listo" }
    ]
  },
  {
    id: 11,
    op: "USVT66",
    tipo: "Lavamanos",
    cantidad: 12,
    descripcion: "Lavamanos rectangular de mármol",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Listo" },
      { id: 2, operacion: "MONTAR", estado: "Listo" },
      { id: 3, operacion: "INSTALAR", estado: "Listo" },
      { id: 4, operacion: "PINTAR", estado: "Listo" }
    ]
  },
  {
    id: 12,
    op: "USVT67",
    tipo: "Ducha",
    cantidad: 18,
    descripcion: "Ducha de mármol blanco",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Listo" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "MONTAR", estado: "Listo" },
      { id: 4, operacion: "INSTALAR", estado: "Listo" }
    ]
  },
  {
    id: 13,
    op: "USVT68",
    tipo: "Baño",
    cantidad: 9,
    descripcion: "Bañera cuadrada de mármol negro",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "MONTAR BAÑERA", estado: "Pendiente" },
      { id: 4, operacion: "INSTALAR", estado: "Pendiente" }
    ]
  },
  {
    id: 14,
    op: "USVT69",
    tipo: "Mueble",
    cantidad: 13,
    descripcion: "Mueble baño moderno",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Listo" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "ENSAMBLAR", estado: "Listo" },
      { id: 4, operacion: "PINTAR", estado: "Listo" }
    ]
  },
  {
    id: 15,
    op: "USVT70",
    tipo: "Ducha",
    cantidad: 22,
    descripcion: "Ducha de mármol rosa",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "PULIR", estado: "Pendiente" },
      { id: 3, operacion: "MONTAR", estado: "Pendiente" },
      { id: 4, operacion: "INSTALAR", estado: "Listo" }
    ]
  },
  {
    id: 16,
    op: "USVT71",
    tipo: "Baño",
    cantidad: 8,
    descripcion: "Bañera de granito negro",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Listo" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "INSTALAR", estado: "Listo" },
      { id: 4, operacion: "PINTAR DETALLES", estado: "Listo" }
    ]
  },
  {
    id: 17,
    op: "USVT72",
    tipo: "Mueble",
    cantidad: 17,
    descripcion: "Mueble de baño modular",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "ENSAMBLAR", estado: "Pendiente" },
      { id: 3, operacion: "PULIR", estado: "Pendiente" },
      { id: 4, operacion: "PINTAR", estado: "Listo" }
    ]
  },
  {
    id: 18,
    op: "USVT73",
    tipo: "Lavamanos",
    cantidad: 11,
    descripcion: "Lavamanos de mármol blanco",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "MONTAR", estado: "Pendiente" },
      { id: 3, operacion: "PULIR", estado: "Pendiente" },
      { id: 4, operacion: "INSTALAR", estado: "Listo" }
    ]
  },
  {
    id: 19,
    op: "USVT74",
    tipo: "Ducha",
    cantidad: 19,
    descripcion: "Ducha de mármol oscuro",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Listo" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "MONTAR", estado: "Listo" },
      { id: 4, operacion: "INSTALAR", estado: "Listo" }
    ]
  },
  {
    id: 20,
    op: "USVT75",
    tipo: "Baño",
    cantidad: 16,
    descripcion: "Bañera moderna de mármol",
    operaciones: [
      { id: 1, operacion: "CORTAR", estado: "Pendiente" },
      { id: 2, operacion: "PULIR", estado: "Listo" },
      { id: 3, operacion: "INSTALAR", estado: "Pendiente" },
      { id: 4, operacion: "PINTAR DETALLES", estado: "Pendiente" }
    ]
  }
];



module.exports = {
  dataOp,
}