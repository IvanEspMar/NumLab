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
      etiqueta="Métodos iterativos"
      introduccion="Los valores y vectores propios permiten estudiar propiedades fundamentales de las matrices y transformaciones lineales. Los métodos numéricos ofrecen procedimientos iterativos para aproximarlos cuando su cálculo directo resulta complicado."
      tarjetas={metodosEigen}
      columnas={3}
    />
  )
}

export default EigenValues