import MethodIntroduction from '@/components/method-introduction/method-introduction'
import newton from '@/assets/newton.svg'

export default function NewtonIntroduccion() {
  return <MethodIntroduction method={{
    title: 'Método de Newton-Raphson',
    category: 'Raíces de ecuaciones · Método abierto',
    description: 'Aproxima una raíz de una función utilizando la pendiente de su recta tangente en cada iteración.',
    background: String.raw`Se parte de una aproximación \(x_0\). La tangente a la curva en ese punto corta al eje horizontal en una nueva estimación. El proceso requiere evaluar la función y su derivada y puede fallar si la derivada es cero o el punto inicial es inadecuado.`,
    history: 'Isaac Newton desarrolló ideas de aproximación de raíces en el siglo XVII. Joseph Raphson publicó en 1690 un procedimiento relacionado; el método actual se asocia a ambos nombres y evolucionó con el cálculo diferencial.',
    procedure: [String.raw`Elegir una aproximación inicial \(x_0\).`, String.raw`Evaluar \(f(x_n)\) y su derivada \(f'(x_n)\).`, 'Calcular la siguiente aproximación mediante la fórmula de Newton.', 'Repetir hasta satisfacer el criterio de parada.'],
    formulaLatex: String.raw`x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}`,
    image: newton,
    imageAlt: 'Gráfica SVG de la aproximación mediante rectas tangentes',
    calculatorPath: '/nolineal/newton/calcular',
  }} />
}
