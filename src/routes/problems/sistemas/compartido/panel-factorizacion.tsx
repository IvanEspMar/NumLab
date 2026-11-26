import type { ReactNode } from 'react'
import { MathJax } from 'better-react-mathjax'
import { EncabezadoCalculadora } from "@/components/encabezado-calculadora/encabezado-calculadora";
import './panel-factorizacion.scss'

interface PanelFactorizacionProps {
  metodo: 'Doolittle' | 'Crout'
  tamano: number
  minimo: number
  maximo: number
  puedeCalcular: boolean
  onCambiarTamano: (tamano: number) => void
  onCargarEjemplo: () => void
  onLimpiar: () => void
  onCalcular: () => void
  editor: ReactNode
  error: string
  children: ReactNode
}

export function PanelFactorizacion({
  metodo, tamano, minimo, maximo, puedeCalcular, onCambiarTamano,
  onCargarEjemplo, onLimpiar, onCalcular, editor, error, children,
}: PanelFactorizacionProps) {
  return (
    <section className="factorizacion">
      <EncabezadoCalculadora titulo={`Método de ${metodo}`} introduccion={`/lineal/${metodo.toLowerCase()}`} />

      <section className="factorizacion__panel">
        <div className="factorizacion__controles">
          <h2>Sistema de ecuaciones</h2>
          <div className="factorizacion__tamano" role="group" aria-label="Tamaño del sistema">
            <button type="button" aria-label="Disminuir tamaño" disabled={tamano <= minimo} onClick={() => onCambiarTamano(tamano - 1)}>−</button>
            <span>{tamano} × {tamano}</span>
            <button type="button" aria-label="Aumentar tamaño" disabled={tamano >= maximo} onClick={() => onCambiarTamano(tamano + 1)}>+</button>
          </div>
        </div>
        <p className="factorizacion__ayuda">Alterna el signo con ±. Escribe 0 en los términos ausentes.</p>
        {editor}
        <div className="factorizacion__acciones">
          <button type="button" onClick={onCargarEjemplo}>Cargar ejemplo</button>
          <button type="button" onClick={onLimpiar}>Limpiar</button>
          <button className="factorizacion__calcular" type="button" disabled={!puedeCalcular} onClick={onCalcular}>Calcular</button>
        </div>
        {!puedeCalcular && <p className="factorizacion__ayuda" role="status">Completa todas las celdas con números válidos para calcular.</p>}
        {error && <p className="factorizacion__error" role="alert">{error}</p>}
      </section>
      {children}
    </section>
  )
}

export interface ResultadoLU {
  L: number[][]
  U: number[][]
  y: number[]
  x: number[]
  verificacion?: {
    intercambios: [number, number][]
    bPermutado: number[]
    errorLU: number
    errorSolucion: number
  }
}

function redondear(valor: number) {
  const redondeado = Number(valor.toFixed(6))
  return redondeado === 0 && valor !== 0 ? valor.toExponential(5) : redondeado
}

export function ResultadoFactorizacion({ L, U, y, x, verificacion }: ResultadoLU) {
  const huboIntercambios = Boolean(verificacion?.intercambios.length)
  const ladoDerecho = huboIntercambios ? 'Pb' : 'b'
  const matrizComparada = huboIntercambios ? 'PA' : 'A'
  return (
    <>
      <section className="factorizacion__solucion" aria-label="Solución del sistema">
        <h2>Solución del sistema</h2>
        <dl>
          {x.map((valor, indice) => (
            <div key={indice}>
              <dt><MathJax inline>{String.raw`\(x_{${indice + 1}}\)`}</MathJax></dt>
              <dd>{redondear(valor)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <h2>Factorización y sustitución</h2>
      <div className="factorizacion__resultados">
        {[{ nombre: 'L', matriz: L }, { nombre: 'U', matriz: U }].map(({ nombre, matriz }) => (
          <div key={nombre}>
            <h3>Matriz <MathJax inline>{String.raw`\(${nombre}\)`}</MathJax></h3>
            <table aria-label={`Matriz ${nombre}`}>
              <tbody>
                {matriz.map((fila, i) => (
                  <tr key={i}>{fila.map((valor, j) => <td key={j}>{redondear(valor)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <div>
          <h3>Vector intermedio <MathJax inline>{String.raw`\(y\) en \(Ly=${ladoDerecho}\)`}</MathJax></h3>
          <table aria-label="Vector intermedio y">
            <tbody>
              {y.map((valor, indice) => (
                <tr key={indice}>
                  <th scope="row"><MathJax inline>{String.raw`\(y_{${indice + 1}}\)`}</MathJax></th>
                  <td>{redondear(valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {verificacion && (
          <div>
            <h3>Comprobaciones</h3>
            {huboIntercambios && (
              <>
                <p>Intercambios de filas en orden de aplicación</p>
                <ol>
                  {verificacion.intercambios.map(([origen, destino]) => (
                    <li key={origen}>Fila {origen} ↔ fila {destino}</li>
                  ))}
                </ol>
                <p>Vector <MathJax inline>{String.raw`\(Pb\)`}</MathJax> = [{verificacion.bPermutado.join(', ')}]</p>
              </>
            )}
            <p><MathJax inline>{String.raw`\(LU\approx ${matrizComparada}\)`}</MathJax> con residuo máximo absoluto {verificacion.errorLU.toExponential(5)}.</p>
            <p><MathJax inline>{String.raw`\(Ax\approx b\)`}</MathJax> con residuo máximo absoluto {verificacion.errorSolucion.toExponential(5)}.</p>
          </div>
        )}
      </div>
    </>
  )
}
