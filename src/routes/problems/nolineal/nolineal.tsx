import bisec from '../../../assets/biseccion.svg'
import secan from '../../../assets/secante.svg'
import newton from '../../../assets/newton.svg'
import './nolineal.scss'
import Tarjeta, { type TarjetaData } from '@/components/tarjeta/tarjeta'
import TarjetaGrid from '@/components/tarjeta-grid/tarjeta-grid'

const metodos: TarjetaData[] = [
  {
    numero: '01',
    categoria: 'MÉTODO CERRADO',
    titulo: 'Método de Bisección',
    imagen: bisec,
    descripcion: 'Encuentra raíces dividiendo repetidamente un intervalo en dos partes iguales.',
    pie: 'CONVERGENCIA GARANTIZADA*',
    ruta: '/nolineal/biseccion'
  },
  {
    numero: '02',
    categoria: 'MÉTODO ABIERTO',
    titulo: 'Método de Newton-Raphson',
    imagen: newton,
    descripcion: 'Utiliza la recta tangente de una función para aproximar sus raíces.',
    pie: 'CONVERGENCIA CUADRÁTICA*',
    ruta: '/nolineal/newton'
  },
  {
    numero: '03',
    categoria: 'MÉTODO ABIERTO',
    titulo: 'Método de la Secante',
    imagen: secan,
    descripcion: 'Aproxima raíces mediante rectas secantes utilizando dos valores iniciales.',
    pie: 'SIN DERIVADAS',
    ruta: '/nolineal/secante'
  }
]



function NoLineales() {
  return (
    <TarjetaGrid
      titulo="RAÍCES DE ECUACIONES NO LINEALES DE UNA SOLA VARIABLE"
      contador="01 — 03"
      etiqueta="Introducción"
      introduccion="Resolver una ecuación no lineal consiste en encontrar los valores de la variable x para los cuales una función se hace cero. Estos valores se conocen como raíces o soluciones. Debido a que no siempre es posible obtenerlas mediante procedimientos algebraicos, se utilizan métodos numéricos que permiten aproximarlas de manera iterativa, de acuerdo con sus características y condiciones de aplicación."
      tarjetas={metodos}
      columnas={3}
    />
  )
}

export default NoLineales
