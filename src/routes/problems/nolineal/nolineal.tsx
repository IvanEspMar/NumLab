
import { useNavigate } from 'react-router'
import bisec from '../../../assets/biseccion.svg'
import secan from '../../../assets/secante.svg'
import newton from '../../../assets/newton.svg'
import './nolineal.scss'

type Metodo = {
  numero: string
  categoria: string
  titulo: string
  imagen: string
  descripcion: string
  pie: string
  enlace: string
}

const metodos: Metodo[] = [
  {
    numero: '01',
    categoria: 'MÉTODO CERRADO',
    titulo: 'Método de Bisección',
    imagen: bisec,
    descripcion: 'Encuentra raíces dividiendo repetidamente un intervalo en dos partes iguales.',
    pie: 'CONVERGENCIA GARANTIZADA*',
    enlace: '/nolineal/biseccion'
  },
  {
    numero: '02',
    categoria: 'MÉTODO ABIERTO',
    titulo: 'Método de Newton-Raphson',
    imagen: newton,
    descripcion: 'Utiliza la recta tangente de una función para aproximar sus raíces.',
    pie: 'CONVERGENCIA CUADRÁTICA*',
    enlace: '/nolineal/newton'
  },
  {
    numero: '03',
    categoria: 'MÉTODO ABIERTO',
    titulo: 'Método de la Secante',
    imagen: secan,
    descripcion: 'Aproxima raíces mediante rectas secantes utilizando dos valores iniciales.',
    pie: 'SIN DERIVADAS',
    enlace: '/nolineal/secante'
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

function TarjetaMetodo({ metodo }: { metodo: Metodo }) {
  const navigate = useNavigate()

  return (
    <article onClick={() => navigate(metodo.enlace)} className="tarjeta-metodo">

      <div className="tarjeta-encabezado">
        <span className="numero">{metodo.numero}</span>
        <span className="categoria">{metodo.categoria}</span>
      </div>

      <h3>{metodo.titulo}</h3>

      <div className={`imagen-metodo formula-${metodo.numero}`}>
        <img src={metodo.imagen} alt="" />
      </div>

      <p>{metodo.descripcion}</p>

      <div className="tarjeta-pie">
        <span>{metodo.pie}</span>

        <button
          className="boton-enlace"
          aria-label={`Abrir ${metodo.titulo}`}
        >
          <IconoEnlace />
        </button>
      </div>

    </article>
  )
}
function NoLineales() {
  return (
    <section className="seccion-metodos">

      <div className="encabezado-seccion">
        <div className="encabezado-titulo">
          <h2>
            RAÍCES DE ECUACIONES NO LINEALES DE UNA SOLA VARIABLE
            <span className="punto">.</span>
          </h2>
        </div>

        <span className="contador-temas">
          01 — 03
        </span>
      </div>
      <div className="introduccion-unidad">
        <span className="etiqueta-introduccion">
          Introducción
        </span>

        <p>
          Resolver una ecuación no lineal consiste en encontrar los valores de la variable x para los cuales una función se hace cero. Estos valores se conocen como raíces o soluciones. Debido a que no siempre es posible obtenerlas mediante procedimientos algebraicos, se utilizan métodos numéricos que permiten aproximarlas de manera iterativa, de acuerdo con sus características y condiciones de aplicación.
        </p>
      </div>
      <div className="cuadricula">
        {metodos.map((metodo) => (
          <TarjetaMetodo
            key={metodo.numero}
            metodo={metodo}
          />
        ))}
      </div>

    <div>
      
    </div>
    </section>
  )
}

export default NoLineales
