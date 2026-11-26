type Matriz = number[][]

function finito(valor: number): number {
  if (!Number.isFinite(valor)) {
    throw new Error('El cálculo excede el rango numérico disponible.')
  }
  return valor
}

function crearMatriz(n: number): Matriz {
  return Array.from({ length: n }, () => Array<number>(n).fill(0))
}

function adelante(L: Matriz, b: number[]): number[] {
  const y = Array<number>(L.length).fill(0)
  for (let i = 0; i < L.length; i++) {
    let suma = 0
    for (let k = 0; k < i; k++) suma += L[i][k] * y[k]
    y[i] = finito((b[i] - suma) / L[i][i])
  }
  return y
}

function atras(U: Matriz, y: number[]): number[] {
  const x = Array<number>(U.length).fill(0)
  for (let i = U.length - 1; i >= 0; i--) {
    let suma = 0
    for (let k = i + 1; k < U.length; k++) suma += U[i][k] * x[k]
    x[i] = finito(y[i] - suma) // La diagonal de U es unitaria.
  }
  return x
}

export function resolverCrout(A: Matriz, b: number[]) {
  const n = A.length
  if (n === 0 || b.length !== n || A.some(fila => fila.length !== n)) {
    throw new Error('Se requiere una matriz cuadrada y un vector de la misma dimensión.')
  }
  if (!A.every(fila => fila.every(Number.isFinite)) || !b.every(Number.isFinite)) {
    throw new Error('Todos los coeficientes y términos independientes deben ser finitos.')
  }

  const L = crearMatriz(n)
  const U = crearMatriz(n)
  const orden = Array.from({ length: n }, (_, i) => i)
  const intercambios: [number, number][] = []
  // Comparar con la escala de la columna evita depender de las unidades de A.
  const tolerancia = n * Number.EPSILON

  for (let j = 0; j < n; j++) {
    for (let i = j; i < n; i++) {
      let suma = 0
      for (let k = 0; k < j; k++) suma += L[i][k] * U[k][j]
      L[i][j] = finito(A[orden[i]][j] - suma)
    }

    const escala = A.reduce((maximo, fila) => Math.max(maximo, Math.abs(fila[j])), 0)
    if (L[j][j] === 0 || Math.abs(L[j][j]) / escala <= tolerancia) {
      let pivote = j
      for (let i = j + 1; i < n; i++) {
        if (Math.abs(L[i][j]) > Math.abs(L[pivote][j])) pivote = i
      }
      const magnitud = Math.abs(L[pivote][j])
      if (magnitud === 0) {
        throw new Error(`La matriz es singular. Todos los pivotes disponibles en la columna ${j + 1} son cero.`)
      }
      if (magnitud / escala <= tolerancia) {
        throw new Error(`La matriz es numéricamente singular. El mayor pivote disponible en la columna ${j + 1} es demasiado pequeño respecto a la escala de esa columna.`)
      }

      // Intercambiar también las entradas ya calculadas de L.
      const filaL = L[j]
      L[j] = L[pivote]
      L[pivote] = filaL
      const filaOriginal = orden[j]
      orden[j] = orden[pivote]
      orden[pivote] = filaOriginal
      intercambios.push([j + 1, pivote + 1])
    }

    U[j][j] = 1
    for (let i = j + 1; i < n; i++) {
      let suma = 0
      for (let k = 0; k < j; k++) suma += L[j][k] * U[k][i]
      U[j][i] = finito((A[orden[j]][i] - suma) / L[j][j])
    }
  }

  const bPermutado = orden.map(i => b[i])
  const y = adelante(L, bPermutado)
  const x = atras(U, y)

  let errorLU = 0
  let errorSolucion = 0
  for (let i = 0; i < n; i++) {
    const ax = A[i].reduce((suma, valor, j) => suma + valor * x[j], 0)
    errorSolucion = Math.max(errorSolucion, Math.abs(finito(ax - b[i])))
    for (let j = 0; j < n; j++) {
      const lu = L[i].reduce((suma, valor, k) => suma + valor * U[k][j], 0)
      errorLU = Math.max(errorLU, Math.abs(finito(lu - A[orden[i]][j])))
    }
  }

  return { L, U, y, x, verificacion: { intercambios, bPermutado, errorLU, errorSolucion } }
}
