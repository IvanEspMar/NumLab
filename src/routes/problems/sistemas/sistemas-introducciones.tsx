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
    history: [
      'La eliminación de incógnitas se practicaba desde mucho antes del siglo XIX. Carl Friedrich Gauss la empleó en cálculos de mínimos cuadrados, donde era necesario ajustar modelos a mediciones que no coincidían exactamente.',
      'Wilhelm Jordan, geodesta alemán, describió en 1888 una variante en su manual de topografía. En la formulación actual, la reducción elimina los términos por encima y por debajo de cada pivote, lo que permite leer directamente la solución cuando es única.',
    ],
    historyReference: { label: 'Historia de la reducción de Gauss-Jordan', url: 'https://doi.org/10.1080/00029890.1987.12000605' },
    procedure: [String.raw`Construir la matriz aumentada \([A\mid b]\).`, 'Seleccionar pivotes e intercambiar filas cuando haga falta.', 'Normalizar cada pivote y anular los demás elementos de su columna.', 'Interpretar la matriz reducida para obtener las soluciones.'],
    formulaLatex: String.raw`[A\mid b]\longrightarrow[I\mid x]`, image: jordan, imageAlt: 'Retrato asociado a Gauss-Jordan', calculatorPath: '/lineal/gauss-jordan/calcular',
  },
  jacobi: {
    title: 'Método de Jacobi', category: 'Sistemas lineales · Método iterativo',
    description: 'Aproxima la solución de un sistema lineal actualizando todas las incógnitas con los valores de la iteración anterior.',
    background: 'Se despeja cada incógnita de su ecuación. En cada paso se calculan todas las componentes de la nueva aproximación de manera simultánea. La convergencia depende de las propiedades de la matriz.',
    history: [
      'Carl Gustav Jacob Jacobi (1804–1851) fue un matemático que enseñó en Königsberg, donde también desarrolló trabajos sobre funciones elípticas. En 1845 publicó un procedimiento para resolver los sistemas lineales que surgen al ajustar observaciones por mínimos cuadrados.',
      'La idea que caracteriza a la iteración de Jacobi es calcular todas las correcciones a partir de la misma aproximación. En términos actuales, cada componente de la nueva solución puede calcularse por separado antes de pasar a la siguiente iteración.',
    ],
    historyReference: { label: 'Artículo de Jacobi de 1845', url: 'https://doi.org/10.1002/asna.18450222002' },
    procedure: ['Verificar que la diagonal permita despejar las incógnitas.', 'Elegir un vector inicial.', 'Calcular todas las nuevas componentes usando exclusivamente los valores anteriores.', 'Repetir hasta cumplir la tolerancia o el límite de iteraciones.'],
    formulaLatex: String.raw`x_i^{(k+1)}=\frac{b_i-\sum_{j\ne i}a_{ij}x_j^{(k)}}{a_{ii}}`, image: jacobi, imageAlt: 'Retrato de Carl Gustav Jacob Jacobi', calculatorPath: '/lineal/jacobi/calcular',
  },
  'gauss-seidel': {
    title: 'Método de Gauss-Seidel', category: 'Sistemas lineales · Método iterativo',
    description: 'Aproxima soluciones de sistemas lineales utilizando inmediatamente los valores recién calculados de cada incógnita.',
    background: 'Es similar al método de Jacobi, pero la actualización se realiza secuencialmente dentro de cada iteración. Bajo condiciones apropiadas puede converger, aunque no se garantiza para toda matriz.',
    history: [
      'Carl Friedrich Gauss ya describía técnicas iterativas en una carta de 1823. El problema era práctico: ajustar observaciones requería resolver sistemas lineales cuyos cálculos se hacían a mano.',
      'Philipp Ludwig von Seidel retomó el problema de los mínimos cuadrados y publicó en 1874 el procedimiento que hoy se asocia a ambos. Su rasgo distintivo es usar cada valor recién calculado en cuanto está disponible, dentro de la misma iteración.',
    ],
    historyReference: { label: 'Historia de los métodos iterativos', url: 'https://doi.org/10.1137/24M1680428' },
    procedure: ['Elegir el sistema y una aproximación inicial.', 'Despejar las incógnitas de sus ecuaciones.', 'Actualizar cada incógnita usando inmediatamente las nuevas componentes disponibles.', 'Continuar hasta alcanzar la tolerancia deseada.'],
    formulaLatex: String.raw`x_i^{(k+1)}=\frac{b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}-\sum_{j>i}a_{ij}x_j^{(k)}}{a_{ii}}`, image: seidel, imageAlt: 'Retrato asociado a Gauss-Seidel', calculatorPath: '/lineal/gauss-seidel/calcular',
  },
  doolittle: {
    title: 'Método de Doolittle', category: 'Sistemas lineales · Factorización LU',
    description: String.raw`Descompone una matriz en el producto de una triangular inferior \(L\), con unos en su diagonal, y una triangular superior \(U\).`,
    background: String.raw`Una vez encontrada \(A=LU\), se resuelven sucesivamente dos sistemas triangulares. La versión básica sin pivoteo requiere que los pivotes necesarios sean distintos de cero.`,
    history: [
      'Myrick Hascall Doolittle trabajó en el servicio geodésico de Estados Unidos. En el informe de 1878 describió un procedimiento de cálculo relacionado con el ajuste de redes de triangulación, en las que se combinaban mediciones para determinar posiciones.',
      'El procedimiento organizaba la eliminación para facilitar los cálculos manuales. En la formulación matricial que lleva su nombre, el factor triangular inferior tiene unos en la diagonal y los pivotes quedan en el factor superior.',
    ],
    historyReference: { label: 'Investigación sobre los orígenes de la eliminación gaussiana', url: 'https://doi.org/10.1016/j.hm.2010.06.003' },
    procedure: [String.raw`Tomar la matriz de coeficientes \(A\).`, String.raw`Calcular \(L\) y \(U\), fijando la diagonal de \(L\) en uno.`, String.raw`Resolver \(Ly=b\) por sustitución hacia adelante.`, String.raw`Resolver \(Ux=y\) por sustitución hacia atrás.`],
    formulaLatex: String.raw`A=LU,\quad L_{ii}=1`, image: doolittle, imageAlt: 'Retrato asociado a Doolittle', calculatorPath: '/lineal/doolittle/calcular',
  },
  crout: {
    title: 'Método de Crout', category: 'Sistemas lineales · Factorización LU',
    description: String.raw`Descompone una matriz en un factor triangular inferior \(L\) y un factor triangular superior \(U\) cuya diagonal contiene unos.`,
    background: String.raw`Los pivotes quedan en la diagonal de \(L\). Si el pivote es cero o demasiado pequeño y hay una fila adecuada debajo, se intercambian las filas correspondientes. La permutación \(P\) se aplica tanto a \(A\) como a \(b\).`,
    history: [
      'En 1941, Prescott Durand Crout publicó en la revista del American Institute of Electrical Engineers un procedimiento para evaluar determinantes y resolver sistemas lineales con coeficientes reales o complejos.',
      'Su trabajo abordaba dos problemas de cálculo con la misma estructura. En la variante de factorización que lleva su nombre, el factor triangular superior tiene unos en la diagonal, de modo que los pivotes quedan en el factor inferior.',
    ],
    historyReference: { label: 'Artículo de Crout de 1941', url: 'https://doi.org/10.1109/T-AIEE.1941.5058258' },
    procedure: [
      String.raw`Para cada columna \(j\), calcular \(L_{ij}=A_{ij}-\sum_{k=0}^{j-1}L_{ik}U_{kj}\) para \(i\ge j\), usando el orden actual de las filas.`,
      String.raw`Comprobar el pivote \(L_{jj}\). Si hace falta intercambiar filas, aplicar el cambio también a las entradas ya calculadas de \(L\).`,
      String.raw`Fijar \(U_{jj}=1\) y calcular \(U_{ji}=(A_{ji}-\sum_{k=0}^{j-1}L_{jk}U_{ki})/L_{jj}\) para \(i>j\).`,
      String.raw`Resolver \(Ly=b\) (o \(Ly=Pb\) si se intercambiaron filas) por sustitución hacia adelante, dividiendo cada término entre \(L_{ii}\).`,
      String.raw`Resolver \(Ux=y\) por sustitución hacia atrás con la diagonal unitaria de \(U\).`,
    ],
    formulaLatex: String.raw`\begin{gathered} A=LU\;\text{sin intercambios} \\ PA=LU\;\text{con intercambios} \\ U_{ii}=1 \end{gathered}`, image: crout, imageAlt: 'Retrato asociado a Crout', calculatorPath: '/lineal/crout/calcular',
  },
} satisfies Record<string, MethodIntroductionData>

export type SystemsMethod = keyof typeof methods

export default function SistemasIntroduccion({ method }: { method: SystemsMethod }) {
  return <MethodIntroduction method={methods[method]} />
}
