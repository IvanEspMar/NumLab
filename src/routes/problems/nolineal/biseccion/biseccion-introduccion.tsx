import MethodIntroduction from '@/components/method-introduction/method-introduction'
import biseccion from '@/assets/biseccion.svg'

export default function BiseccionIntroduccion() {
  return <MethodIntroduction method={{
    title: 'Método de Bisección',
    category: 'Raíces de ecuaciones · Método cerrado',
    description: 'Es un procedimiento numérico que aproxima una raíz real dividiendo repetidamente un intervalo en dos mitades.',
    background: 'Si una función es continua en [a, b] y f(a) y f(b) tienen signos opuestos, el teorema del valor intermedio garantiza que existe al menos una raíz en el intervalo. Cada paso conserva la mitad donde persiste el cambio de signo.',
    history: 'La búsqueda de soluciones mediante intervalos se remonta a procedimientos antiguos de aproximación. La bisección moderna formaliza esta idea con el teorema del valor intermedio, desarrollado en el contexto del análisis matemático.',
    procedure: ['Elegir a y b con f(a)·f(b) < 0 y verificar continuidad.', 'Calcular el punto medio c = (a + b)/2.', 'Evaluar f(c) y conservar el subintervalo con cambio de signo.', 'Repetir hasta alcanzar la tolerancia deseada.'],
    formula: 'c = (a + b) / 2',
    image: biseccion,
    imageAlt: 'Gráfica que ilustra el método de bisección',
    calculatorPath: '/nolineal/biseccion/calcular',
  }} />
}
