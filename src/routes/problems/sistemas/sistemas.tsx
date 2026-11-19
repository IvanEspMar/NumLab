import { type TarjetaData } from '@/components/tarjeta/tarjeta'
import TarjetaGrid from '@/components/tarjeta-grid/tarjeta-grid'

import jordan from '@/assets/jordan.png'
import jacobi from '@/assets/jacobi.png'
import seidel from '@/assets/seidel.jpg'
import doolittle from '@/assets/doolittle.png'
import crout from '@/assets/crout.png'

const metodosSistemas: TarjetaData[] = [
  {
    numero: '01',
    categoria: 'MÉTODO DIRECTO',
    titulo: 'Método de Gauss-Jordan',
    imagen: jordan,
    descripcion:
      'Resuelve sistemas de ecuaciones lineales mediante operaciones elementales sobre las filas de una matriz aumentada hasta obtener su forma escalonada reducida.',
    pie: 'FORMA ESCALONADA REDUCIDA',
    ruta: '/lineal/gauss-jordan',
  },
  {
    numero: '02',
    categoria: 'MÉTODO ITERATIVO',
    titulo: 'Método de Jacobi',
    imagen: jacobi,
    descripcion:
      'Obtiene soluciones aproximadas de sistemas lineales mediante iteraciones en las que cada incógnita se actualiza utilizando exclusivamente los valores de la iteración anterior.',
    pie: 'ACTUALIZACIÓN SIMULTÁNEA',
    ruta: '/lineal/jacobi',
  },
  {
    numero: '03',
    categoria: 'MÉTODO ITERATIVO',
    titulo: 'Método de Gauss-Seidel',
    imagen: seidel,
    descripcion:
      'Aproxima la solución de sistemas lineales utilizando inmediatamente los valores actualizados de las incógnitas durante cada iteración.',
    pie: 'ACTUALIZACIÓN SECUENCIAL',
    ruta: '/lineal/gauss-seidel',
  },
  {
    numero: '04',
    categoria: 'FACTORIZACIÓN LU',
    titulo: 'Método de Doolittle',
    imagen: doolittle,
    descripcion:
      'Descompone una matriz cuadrada en el producto de una matriz triangular inferior con diagonal unitaria y una matriz triangular superior.',
    pie: 'A = LU · DIAGONAL UNITARIA EN L',
    ruta: '/lineal/doolittle',
  },
  {
    numero: '05',
    categoria: 'FACTORIZACIÓN LU',
    titulo: 'Método de Crout',
    imagen: crout,
    descripcion:
      'Descompone una matriz cuadrada en el producto de una matriz triangular inferior y una matriz triangular superior con diagonal unitaria.',
    pie: 'A = LU · DIAGONAL UNITARIA EN U',
    ruta: '/lineal/crout',
  },
]

function Sistemas() {
  return (
    <TarjetaGrid
      titulo="SISTEMAS DE ECUACIONES LINEALES"
      contador="01 — 05"
      etiqueta="Métodos directos e iterativos"
      introduccion="Los sistemas de ecuaciones lineales están formados por un conjunto de ecuaciones que comparten varias incógnitas. Los métodos numéricos permiten determinar o aproximar sus soluciones mediante transformaciones matriciales y procedimientos iterativos."
      tarjetas={metodosSistemas}
      columnas={3}
    />
  )
}

export default Sistemas