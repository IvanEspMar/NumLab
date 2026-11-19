import MethodIntroduction from '@/components/method-introduction/method-introduction'
import newton from '@/assets/newton.svg'

export default function NewtonIntroduccion() {
  return <MethodIntroduction method={{
    title: 'Método de Newton-Raphson',
    category: 'Raíces de ecuaciones · Método abierto',
    description: 'Aproxima una raíz de una función utilizando la pendiente de su recta tangente en cada iteración.',
    background: 'Se parte de una aproximación x₀. La tangente a la curva en ese punto corta al eje horizontal en una nueva estimación. El proceso requiere evaluar la función y su derivada y puede fallar si la derivada es cero o el punto inicial es inadecuado.',
    history: 'Isaac Newton desarrolló ideas de aproximación de raíces en el siglo XVII. Joseph Raphson publicó en 1690 un procedimiento relacionado; el método actual se asocia a ambos nombres y evolucionó con el cálculo diferencial.',
    procedure: ['Elegir una aproximación inicial x₀.', 'Evaluar f(xₙ) y su derivada f′(xₙ).', 'Calcular la siguiente aproximación mediante la fórmula de Newton.', 'Repetir hasta satisfacer el criterio de parada.'],
    formula: 'xₙ₊₁ = xₙ − f(xₙ) / f′(xₙ)',
    image: newton,
    imageAlt: 'Gráfica SVG de la aproximación mediante rectas tangentes',
    calculatorPath: '/nolineal/newton/calcular',
  }} />
}
