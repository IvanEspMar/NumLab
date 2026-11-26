import { CeldaMatriz, EditorMatriz } from '@/components/editor-matriz/editor-matriz'
import { parseDecimal } from '@/functions/parse-decimal'

import { useState } from 'react'
import { adelante, atras, type Matriz } from './lu'
import './crout.scss'

const TAM_MIN = 3
const TAM_MAX = 10
const DECIMALES = 6

type Resultado = {
  L: Matriz
  U: Matriz
  y: number[]
  x: number[]
}

function crearGrid(n: number): string[][] {
  return Array.from({ length: n }, () => Array(n).fill(''))
}

function crearSignos(n: number): number[][] {
  return Array.from({ length: n }, () => Array(n).fill(1))
}

function redondear(v: number): number {
  return Number(v.toFixed(DECIMALES))
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

function VistaMatriz({
  titulo,
  M
}: {
  titulo: string
  M: Matriz
}) {
  return (
    <div>
      <h3>{titulo}</h3>
      <table>
        <tbody>
          {M.map((fila, i) => (
            <tr key={i}>
              {fila.map((valor, j) => (
                <td key={j}>{redondear(valor)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function VistaVector({
  titulo,
  v,
  nombre
}: {
  titulo: string
  v: number[]
  nombre: string
}) {
  return (
    <div>
      <h3>{titulo}</h3>
      <table>
        <tbody>
          {v.map((valor, i) => (
            <tr key={i}>
              <td>{nombre}{i + 1}</td>
              <td>{redondear(valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Crout() {
  const [n, setN] = useState(TAM_MIN)
  const [celdas, setCeldas] = useState<string[][]>(
    crearGrid(TAM_MIN)
  )
  const [signos, setSignos] = useState<number[][]>(
    crearSignos(TAM_MIN)
  )
  const [b, setB] = useState<string[]>(
    Array(TAM_MIN).fill('')
  )
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [error, setError] = useState('')

  function limpiar() {
    setResultado(null)
    setError('')
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
    limpiar()
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

    limpiar()
  }

  function alternarSigno(i: number, j: number) {
    setSignos(
      signos.map((fila, fi) =>
        fila.map((s, cj) =>
          fi === i && cj === j ? -s : s
        )
      )
    )

    limpiar()
  }

  function cambiarB(i: number, valor: string) {
    setB(
      b.map((v, bi) =>
        bi === i ? valor : v
      )
    )

    limpiar()
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
    <section className="seccion-crout">
      <h1>MÉTODO DE CROUT</h1>

      <div className="tamano-crout">
        <span>Tamaño del sistema</span>

        <button
          onClick={() => cambiarTamano(n - 1)}
          disabled={n <= TAM_MIN}
        >
          −
        </button>

        <strong>{n} × {n}</strong>

        <button
          onClick={() => cambiarTamano(n + 1)}
          disabled={n >= TAM_MAX}
        >
          +
        </button>
      </div>

      <p className="ayuda-crout">
        Edita los valores y usa ± para alternar el signo. Escribe 0 para los términos que no aparecen en la ecuación.
      </p>

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

      <button
        className="boton-calcular"
        disabled={!todoValido}
        onClick={calcular}
      >
        Calcular
      </button>

      {!todoValido && (
        <p className="ayuda-crout">
          Llena todas las casillas para poder calcular.
        </p>
      )}

      {error && (
        <p className="error-crout">{error}</p>
      )}

      {resultado && (
        <>
          <h2>Resultado</h2>

          <div className="resultado-crout">
            <VistaMatriz
              titulo="L"
              M={resultado.L}
            />

            <VistaMatriz
              titulo="U"
              M={resultado.U}
            />

            <VistaVector
              titulo="y (L·y = b)"
              v={resultado.y}
              nombre="y"
            />

            <VistaVector
              titulo="x (U·x = y)"
              v={resultado.x}
              nombre="x"
            />
          </div>
        </>
      )}
    </section>
  )
}

export default Crout
