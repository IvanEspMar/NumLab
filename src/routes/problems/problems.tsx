
import { useNavigate } from 'react-router'
import grafica from '../../assets/nolineal.svg'
import sistemas from '../../assets/sistemas.jpg'
import './problems.scss'

type Problema = {
  numero: string
  categoria: string
  titulo: string
  imagen?: string
  textoAlternativo?: string
  formula?: string
  descripcion: string
  pie: string
  ruta: string
}

const problemas: Problema[] = [
  {
    numero: '02',
    categoria: 'ECUACIONES NO LINEALES',
    titulo: 'Solución numérica de ecuaciones algebraicas de una variable',
    imagen: grafica,
    textoAlternativo: 'Gráfica de una función matemática',
    descripcion: 'Unidad 2 · Bisección, Newton y Secante.',
    pie: 'BÚSQUEDA DE RAÍCES',
    ruta: '/nolineal'
  },
  {
    numero: '03–04',
    categoria: 'SISTEMAS DE ECUACIONES LINEALES',
    titulo: 'Resolver sistemas de ecuaciones lineales',
    imagen: sistemas,
    textoAlternativo: 'Representación de sistemas de ecuaciones',
    descripcion:
      'Unidad 3 · Gauss-Jordan, Gauss-Seidel y Jacobi. Unidad 4 · Factorización de Doolittle y Crout.',
    pie: 'SISTEMAS Y FACTORIZACIÓN',
    ruta: '/lineal'
  },
  {
    numero: '05',
    categoria: 'VALORES PROPIOS',
    titulo: 'Cálculo de valores propios',
    formula: 'Av = λv',
    descripcion: 'Unidad 5 · Métodos de la Potencia y Potencia Inversa.',
    pie: 'VALORES Y VECTORES',
    ruta: '/valores'
  }
]

function IconoEnlace() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function TarjetaProblema({ problema }: { problema: Problema }) {
  const navegar = useNavigate()

  return (
    <article
      className="tarjeta-problema"
      onClick={() => navegar(problema.ruta)}
    >
      <header className="tarjeta-encabezado">
        <span className="tarjeta-numero">{problema.numero}</span>
        <span className="tarjeta-categoria">{problema.categoria}</span>
      </header>

      <h3 className="tarjeta-titulo">{problema.titulo}</h3>

      <div className="tarjeta-visual">
        {problema.imagen && (
          <img
            src={problema.imagen}
            alt={problema.textoAlternativo ?? ''}
          />
        )}

        {problema.formula && (
          <span className="tarjeta-formula">{problema.formula}</span>
        )}
      </div>

      <p className="tarjeta-descripcion">{problema.descripcion}</p>

      <footer className="tarjeta-pie">
        <span className="tarjeta-pie-texto">{problema.pie}</span>
        <IconoEnlace />
      </footer>
    </article>
  )
}

function Areas() {
  return (
    <section className="seccion-problemas">

      <header className="encabezado-seccion">
        <h2 className="titulo-seccion">
          TIPOS DE PROBLEMAS Y MÉTODOS NUMÉRICOS
          <span className="punto">.</span>
        </h2>

        <span className="contador-temas">01 — 03</span>
      </header>

      <div className="introduccion-unidad">
        <span className="introduccion-etiqueta">
          Introducción
        </span>

        <p className="introduccion-texto">
          Los métodos numéricos permiten abordar distintos problemas matemáticos mediante procedimientos que generan soluciones aproximadas. Su aplicación comprende la búsqueda de raíces de ecuaciones, la resolución de sistemas lineales y el cálculo de valores propios. Cada problema requiere métodos específicos que, mediante procesos algebraicos e iterativos, permiten obtener resultados con una precisión determinada.
        </p>
      </div>

      <div className="cuadricula-problemas">
        {problemas.map((problema) => (
          <TarjetaProblema
            key={problema.numero}
            problema={problema}
          />
        ))}
      </div>

    </section>
  )
}

export default Areas
