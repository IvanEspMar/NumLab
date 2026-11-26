import MethodIntroduction, { type MethodIntroductionData } from '@/components/method-introduction/method-introduction'
import potencia from '@/assets/potencia.svg'
import inversa from '@/assets/inversa.svg'

const methods = {
  potencia: {
    title: 'Método de la Potencia', category: 'Valores propios · Método iterativo',
    description: String.raw`Aproxima el valor propio de mayor magnitud de una matriz cuadrada y un vector asociado que satisface \(Av=\lambda v\). Incluso un valor propio negativo puede ser el dominante si su magnitud es la mayor.`,
    background: String.raw`La multiplicación reiterada por \(A\) amplifica las componentes asociadas a valores propios de mayor magnitud. La normalización controla el tamaño del vector y permite seguir su dirección de una iteración a la siguiente.`,
    history: 'La iteración de potencias forma parte de los métodos clásicos de álgebra numérica para hallar valores propios y se consolidó con el desarrollo del cálculo matricial moderno.',
    procedure: ['Normalizar un vector inicial no nulo con su primera componente de mayor magnitud, conservando su signo.', 'Multiplicar la matriz por el vector normalizado.', 'Estimar el valor propio con el pivote anterior y normalizar el nuevo vector con su propia componente de mayor magnitud.', 'Comprobar el error absoluto y el residuo.'],
    formulaLatex: String.raw`y^{(k+1)}=Ax^{(k)},\quad \lambda_{k+1}=y^{(k+1)}_{p_k},\quad x^{(k+1)}=\frac{y^{(k+1)}}{y^{(k+1)}_{p_{k+1}}}`,
    image: potencia,
    imageAlt: 'Ilustración del método de la potencia',
    calculatorPath: '/eigenvalues/potencia/calcular',
  },
  inversa: {
    title: 'Método de la Potencia Inversa', category: 'Valores propios · Método iterativo',
    description: String.raw`Aproxima el valor propio de menor magnitud de una matriz invertible y su vector asociado. Si \(Av=\lambda v\), entonces \(A^{-1}v=(1/\lambda)v\).`,
    background: String.raw`El valor propio de menor magnitud de \(A\) se convierte, al tomar su recíproco, en el de mayor magnitud de \(A^{-1}\). Para aplicar ese efecto al vector, basta resolver un sistema con \(A\) en cada iteración. La factorización con pivoteo se reutiliza durante todo el cálculo.`,
    history: 'La iteración inversa es una extensión de la iteración de potencias desarrollada dentro del análisis numérico matricial para estudiar valores propios cercanos a un objetivo.',
    procedure: ['Elegir una matriz invertible y normalizar un vector inicial no nulo.', String.raw`Resolver \(Ay^{(k)}=x^{(k-1)}\).`, 'Estimar el valor propio de la inversa con el pivote anterior y tomar su recíproco si es finito.', 'Normalizar el vector auxiliar con el nuevo pivote y comprobar el error absoluto y el residuo.'],
    formulaLatex: String.raw`Ay^{(k+1)}=x^{(k)},\quad \lambda_{k+1}=\frac{1}{y^{(k+1)}_{p_k}},\quad x^{(k+1)}=\frac{y^{(k+1)}}{y^{(k+1)}_{p_{k+1}}}`,
    image: inversa,
    imageAlt: 'Ilustración del método de la potencia inversa',
    calculatorPath: '/eigenvalues/inversa/calcular',
  },
} satisfies Record<string, MethodIntroductionData>

export type EigenMethod = keyof typeof methods
export default function EigenIntroduccion({ method }: { method: EigenMethod }) {
  return <MethodIntroduction method={methods[method]} />
}
