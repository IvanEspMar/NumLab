import MethodIntroduction, { type MethodIntroductionData } from '@/components/method-introduction/method-introduction'

const methods = {
  potencia: {
    title: 'Método de la Potencia', category: 'Valores propios · Método iterativo',
    description: 'Aproxima el valor propio dominante en magnitud y un vector propio asociado mediante productos sucesivos por una matriz.',
    background: 'Partiendo de un vector inicial apropiado, se multiplica repetidamente por la matriz y se normaliza el resultado. Si existe un valor propio dominante suficientemente separado y el vector inicial contiene su componente, suele observarse convergencia.',
    history: 'La iteración de potencias forma parte de los métodos clásicos de álgebra numérica para hallar valores propios y se consolidó con el desarrollo del cálculo matricial moderno.',
    procedure: ['Elegir una matriz y un vector inicial no nulo.', 'Multiplicar la matriz por el vector.', 'Normalizar el resultado y estimar el valor propio.', 'Repetir hasta alcanzar la tolerancia.'],
    formula: 'vₖ₊₁ = Avₖ / ‖Avₖ‖', calculatorPath: '/eigenvalues/potencia/calcular',
  },
  inversa: {
    title: 'Método de la Potencia Inversa', category: 'Valores propios · Método iterativo',
    description: 'Aproxima un valor propio de menor magnitud y su vector propio asociado mediante la resolución reiterada de sistemas lineales.',
    background: 'En lugar de calcular explícitamente la matriz inversa, se resuelve Ay = v en cada paso y se normaliza y. El método necesita una matriz invertible; el desplazamiento espectral permite buscar valores propios cercanos a un valor elegido.',
    history: 'La iteración inversa es una extensión de la iteración de potencias desarrollada dentro del análisis numérico matricial para estudiar valores propios cercanos a un objetivo.',
    procedure: ['Elegir una matriz invertible y un vector inicial.', 'Resolver el sistema Ay = v.', 'Normalizar y para obtener la nueva aproximación.', 'Estimar el valor propio y repetir hasta converger.'],
    formula: 'Ayₖ = vₖ; vₖ₊₁ = yₖ / ‖yₖ‖', calculatorPath: '/eigenvalues/inversa/calcular',
  },
} satisfies Record<string, MethodIntroductionData>

export type EigenMethod = keyof typeof methods
export default function EigenIntroduccion({ method }: { method: EigenMethod }) {
  return <MethodIntroduction method={methods[method]} />
}
