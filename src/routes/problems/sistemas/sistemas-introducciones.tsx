import MethodIntroduction, { type MethodIntroductionData } from '@/components/method-introduction/method-introduction'
import jordan from '@/assets/jordan.png'
import jacobi from '@/assets/jacobi.png'
import seidel from '@/assets/seidel.jpg'
import doolittle from '@/assets/doolittle.png'
import crout from '@/assets/crout.png'

const methods = {
  'gauss-jordan': {
    title: 'Método de Gauss-Jordan', category: 'Sistemas lineales · Método directo',
    description: 'Resuelve sistemas de ecuaciones lineales mediante operaciones elementales de fila hasta reducir la matriz aumentada.',
    background: 'El procedimiento transforma la matriz sin cambiar las soluciones. Al llevarla a forma escalonada reducida es posible leer directamente las incógnitas, o identificar sistemas incompatibles o con infinitas soluciones.',
    history: 'El método recibe su nombre por Carl Friedrich Gauss y Wilhelm Jordan. Aunque la eliminación es mucho más antigua, sus trabajos contribuyeron a formalizar y difundir el procedimiento matricial.',
    procedure: ['Construir la matriz aumentada [A | b].', 'Seleccionar pivotes e intercambiar filas cuando haga falta.', 'Normalizar cada pivote y anular los demás elementos de su columna.', 'Interpretar la matriz reducida para obtener las soluciones.'],
    formula: '[A | b] → [I | x]', image: jordan, imageAlt: 'Retrato asociado a Gauss-Jordan', calculatorPath: '/lineal/gauss-jordan/calcular',
  },
  jacobi: {
    title: 'Método de Jacobi', category: 'Sistemas lineales · Método iterativo',
    description: 'Aproxima la solución de un sistema lineal actualizando todas las incógnitas con los valores de la iteración anterior.',
    background: 'Se despeja cada incógnita de su ecuación. En cada paso se calculan todas las componentes de la nueva aproximación de manera simultánea. La convergencia depende de las propiedades de la matriz.',
    history: 'El método lleva el nombre del matemático Carl Gustav Jacob Jacobi, del siglo XIX, cuyos trabajos influyeron en el álgebra y los métodos numéricos.',
    procedure: ['Verificar que la diagonal permita despejar las incógnitas.', 'Elegir un vector inicial.', 'Calcular todas las nuevas componentes usando exclusivamente los valores anteriores.', 'Repetir hasta cumplir la tolerancia o el límite de iteraciones.'],
    formula: 'xᵢ⁽ᵏ⁺¹⁾ = (bᵢ − Σⱼ≠ᵢ aᵢⱼxⱼ⁽ᵏ⁾) / aᵢᵢ', image: jacobi, imageAlt: 'Retrato de Carl Gustav Jacob Jacobi', calculatorPath: '/lineal/jacobi/calcular',
  },
  'gauss-seidel': {
    title: 'Método de Gauss-Seidel', category: 'Sistemas lineales · Método iterativo',
    description: 'Aproxima soluciones de sistemas lineales utilizando inmediatamente los valores recién calculados de cada incógnita.',
    background: 'Es similar al método de Jacobi, pero la actualización se realiza secuencialmente dentro de cada iteración. Bajo condiciones apropiadas puede converger, aunque no se garantiza para toda matriz.',
    history: 'El procedimiento está asociado a los trabajos de Carl Friedrich Gauss y Philipp Ludwig von Seidel, realizados durante el desarrollo de los métodos iterativos para sistemas lineales.',
    procedure: ['Elegir el sistema y una aproximación inicial.', 'Despejar las incógnitas de sus ecuaciones.', 'Actualizar cada incógnita usando inmediatamente las nuevas componentes disponibles.', 'Continuar hasta alcanzar la tolerancia deseada.'],
    image: seidel, imageAlt: 'Retrato asociado a Gauss-Seidel', calculatorPath: '/lineal/gauss-seidel/calcular',
  },
  doolittle: {
    title: 'Método de Doolittle', category: 'Sistemas lineales · Factorización LU',
    description: 'Descompone una matriz en el producto de una triangular inferior L, con unos en su diagonal, y una triangular superior U.',
    background: 'Una vez encontrada A = LU, se resuelven sucesivamente dos sistemas triangulares. La versión básica sin pivoteo requiere que los pivotes necesarios sean distintos de cero.',
    history: 'La variante de factorización LU recibe su nombre de Myrick Hascall Doolittle, que publicó en el siglo XIX procedimientos de cálculo para resolver sistemas lineales.',
    procedure: ['Tomar la matriz de coeficientes A.', 'Calcular L y U, fijando la diagonal de L en uno.', 'Resolver Ly = b por sustitución hacia adelante.', 'Resolver Ux = y por sustitución hacia atrás.'],
    formula: 'A = LU; diag(L) = 1', image: doolittle, imageAlt: 'Retrato asociado a Doolittle', calculatorPath: '/lineal/doolittle/calcular',
  },
  crout: {
    title: 'Método de Crout', category: 'Sistemas lineales · Factorización LU',
    description: 'Descompone una matriz en un factor triangular inferior L y un factor triangular superior U cuya diagonal contiene unos.',
    background: 'La factorización facilita la resolución de sistemas con la misma matriz de coeficientes y diferentes términos independientes. En su forma básica necesita pivotes no nulos.',
    history: 'El método está asociado al matemático Prescott Durand Crout, que describió procedimientos eficientes de factorización y resolución de sistemas durante el siglo XX.',
    procedure: ['Formar la matriz A y el vector b.', 'Calcular L y U, fijando la diagonal de U en uno.', 'Resolver Ly = b.', 'Resolver Ux = y.'],
    formula: 'A = LU; diag(U) = 1', image: crout, imageAlt: 'Retrato asociado a Crout', calculatorPath: '/lineal/crout/calcular',
  },
} satisfies Record<string, MethodIntroductionData>

export type SystemsMethod = keyof typeof methods

export default function SistemasIntroduccion({ method }: { method: SystemsMethod }) {
  return <MethodIntroduction method={methods[method]} />
}
