const coeficientes = [[10, -1, 2], [-1, 11, -1], [2, -1, 10]]

export const ejemploFactorizacion = {
  celdas: coeficientes.map(fila => fila.map(valor => String(Math.abs(valor)))),
  signos: coeficientes.map(fila => fila.map<number>(valor => valor < 0 ? -1 : 1)),
  vector: ['6', '22', '-10'],
}
