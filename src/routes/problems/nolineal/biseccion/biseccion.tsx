
import { compile } from "mathjs";
import { useState } from "react";
import "./biseccion.scss";

interface RowBisecType {
  a: number;
  b: number;
  c: number;
  fa: number;
  fb: number;
  fc: number;
  aChanged: boolean;
}

function Biseccion() {
  const [currentView, setCurrentView] = useState<"introduction" | "execution">("introduction");

  const [iterations, setIterations] = useState<RowBisecType[]>([]);
  const [equationText, setEquationText] = useState("2x^2 - 7");
  const [equationIsValid, setEquationIsValid] = useState(false);

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [sol, setSol] = useState<number | null>(null);

  const tolerance = 0.00001;
  const decimals = 6;
  const maxIterations = 50;

  const intervalIsValid = a < b;

  function equation(x: number): number {
    return compile(equationText).evaluate({ x });
  }

  function validateEquation() {
    try {
      const compiledEquation = compile(equationText);
      const test = compiledEquation.evaluate({ x: 1 });

      if (typeof test !== "number" || !Number.isFinite(test)) {
        throw new Error("La función no devuelve un número válido");
      }

      setEquationIsValid(true);
      setIterations([]);
      setSol(null);
    } catch (error) {
      setEquationIsValid(false);
      setIterations([]);
      setSol(null);
    }
  }

  const intervalHasSignChange = (() => {
    try {
      if (!equationIsValid || !intervalIsValid) return false;

      const fa = equation(a);
      const fb = equation(b);

      return Number.isFinite(fa) &&
        Number.isFinite(fb) &&
        fa * fb < 0;
    } catch {
      return false;
    }
  })();

  function computeIterations() {
    if (!intervalHasSignChange) return;

    let currentA = a;
    let currentB = b;

    let currentC = (currentA + currentB) / 2;

    const interations: RowBisecType[] = [];

    for (let i = 0; i < maxIterations; i++) {
      currentC = (currentA + currentB) / 2;

      const fa = equation(currentA);
      const fb = equation(currentB);
      const fc = equation(currentC);

      const acHasSignChange = fa * fc < 0;

      interations.push({
        a: currentA,
        b: currentB,
        c: currentC,
        fa,
        fb,
        fc,
        aChanged: !acHasSignChange
      });

      if (
        Math.abs(fc) < tolerance ||
        Math.abs(currentB - currentA) / 2 < tolerance
      ) {
        break;
      }

      if (acHasSignChange) {
        currentB = currentC;
      } else {
        currentA = currentC;
      }
    }

    setSol(currentC);
    setIterations(interations);
  }

  if (currentView === "introduction") {
    return (
      <section className="bisection">

        <div className="bisection__introduction">

          <span className="bisection__eyebrow">
            MÉTODOS PARA ECUACIONES NO LINEALES
          </span>

          <h1>Método de Bisección</h1>
          <div className="bisection__introduction-footer">
            <button
              onClick={() => setCurrentView("execution")}
            >
              Comenzar cálculo →
            </button>
          </div>
          <p className="bisection__description">
            El método de bisección es un procedimiento numérico
            que permite aproximar las raíces reales de una función
            mediante la reducción sucesiva de un intervalo.
          </p>

          <div className="bisection__theory">

            <h2>¿En qué consiste?</h2>

            <p>
              Se comienza con un intervalo inicial [a, b]
              en el que la función continua presenta signos
              contrarios en sus extremos. En cada iteración
              se calcula el punto medio del intervalo y se
              determina cuál de sus dos mitades conserva
              el cambio de signo.
            </p>

            <h2>Fundamento matemático</h2>

            <p>
              Para aplicar el método es necesario que
              se cumpla la siguiente condición:
            </p>

            <div className="bisection__formula">
              f(a) · f(b) &lt; 0
            </div>

            <p>
              El punto medio se obtiene mediante:
            </p>

            <div className="bisection__formula">
              c = (a + b) / 2
            </div>

            <h2>Procedimiento</h2>

            <ol>
              <li>
                Seleccionar un intervalo inicial [a, b].
              </li>
              <li>
                Calcular el punto medio c.
              </li>
              <li>
                Evaluar la función en el punto medio.
              </li>
              <li>
                Identificar la mitad del intervalo que
                conserva el cambio de signo.
              </li>
              <li>
                Repetir el proceso hasta alcanzar
                la tolerancia establecida.
              </li>
            </ol>

            <h2>Criterio de convergencia</h2>

            <p>
              El procedimiento termina cuando el error
              aproximado o el valor absoluto de la función
              alcanza la tolerancia especificada.
            </p>

          </div>

        </div>

      </section>
    );
  }

  return (
    <section className="bisection">

      <button
        className="bisection__back-button"
        onClick={() => setCurrentView("introduction")}
      >
        ← Volver a la introducción
      </button>

      <h1>MÉTODO DE BISECCIÓN</h1>

      <div className="bisection__equation-input">
        <label>Ingresa una ecuación válida</label>

        <div>
          <input
            onChange={(e) => {
              setEquationText(e.target.value);
              setEquationIsValid(false);
              setIterations([]);
              setSol(null);
            }}
            value={equationText}
            type="text"
            placeholder="x^2 + 5x"
          />

          <button onClick={validateEquation}>
            Validar función
          </button>
        </div>
      </div>

      {equationIsValid && (
        <>
          <div className="bisection__interval-inputs">
            <h3>Intervalo inicial</h3>

            <label htmlFor="interval-a">a:</label>
            <input
              id="interval-a"
              value={a}
              onChange={(e) => {
                setA(Number(e.target.value));
                setIterations([]);
                setSol(null);
              }}
              type="number"
            />

            <label htmlFor="interval-b">b:</label>
            <input
              id="interval-b"
              value={b}
              onChange={(e) => {
                setB(Number(e.target.value));
                setIterations([]);
                setSol(null);
              }}
              type="number"
            />
          </div>

          <div className="bisection__interval-values">
            <span>f(a) = {equation(a)}</span>
            <span>f(b) = {equation(b)}</span>
          </div>

          <div className="bisection__calculation-controls">
            <button
              disabled={!intervalHasSignChange}
              onClick={computeIterations}
            >
              Calcular
            </button>

            <span>
              {!intervalIsValid &&
                "Intervalo inválido: a debe ser menor que b"}
            </span>

            <span>
              {intervalIsValid && !intervalHasSignChange &&
                "f(a) y f(b) deben tener signos contrarios"}
            </span>
          </div>

          {sol !== null && (
            <>
              <div className="bisection__result">
                Resultado: {sol.toFixed(5)} <br />
                Comprobación: f({sol.toFixed(5)}) = {equation(sol).toFixed(6)}
              </div>

              <table className="bisection__iterations-table">
                <thead>
                  <tr>
                    <th>n</th>
                    <th>a</th>
                    <th>c</th>
                    <th>b</th>
                    <th>f(a)</th>
                    <th>f(c)</th>
                    <th>f(b)</th>
                  </tr>
                </thead>

                <tbody>
                  {iterations.map(({ a, b, c, fa, fb, fc }, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{Number(a.toFixed(decimals))}</td>
                      <td>{Number(c.toFixed(decimals))}</td>
                      <td>{Number(b.toFixed(decimals))}</td>
                      <td>{Number(fa.toFixed(decimals))}</td>
                      <td>{Number(fc.toFixed(decimals))}</td>
                      <td>{Number(fb.toFixed(decimals))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}

    </section>
  );
}

export default Biseccion;
