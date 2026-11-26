import assert from 'node:assert/strict'
import test from 'node:test'
import { resolverCrout } from './lu.ts'
import { adelante, atras, doli } from '../doolittle/lu.ts'

const A = [[2, 4, 2], [4, 10, 6], [2, 6, 9]]

function multiplicarVector(matriz, vector) {
  return matriz.map(fila => fila.reduce((suma, valor, j) => suma + valor * vector[j], 0))
}

function compararVectores(actual, esperado) {
  assert.equal(actual.length, esperado.length)
  actual.forEach((valor, i) => {
    assert.ok(Math.abs(valor - esperado[i]) <= 1e-12, `${valor} ≈ ${esperado[i]}`)
  })
}

function comprobarCrout(A, b, resultado, orden) {
  const { L, U, y, x, verificacion } = resultado
  for (let i = 0; i < A.length; i++) {
    assert.equal(U[i][i], 1)
    assert.ok(L[i].slice(i + 1).every(valor => valor === 0))
    assert.ok(U[i].slice(0, i).every(valor => valor === 0))
    const filaLU = U[i].map((_, j) =>
      L[i].reduce((suma, valor, k) => suma + valor * U[k][j], 0),
    )
    compararVectores(filaLU, A[orden[i]])
  }
  assert.deepEqual(verificacion.bPermutado, orden.map(i => b[i]))
  compararVectores(multiplicarVector(L, y), verificacion.bPermutado)
  compararVectores(multiplicarVector(U, x), y)
  compararVectores(multiplicarVector(A, x), b)
  assert.ok(verificacion.errorLU <= 1e-12)
  assert.ok(verificacion.errorSolucion <= 1e-12)
}

test('Crout produce los factores del ejercicio y resuelve ambos vectores independientes', () => {
  const b = [16, 38, 41]
  const resultado = resolverCrout(A, b)
  assert.deepEqual(resultado.L, [[2, 0, 0], [4, 2, 0], [2, 2, 5]])
  assert.deepEqual(resultado.U, [[1, 2, 1], [0, 1, 1], [0, 0, 1]])
  assert.deepEqual(resultado.verificacion.intercambios, [])
  compararVectores(resultado.y, [8, 3, 3.8])
  compararVectores(resultado.x, [5.8, -0.8, 3.8])
  comprobarCrout(A, b, resultado, [0, 1, 2])

  const bAlternativo = [16, 38, 37]
  const alternativo = resolverCrout(A, bAlternativo)
  assert.deepEqual(alternativo.y, [8, 3, 3])
  assert.deepEqual(alternativo.x, [5, 0, 3])
  comprobarCrout(A, bAlternativo, alternativo, [0, 1, 2])
})

test('Crout recupera un pivote nulo o pequeño intercambiando filas', () => {
  for (const pivote of [0, Number.EPSILON / 4]) {
    const matriz = [[pivote, 2], [3, 4]]
    const b = [4, 11]
    const resultado = resolverCrout(matriz, b)
    assert.deepEqual(resultado.verificacion.intercambios, [[1, 2]])
    compararVectores(resultado.x, [1, 2])
    comprobarCrout(matriz, b, resultado, [1, 0])
  }
})

test('Crout conserva las columnas previas de L cuando intercambia filas en un paso posterior', () => {
  const matriz = [[2, 4, 2], [4, 8, 6], [2, 6, 9]]
  const b = [0, 6, 17]
  const resultado = resolverCrout(matriz, b)
  assert.deepEqual(resultado.verificacion.intercambios, [[2, 3]])
  compararVectores(resultado.x, [1, -2, 3])
  comprobarCrout(matriz, b, resultado, [0, 2, 1])
})

test('Crout identifica matrices singulares y numéricamente singulares', () => {
  assert.throws(() => resolverCrout([[0, 1], [0, 2]], [1, 2]), /es singular/)
  assert.throws(() => resolverCrout([[1, 2], [2, 4]], [1, 2]), /es singular/)
  assert.throws(
    () => resolverCrout([[1, 1], [1, 1 + Number.EPSILON]], [1, 2]),
    /numéricamente singular/,
  )
})

test('Crout resuelve sistemas de una incógnita y de dimensión máxima en la calculadora', () => {
  const pequeno = resolverCrout([[1e-200]], [3e-200])
  compararVectores(pequeno.x, [3])
  comprobarCrout([[1e-200]], [3e-200], pequeno, [0])

  const matriz = Array.from({ length: 10 }, (_, i) =>
    Array.from({ length: 10 }, (_, j) => i === j ? 12 : (i + j) % 3 - 1),
  )
  const x = matriz.map((_, i) => i - 4)
  const b = multiplicarVector(matriz, x)
  const resultado = resolverCrout(matriz, b)
  compararVectores(resultado.x, x)
  comprobarCrout(matriz, b, resultado, matriz.map((_, i) => i))
})

test('Crout rechaza entradas inválidas y operaciones fuera del rango finito', () => {
  assert.throws(() => resolverCrout([[1, 2]], [1]), /dimensión/)
  assert.throws(() => resolverCrout([[NaN]], [1]), /finitos/)
  assert.throws(() => resolverCrout([[1]], [Infinity]), /finitos/)
  assert.throws(() => resolverCrout([[1e-308]], [10]), /rango numérico/)
})

test('Doolittle conserva la diagonal unitaria de L y resuelve el sistema', () => {
  const { L, U } = doli(A)
  assert.deepEqual(L, [[1, 0, 0], [2, 1, 0], [1, 1, 1]])
  assert.deepEqual(U, [[2, 4, 2], [0, 2, 2], [0, 0, 5]])
  const b = [16, 38, 41]
  const x = atras(U, adelante(L, b))
  compararVectores(x, [5.8, -0.8, 3.8])
  compararVectores(multiplicarVector(A, x), b)
})
