import MethodIntroduction from '@/components/method-introduction/method-introduction'
import biseccion from '@/assets/biseccion.svg'

export default function BiseccionIntroduccion() {
  return <MethodIntroduction method={{
    title: 'Método de Bisección',
    category: 'Raíces de ecuaciones · Método cerrado',
    description: 'Es un procedimiento numérico que aproxima una raíz real dividiendo repetidamente un intervalo en dos mitades.',
    background: String.raw`Si una función es continua en \([a,b]\) y \(f(a)\) y \(f(b)\) tienen signos opuestos, el teorema del valor intermedio garantiza que existe al menos una raíz en el intervalo. Cada paso conserva la mitad donde persiste el cambio de signo.`,
    history: 'La búsqueda de soluciones mediante intervalos se remonta a procedimientos antiguos de aproximación. La bisección moderna formaliza esta idea con el teorema del valor intermedio, desarrollado en el contexto del análisis matemático.',
    procedure: [
      String.raw`Elegir \(a<b\) y comprobar que la función sea continua en el intervalo. Si un extremo evalúa a cero, es una raíz en la precisión de cálculo. En otro caso se requieren signos opuestos.`,
      String.raw`Calcular el punto medio \(c=\frac{a+b}{2}\) y evaluar la función en ese punto.`,
      'Si la evaluación no es cero, conservar la mitad con cambio de signo.',
      String.raw`La calculadora pide un semiancho pequeño y que \(|f(c)|\) se reduzca respecto al menor residuo inicial. El semiancho acota la distancia a alguna raíz solo bajo continuidad. Un intervalo estrecho con residuo grande puede indicar una discontinuidad o que falta precisión.`,
    ],
    formulaLatex: String.raw`c = \frac{a+b}{2}`,
    image: biseccion,
    imageAlt: 'Gráfica que ilustra el método de bisección',
    calculatorPath: '/nolineal/biseccion/calcular',
  }} />
}
