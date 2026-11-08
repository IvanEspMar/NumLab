
import { useNavigate } from 'react-router'
import gaussJordan from '../../../assets/gauss-jordan.svg'
import gaussSeidel from '../../../assets/secante.svg'

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
    categoria: 'MÉTODO DIRECTO',
    titulo: 'Método de Gauss-Jordan',
    imagen: gaussJordan,
    descripcion: 'Resuelve sistemas de ecuaciones lineales mediante operaciones elementales sobre matrices hasta obtener su forma reducida.',
    pie: 'FORMA ESCALONADA REDUCIDA',
    enlace: '/sistemas/gauss-jordan'
  },
  {
    numero: '03',
    categoria: 'MÉTODO ITERATIVO',
    titulo: 'Método de Jacobi',
    imagen: "",
    descripcion: 'Aproxima la solución de sistemas lineales calculando nuevos valores a partir de los resultados de la iteración anterior.',
    pie: 'ACTUALIZACIÓN SIMULTÁNEA',
    enlace: '/sistemas/jacobi'
  },
  {
    numero: '02',
    categoria: 'MÉTODO ITERATIVO',
    titulo: 'Método de Gauss-Seidel',
    imagen: gaussSeidel,
    descripcion: 'Obtiene soluciones aproximadas de sistemas lineales utilizando los valores calculados en cada iteración.',
    pie: 'ACTUALIZACIÓN INMEDIATA',
    enlace: '/sistemas/gauss-seidel'
  },
]

const metodosFactor: Metodo[] = [
   {
    numero: '04',
    categoria: 'FACTORIZACIÓN LU',
    titulo: 'Método de Doolittle',
    imagen: "doolittle",
    descripcion: 'Descompone una matriz en el producto de una matriz triangular inferior con diagonal unitaria y una superior.',
    pie: 'FACTORIZACIÓN LU',
    enlace: '/factorizacion/doolittle'
  },
  {
    numero: '05',
    categoria: 'FACTORIZACIÓN LU',
    titulo: 'Método de Crout',
    imagen: "crout",
    descripcion: 'Factoriza una matriz como el producto de una matriz triangular inferior y una superior con diagonal unitaria.',
    pie: 'FACTORIZACIÓN LU',
    enlace: '/factorizacion/crout'
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
function Sistemas() {
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
          Una ecuación no lineal de una variable consiste en encontrar los valores de x para los cuales una función se iguala a cero. Estos valores, conocidos como raíces, pueden aproximarse mediante diferentes métodos numéricos, cada uno con un procedimiento y condiciones de aplicación particulares.
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
      <div className="encabezado-seccion">
        <div className="encabezado-titulo">
          <h2>
            FACTORIZACIÓN LU
            <span className="punto">.</span>
          </h2>
        </div>
      </div>
      
      <div className="cuadricula">
         {metodosFactor.map((metodo) => (
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

export default Sistemas
