
import { useNavigate } from 'react-router'
import bisec from '../../../assets/biseccion.svg'
import secan from '../../../assets/secante.svg'
import newton from '../../../assets/newton.svg'
import './nolineal.scss'

type MetodoNL = {
  numero: string
  categoria: string
  titulo: string
  imagen: string
  descripcion: string
  pie: string
  enlace: string
}

const metodosNL: MetodoNL[] = [
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

function IconoEnlaceNL() {
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

function TarjetaMetodoNL({ metodo }: { metodo: MetodoNL }) {
  const navigate = useNavigate()

  return (
    <article
      className="nl-tarjeta"
      onClick={() => navigate(metodo.enlace)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate(metodo.enlace)
        }
      }}
    >
      <div className="nl-tarjeta-encabezado">
        <span className="nl-numero">{metodo.numero}</span>
        <span className="nl-categoria">{metodo.categoria}</span>
      </div>

      <h3 className="nl-titulo">{metodo.titulo}</h3>

      <div className={`nl-imagen nl-formula-${metodo.numero}`}>
        <img src={metodo.imagen} alt={`Ilustración del ${metodo.titulo}`} />
      </div>

      <p className="nl-descripcion">{metodo.descripcion}</p>

      <div className="nl-pie">
        <span>{metodo.pie}</span>
        <span className="nl-flecha">
          <IconoEnlaceNL />
        </span>
      </div>
    </article>
  )
}

function NoLineales() {
  return (
    <section className="nl-seccion">
      <div className="nl-encabezado">
        <div className="nl-encabezado-titulo">
          <h2>
            RAÍCES DE ECUACIONES NO LINEALES DE UNA SOLA VARIABLE
            <span className="nl-punto">.</span>
          </h2>
        </div>

        <span className="nl-contador">01 — 03</span>
      </div>

      <div className="nl-introduccion">
        <span className="nl-etiqueta">Introducción</span>

        <p>
          Resolver una ecuación no lineal consiste en encontrar los valores de la variable x para los cuales una función se hace cero. Estos valores se conocen como raíces o soluciones. Debido a que no siempre es posible obtenerlas mediante procedimientos algebraicos, se utilizan métodos numéricos que permiten aproximarlas de manera iterativa, de acuerdo con sus características y condiciones de aplicación.
        </p>
      </div>

      <div className="nl-cuadricula">
        {metodosNL.map((metodo) => (
          <TarjetaMetodoNL key={metodo.numero} metodo={metodo} />
        ))}
      </div>
    </section>
  )
}

export default NoLineales
