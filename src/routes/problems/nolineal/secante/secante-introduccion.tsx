import MethodIntroduction from '@/components/method-introduction/method-introduction'
import secante from '@/assets/secante.svg'

export default function SecanteIntroduccion() {
  return <MethodIntroduction method={{
    title: 'Método de la Secante',
    category: 'Raíces de ecuaciones · Método abierto',
    description: 'Calcula aproximaciones a una raíz mediante rectas secantes que pasan por dos puntos de la gráfica.',
    background: 'A diferencia de Newton-Raphson, no requiere calcular la derivada. Utiliza dos valores iniciales y aproxima la pendiente mediante diferencias finitas. Su convergencia no está garantizada para cualquier elección de puntos.',
    history: 'El uso de interpolación lineal para aproximar raíces tiene antecedentes históricos anteriores al cálculo diferencial. La secante es una versión iterativa de esa idea que emplea dos aproximaciones sucesivas.',
    procedure: [String.raw`Elegir dos valores iniciales \(x_0\) y \(x_1\).`, 'Evaluar la función en ambos puntos.', 'Encontrar la intersección de la secante con el eje horizontal.', 'Usar las dos aproximaciones más recientes y repetir.'],
    formulaLatex: String.raw`x_{n+1}=x_n-\frac{f(x_n)(x_n-x_{n-1})}{f(x_n)-f(x_{n-1})}`,
    image: secante,
    imageAlt: 'Gráfica SVG que representa la recta secante',
    calculatorPath: '/nolineal/secante/calcular',
  }} />
}
