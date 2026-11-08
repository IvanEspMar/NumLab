import { type TarjetaData } from '@/components/tarjeta/tarjeta'
import TarjetaGrid from '@/components/tarjeta-grid/tarjeta-grid'

import gaussJordan from '@/assets/gauss-jordan.svg'

const metodosSistemas: TarjetaData[] = [
  {
    numero: '01',
    categoria: 'MÉTODO DIRECTO',
    titulo: 'Método de Gauss-Jordan',
    imagen: gaussJordan,
    descripcion:
      'Resuelve sistemas de ecuaciones lineales mediante operaciones elementales sobre las filas de una matriz aumentada hasta obtener su forma escalonada reducida.',
    pie: 'FORMA ESCALONADA REDUCIDA',
    ruta: '/sistemas/gauss-jordan',
  },
  {
    numero: '02',
    categoria: 'MÉTODO ITERATIVO',
    titulo: 'Método de Jacobi',
    imagen: '',
    descripcion:
      'Obtiene soluciones aproximadas de sistemas lineales mediante iteraciones en las que cada incógnita se actualiza utilizando exclusivamente los valores de la iteración anterior.',
    pie: 'ACTUALIZACIÓN SIMULTÁNEA',
    ruta: '/sistemas/jacobi',
  },
  {
    numero: '03',
    categoria: 'MÉTODO ITERATIVO',
    titulo: 'Método de Gauss-Seidel',
    imagen: '',
    descripcion:
      'Aproxima la solución de sistemas lineales utilizando inmediatamente los valores actualizados de las incógnitas durante cada iteración.',
    pie: 'ACTUALIZACIÓN SECUENCIAL',
    ruta: '/sistemas/gauss-seidel',
  },
  {
    numero: '04',
    categoria: 'FACTORIZACIÓN LU',
    titulo: 'Método de Doolittle',
    imagen: '',
    descripcion:
      'Descompone una matriz cuadrada en el producto de una matriz triangular inferior con diagonal unitaria y una matriz triangular superior.',
    pie: 'A = LU · DIAGONAL UNITARIA EN L',
    ruta: '/factorizacion/doolittle',
  },
  {
    numero: '05',
    categoria: 'FACTORIZACIÓN LU',
    titulo: 'Método de Crout',
    imagen: '',
    descripcion:
      'Descompone una matriz cuadrada en el producto de una matriz triangular inferior y una matriz triangular superior con diagonal unitaria.',
    pie: 'A = LU · DIAGONAL UNITARIA EN U',
    ruta: '/factorizacion/crout',
  },
  {
    numero: '06',
    categoria: 'FACTORIZACIÓN',
    titulo: 'Método de Cholesky',
    imagen: '',
    descripcion:
      'Descompone una matriz simétrica definida positiva en el producto de una matriz triangular inferior y su transpuesta.',
    pie: 'A = LLᵀ',
    ruta: '/factorizacion/cholesky',
  },
]

function Sistemas() {
  return (
    <TarjetaGrid
      titulo="SISTEMAS DE ECUACIONES LINEALES"
      contador="01 — 06"
      etiqueta="Métodos directos e iterativos"
      introduccion="Los sistemas de ecuaciones lineales están formados por un conjunto de ecuaciones que comparten varias incógnitas. Los métodos numéricos permiten determinar o aproximar sus soluciones mediante transformaciones matriciales y procedimientos iterativos."
      tarjetas={metodosSistemas}
      columnas={3}
    />
  )
}

export default Sistemas