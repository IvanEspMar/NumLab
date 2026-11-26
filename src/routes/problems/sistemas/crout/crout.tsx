import { CeldaMatriz, EditorMatriz } from '@/components/editor-matriz/editor-matriz'
import { parseDecimal } from '@/functions/parse-decimal'

import { useState } from 'react'
import { adelante, atras, type Matriz } from './lu'
import { ejemploFactorizacion } from '../ejemplo-factorizacion'
import { PanelFactorizacion, ResultadoFactorizacion, type ResultadoLU } from '../panel-factorizacion'

const TAM_MIN = 3
const TAM_MAX = 10
function crearGrid(n: number): string[][] {
  return Array.from({ length: n }, () => Array(n).fill(''))
}

function crearSignos(n: number): number[][] {
  return Array.from({ length: n }, () => Array(n).fill(1))
}

function esNumero(c: string): boolean {
  return c.trim() !== '' && Number.isFinite(parseDecimal(c))
}

function crout(A: Matriz): { L: Matriz; U: Matriz } {
  const n = A.length

  const L: Matriz = Array.from(
    { length: n },
    () => Array(n).fill(0)
  )

  const U: Matriz = Array.from(
    { length: n },
    () => Array(n).fill(0)
  )

  for (let i = 0; i < n; i++) {
    U[i][i] = 1
  }

  for (let j = 0; j < n; j++) {

    for (let i = j; i < n; i++) {
      let suma = 0

      for (let k = 0; k < j; k++) {
        suma += L[i][k] * U[k][j]
      }

      L[i][j] = A[i][j] - suma
    }

    if (Math.abs(L[j][j]) < 1e-12) {
      throw new Error(
        `No se puede continuar: el pivote L[${j + 1}][${j + 1}] es cero.`
      )
    }

    for (let i = j + 1; i < n; i++) {
      let suma = 0

      for (let k = 0; k < j; k++) {
        suma += L[j][k] * U[k][i]
      }

      U[j][i] = (A[j][i] - suma) / L[j][j]
    }
  }

  return { L, U }
}

function Crout() {
  const [n, setN] = useState(ejemploFactorizacion.celdas.length)
  const [celdas, setCeldas] = useState(ejemploFactorizacion.celdas)
  const [signos, setSignos] = useState(ejemploFactorizacion.signos)
  const [b, setB] = useState(ejemploFactorizacion.vector)
  const [resultado, setResultado] = useState<ResultadoLU | null>(null)
  const [error, setError] = useState('')

  function limpiarResultado() {
    setResultado(null)
    setError('')
  }

  function cargarEjemplo() {
    setN(ejemploFactorizacion.celdas.length)
    setCeldas(ejemploFactorizacion.celdas)
    setSignos(ejemploFactorizacion.signos)
    setB(ejemploFactorizacion.vector)
    limpiarResultado()
  }

  function limpiarMatriz() {
    setCeldas(crearGrid(n))
    setSignos(crearSignos(n))
    setB(Array(n).fill(''))
    limpiarResultado()
  }

  function cambiarTamano(nuevo: number) {
    if (nuevo < TAM_MIN || nuevo > TAM_MAX) return

    setCeldas(
      Array.from({ length: nuevo }, (_, i) =>
        Array.from(
          { length: nuevo },
          (_, j) => celdas[i]?.[j] ?? ''
        )
      )
    )

    setSignos(
      Array.from({ length: nuevo }, (_, i) =>
        Array.from(
          { length: nuevo },
          (_, j) => signos[i]?.[j] ?? 1
        )
      )
    )

    setB(
      Array.from(
        { length: nuevo },
        (_, i) => b[i] ?? ''
      )
    )

    setN(nuevo)
    limpiarResultado()
  }

  function cambiarCelda(
    i: number,
    j: number,
    valor: string
  ) {
    setCeldas(
      celdas.map((fila, fi) =>
        fila.map((celda, cj) =>
          fi === i && cj === j ? valor : celda
        )
      )
    )

    limpiarResultado()
  }

  function alternarSigno(i: number, j: number) {
    setSignos(
      signos.map((fila, fi) =>
        fila.map((s, cj) =>
          fi === i && cj === j ? -s : s
        )
      )
    )

    limpiarResultado()
  }

  function cambiarB(i: number, valor: string) {
    setB(
      b.map((v, bi) =>
        bi === i ? valor : v
      )
    )

    limpiarResultado()
  }

  const todoValido =
    celdas.every(fila => fila.every(esNumero)) &&
    b.every(esNumero)

  function calcular() {
    try {
      const A: Matriz = celdas.map((fila, i) =>
        fila.map((c, j) => signos[i][j] * parseDecimal(c))
      )

      const { L, U } = crout(A)

      const y = adelante(L, b.map(parseDecimal))
      const x = atras(U, y)

      setResultado({ L, U, y, x })
      setError('')
    } catch (e) {
      setResultado(null)

      setError(
        e instanceof Error
          ? e.message
          : 'Error desconocido'
      )
    }
  }

  return (
    <PanelFactorizacion
      metodo="Crout"
      tamano={n}
      minimo={TAM_MIN}
      maximo={TAM_MAX}
      puedeCalcular={todoValido}
      onCambiarTamano={cambiarTamano}
      onCargarEjemplo={cargarEjemplo}
      onLimpiar={limpiarMatriz}
      onCalcular={calcular}
      error={error}
      editor={
        <EditorMatriz
          size={n}
          renderCell={(row, column) => (
            <CeldaMatriz
              label={`Coeficiente: fila ${row + 1}, columna ${column + 1}`}
              value={celdas[row][column]}
              negative={signos[row][column] < 0}
              onValueChange={(value) => cambiarCelda(row, column, value)}
              onToggleSign={() => alternarSigno(row, column)}
            />
          )}
          renderVector={(row) => (
            <CeldaMatriz
              label={`Término independiente ${row + 1}`}
              value={b[row]}
              onValueChange={(value) => cambiarB(row, value)}
            />
          )}
        />
      }
    >
      {resultado && <ResultadoFactorizacion {...resultado} />}
    </PanelFactorizacion>
  )
}

export default Crout
