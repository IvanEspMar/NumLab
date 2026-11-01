import { useNavigate } from 'react-router'
import grafica from '../../assets/graficas.jpg'
import sistemas from '../../assets/sistemas.jpg'
import './index.scss'

type Problema = {
  numero: string
  categoria: string
  titulo: string
  imagen?: string
  altImagen?: string
  formula?: string
  descripcion: string
  pie: string
  enlace: string
}


function TarjetaProblema({
  numero,
  categoria,
  titulo,
  imagen,
  altImagen,
  formula,
  descripcion,
  pie,
  enlace
}: Problema) {
   const navigate = useNavigate();

  return (
    <article onClick={() => navigate(enlace)} className="tarjeta-problema">
      <div className="tarjeta-encabezado">
        <span className="numero">{numero}</span>
        <span className="categoria">{categoria}</span>
      </div>

      <h3>{titulo}</h3>

      <div className="imagen-problema">
        {imagen && <img src={imagen} alt={altImagen ?? ''} />}
        {formula && <span className="simbolo-matematico">{formula}</span>}
      </div>

      <p>{descripcion}</p>

      <div className="tarjeta-pie">
        <span>{pie}</span>
        <IconoEnlace />
      </div>
    </article>
  )
}

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


function Areas() {
  const problemas: Problema[] = [
  {
    numero: '02',
    categoria: 'ECUACIONES NO LINEALES',
    titulo: 'Solución numérica de ecuaciones algebraicas de una variable',
    imagen: grafica,
    altImagen: 'Gráfica de una función matemática',
    descripcion: 'Unidad 2 · Bisección, Newton y Secante.',
    pie: 'BÚSQUEDA DE RAÍCES',
     enlace: "/nolineal"
  },
  {
    numero: '03–04',
    categoria: 'SISTEMAS DE ECUACIONES LINEALES',
    titulo: 'Resolver sistemas de ecuaciones lineales',
    imagen: sistemas,
    altImagen: 'Ax = b',
    descripcion: 'Unidad 3 · Gauss-Jordan, Gauss-Seidel y Jacobi. Unidad 4 · Factorización de Doolittle y Crout.',
    pie: 'SISTEMAS Y FACTORIZACIÓN',
    enlace: "/lineal"
  },
  {
    numero: '05',
    categoria: 'VALORES PROPIOS',
    titulo: 'Cálculo de valores propios',
    formula: 'Av = λv',
    descripcion: 'Unidad 5 · Métodos de la Potencia y Potencia Inversa.',
    pie: 'VALORES Y VECTORES',
     enlace: "/valores"
  }
]
  return (
    <section className="seccion-problemas">
      <div className="encabezado-seccion">
        <div className="encabezado-titulo">
          <h2>
              TIPOS DE PROBLEMAS Y MÉTODOS NUMÉRICOS
            <span className="punto">.</span>
          </h2>
        </div>

        <span className="contador-temas">01 — 03</span>
      </div>

      <div className="cuadricula">
        {problemas.map((problema) => (
          <TarjetaProblema key={problema.numero} {...problema} />
        ))}
      </div>
    </section>
  )
}

export default Areas