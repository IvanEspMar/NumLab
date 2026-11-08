
import { BlockMath } from 'react-katex';
import './biseccion.scss';

function Biseccion() {
  return (
    <section className="seccion-biseccion">
      <h1>MÉTODO DE BISECCIÓN</h1>

      <p>
        El método de bisección es un procedimiento numérico cerrado que
        permite aproximar una raíz de una función continua mediante la
        división sucesiva de un intervalo en dos partes iguales.
      </p>

      <p>
        Para aplicarlo, se requiere encontrar un intervalo cuyos extremos
        presenten valores de la función con signos opuestos, es decir:
      </p>

      <BlockMath math="f(a) \cdot f(b) < 0" />

      <p>
        En cada iteración se calcula el punto medio del intervalo:
      </p>

      <BlockMath math="x_n = \frac{a_n+b_n}{2}" />

      <p>
        Posteriormente, se selecciona el subintervalo donde se conserva
        el cambio de signo, reduciendo progresivamente el intervalo hasta
        alcanzar la precisión deseada.
      </p>

    </section>
  );
}

export default Biseccion;
