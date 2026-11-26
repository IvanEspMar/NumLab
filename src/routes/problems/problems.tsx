import { type TarjetaData } from '@/components/tarjeta/tarjeta'
import grafica from '@/assets/nolineal.svg'
import sistemas from '@/assets/sistemas.jpg'
import TarjetaGrid from '@/components/tarjeta-grid/tarjeta-grid'
import valores from '@/assets/valores.svg'

import './problems.scss'

function Problemas() {
  return (
    <TarjetaGrid
      titulo="TIPOS DE PROBLEMAS Y MÉTODOS NUMÉRICOS"
      contador="01 — 03"
      etiqueta="Qué problemas resuelve NumLab"
      informacion="NumLab reúne tres tipos de problemas. En ecuaciones no lineales se buscan raíces de una función. En sistemas lineales se buscan valores que satisfagan varias ecuaciones a la vez. En valores propios se estudian las direcciones que una matriz conserva al transformar un vector."
      tarjetas={problemas}
      columnas={3}
    />
  )
}

export default Problemas


const problemas: TarjetaData[] = [
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
    imagen: valores,
    descripcion: 'Unidad 5 · Métodos de la Potencia y Potencia Inversa.',
    pie: 'VALORES Y VECTORES',
    ruta: '/eigenvalues'
  }
]


