import { useState } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import './index.scss'

function Biseccion() {
  const [mostrarTeoria, setMostrarTeoria] = useState(false)

  return (
    <section className="seccion-biseccion">

      <header className="encabezado-biseccion">
        <span className="etiqueta">
          UNIDAD 02 / MÉTODO 01
        </span>

        <h1>Método de Bisección<span>.</span></h1>

        <p>
          Aproximación numérica de raíces mediante
          la reducción sucesiva de intervalos.
        </p>
      </header>

      <main className="calculadora-biseccion">

        <div className="seccion-etiqueta">
          <span>01</span>
          <span>CALCULADORA</span>
        </div>

        <h2>Encuentra una raíz</h2>

        {/* Aquí va tu formulario y resultados */}

      </main>

      <section className="teoria-biseccion">

        <button
          className="boton-teoria"
          onClick={() => setMostrarTeoria(!mostrarTeoria)}
          aria-expanded={mostrarTeoria}
        >
          <span>
            <small>02 / DOCUMENTACIÓN</small>
            <strong>Fundamento teórico</strong>
          </span>

          <span className="icono-teoria">
            {mostrarTeoria ? '−' : '+'}
          </span>
        </button>

        {mostrarTeoria && (
          <div className="contenido-teoria">

            <h2>¿En qué consiste?</h2>

            <p>
              El método de Bisección permite aproximar
              una raíz de una función continua a partir
              de un intervalo cuyos extremos presentan
              signos opuestos.
            </p>

            <h2>Expresión matemática</h2>

            <BlockMath math="x_r=\\frac{a+b}{2}" />

            <h2>Procedimiento</h2>

            <ol>
              <li>Establecer un intervalo inicial.</li>
              <li>Calcular el punto medio.</li>
              <li>Evaluar la función en el punto medio.</li>
              <li>Seleccionar el nuevo intervalo.</li>
              <li>Repetir hasta alcanzar la tolerancia.</li>
            </ol>

          </div>
        )}

      </section>

    </section>
  )
}

export default Biseccion