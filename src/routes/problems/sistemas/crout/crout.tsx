import { CeldaMatriz, EditorMatriz } from '@/components/editor-matriz/editor-matriz'
import { parseDecimal } from '@/functions/parse-decimal'

import { useState } from 'react'
import { resolverCrout } from './lu'
import { PanelFactorizacion, ResultadoFactorizacion, type ResultadoLU } from '../compartido/panel-factorizacion'

const TAM_MIN = 3
const TAM_MAX = 10
const ejemploCrout = {
  celdas: [['2', '4', '2'], ['4', '10', '6'], ['2', '6', '9']],
  signos: crearSignos(3),
  vector: ['16', '38', '41'],
}

function crearGrid(n: number): string[][] {
  return Array.from({ length: n }, () => Array(n).fill(''))
}

function crearSignos(n: number): number[][] {
  return Array.from({ length: n }, () => Array(n).fill(1))
}

function esNumero(c: string): boolean {
  return c.trim() !== '' && Number.isFinite(parseDecimal(c))
}

function Crout() {
  const [n, setN] = useState(ejemploCrout.celdas.length)
  const [celdas, setCeldas] = useState(ejemploCrout.celdas)
  const [signos, setSignos] = useState(ejemploCrout.signos)
  const [b, setB] = useState(ejemploCrout.vector)
  const [resultado, setResultado] = useState<ResultadoLU | null>(null)
  const [error, setError] = useState('')

  function limpiarResultado() {
    setResultado(null)
    setError('')
  }

  function cargarEjemplo() {
    setN(ejemploCrout.celdas.length)
    setCeldas(ejemploCrout.celdas)
    setSignos(ejemploCrout.signos)
    setB(ejemploCrout.vector)
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
      const A = celdas.map((fila, i) =>
        fila.map((c, j) => signos[i][j] * parseDecimal(c))
      )

      setResultado(resolverCrout(A, b.map(parseDecimal)))
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
