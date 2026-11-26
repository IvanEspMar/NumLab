import { type TarjetaData } from '@/components/tarjeta/tarjeta'
import TarjetaGrid from '@/components/tarjeta-grid/tarjeta-grid'
import potencia from '@/assets/potencia.svg'
import inversa from '@/assets/inversa.svg'
const metodosEigen: TarjetaData[] = [
  {
    numero: '01',
    categoria: 'MÉTODO ITERATIVO',
    titulo: 'Método de la potencia',
    imagen: potencia,
    descripcion:
      'Aproxima el valor propio dominante de una matriz y su vector propio asociado mediante multiplicaciones matriciales sucesivas y un proceso de normalización.',
    pie: 'Valor propio dominante',
    ruta: '/eigenvalues/potencia',
  },
  {
    numero: '02',
    categoria: 'MÉTODO ITERATIVO',
    titulo: 'Método de la potencia inversa',
    imagen: inversa,
    descripcion:
      'Permite aproximar el valor propio de menor magnitud distinto de cero y su vector propio asociado mediante iteraciones que involucran la resolución de sistemas lineales.',
    pie: 'Valor propio de menor magnitud',
    ruta: '/eigenvalues/inversa',
  },
]

function EigenValues() {
  return (
    <TarjetaGrid
      titulo="VALORES Y VECTORES PROPIOS"
      contador="01 — 02"
      etiqueta="Qué son los valores propios"
      informacion="Un vector propio es un vector distinto de cero que, al multiplicarse por una matriz, queda multiplicado por un escalar. Ese escalar es su valor propio. Los métodos de la potencia y de la potencia inversa permiten aproximar valores propios de gran o pequeña magnitud, según las condiciones de la matriz."
      tarjetas={metodosEigen}
      columnas={3}
    />
  )
}

export default EigenValues