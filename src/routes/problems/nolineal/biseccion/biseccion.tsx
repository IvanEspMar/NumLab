import { CalculadoraNoLineal, ResultadoNoLineal } from "../calculadora-nolineal";

import { compile, parse } from "mathjs";
import { MathJax } from "better-react-mathjax";
import { useState } from "react";

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

  const [iterations, setIterations] = useState<RowBisecType[]>([]);
  const [equationText, setEquationText] = useState("2x^2 - 7");
  const [equationIsValid, setEquationIsValid] = useState(false);
  const [equationLatex, setEquationLatex] = useState("");

  const [aInput, setAInput] = useState("0");
  const [bInput, setBInput] = useState("0");

  const [sol, setSol] = useState<number | null>(null);
  const [calculationMessage, setCalculationMessage] = useState("");

  const tolerance = 0.00001;
  const decimals = 6;
  const maxIterations = 50;

  const a = Number(aInput);
  const b = Number(bInput);

  const intervalIsValid =
    Number.isFinite(a) &&
    Number.isFinite(b) &&
    a < b;

  function resetResults() {
    setIterations([]);
    setSol(null);
    setCalculationMessage("");
  }

  function equation(x: number): number {
    return compile(equationText).evaluate({ x });
  }

  function validateEquation() {
    resetResults();

    try {
      const parsedEquation = parse(equationText);
      const compiledEquation = parsedEquation.compile();
      const test = compiledEquation.evaluate({ x: 1 });

      if (
        typeof test !== "number" ||
        !Number.isFinite(test)
      ) {
        throw new Error("La función no devuelve un número válido");
      }

      setEquationLatex(parsedEquation.toTex());
      setEquationIsValid(true);

    } catch {
      setEquationLatex("");
      setEquationIsValid(false);
      setCalculationMessage("La función introducida no es válida.");
    }
  }

  function safeEvaluate(x: number): number | null {
    try {
      const result = equation(x);

      return typeof result === "number" &&
        Number.isFinite(result)
        ? result
        : null;

    } catch {
      return null;
    }
  }

  const fa = equationIsValid ? safeEvaluate(a) : null;
  const fb = equationIsValid ? safeEvaluate(b) : null;

  const intervalHasSignChange =
    equationIsValid &&
    intervalIsValid &&
    fa !== null &&
    fb !== null &&
    fa * fb < 0;

  function computeIterations() {
    if (!intervalHasSignChange) return;

    resetResults();

    let currentA = a;
    let currentB = b;

    const newIterations: RowBisecType[] = [];

    for (let i = 0; i < maxIterations; i++) {

      const currentC = (currentA + currentB) / 2;

      const fa = safeEvaluate(currentA);
      const fb = safeEvaluate(currentB);
      const fc = safeEvaluate(currentC);

      if (fa === null || fb === null || fc === null) {
        setCalculationMessage(
          "Se obtuvo un resultado no válido durante el cálculo."
        );
        break;
      }

      const acHasSignChange = fa * fc < 0;

      newIterations.push({
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
        setSol(currentC);
        break;
      }

      if (acHasSignChange) {
        currentB = currentC;
      } else {
        currentA = currentC;
      }

      if (i === maxIterations - 1) {
        setCalculationMessage(
          "Se alcanzó el máximo de iteraciones."
        );
      }
    }

    setIterations(newIterations);
  }

  return (
    <CalculadoraNoLineal
      title="MÉTODO DE BISECCIÓN"
      introductionPath="/nolineal/biseccion"
      equationText={equationText}
      equationLatex={equationIsValid ? equationLatex : null}
      validationMessage={calculationMessage}
      onEquationChange={(value) => {
        setEquationText(value);
        setEquationLatex("");
        setEquationIsValid(false);
        resetResults();
      }}
      onValidate={validateEquation}
      parameters={(
        <>
          <div className="calculadora-nolineal__interval-inputs">

            <h3>Intervalo inicial</h3>

            <label htmlFor="interval-a">
              <MathJax inline>
                {String.raw`\(a:\)`}
              </MathJax>
            </label>

            <input
              id="interval-a"
              value={aInput}
              onChange={(e) => {
                setAInput(e.target.value);
                resetResults();
              }}
              type="number"
              step="any"
              placeholder="0"
            />

            <label htmlFor="interval-b">
              <MathJax inline>
                {String.raw`\(b:\)`}
              </MathJax>
            </label>

            <input
              id="interval-b"
              value={bInput}
              onChange={(e) => {
                setBInput(e.target.value);
                resetResults();
              }}
              type="number"
              step="any"
              placeholder="0"
            />

          </div>

          <div className="calculadora-nolineal__interval-values">

            <MathJax inline dynamic>
              {String.raw`\(f(a)=${
                fa ?? "\\text{No definido}"
              }\)`}
            </MathJax>

            <MathJax inline dynamic>
              {String.raw`\(f(b)=${
                fb ?? "\\text{No definido}"
              }\)`}
            </MathJax>

          </div>

          <div className="calculadora-nolineal__calculation-controls">

            <button
              disabled={!intervalHasSignChange}
              onClick={computeIterations}
            >
              Calcular
            </button>

            {!intervalIsValid && (
              <span>
                Intervalo inválido: se requiere{" "}
                <MathJax inline>
                  {String.raw`\(a<b\)`}
                </MathJax>
              </span>
            )}

            {intervalIsValid &&
              (fa === null || fb === null) && (
                <span>
                  La función no está definida en los extremos.
                </span>
              )}

            {intervalIsValid &&
              fa !== null &&
              fb !== null &&
              !intervalHasSignChange && (
                <span>
                  Se requiere que{" "}
                  <MathJax inline>
                    {String.raw`\(f(a)f(b)<0\)`}
                  </MathJax>
                </span>
              )}

            {calculationMessage && (
              <span role="status">{calculationMessage}</span>
            )}

          </div>
        </>
      )}
    >
      {sol !== null && (
        <ResultadoNoLineal
          x={sol.toFixed(decimals)}
          fx={equation(Number(sol.toFixed(decimals))).toFixed(decimals)}
        />
      )}

      {iterations.length > 0 && (
        <section className="calculadora-nolineal__iterations">
          <h2>Iteraciones</h2>
          <div className="calculadora-nolineal__table-scroll" tabIndex={0} role="region" aria-label="Tabla de iteraciones">
            <table className="calculadora-nolineal__iterations-table">

              <thead>
                <tr>
                  <th scope="col">
                    <MathJax inline>
                      {String.raw`\(n\)`}
                    </MathJax>
                  </th>

                  <th scope="col">
                    <MathJax inline>
                      {String.raw`\(a\)`}
                    </MathJax>
                  </th>

                  <th scope="col">
                    <MathJax inline>
                      {String.raw`\(c\)`}
                    </MathJax>
                  </th>

                  <th scope="col">
                    <MathJax inline>
                      {String.raw`\(b\)`}
                    </MathJax>
                  </th>

                  <th scope="col">
                    <MathJax inline>
                      {String.raw`\(f(a)\)`}
                    </MathJax>
                  </th>

                  <th scope="col">
                    <MathJax inline>
                      {String.raw`\(f(c)\)`}
                    </MathJax>
                  </th>

                  <th scope="col">
                    <MathJax inline>
                      {String.raw`\(f(b)\)`}
                    </MathJax>
                  </th>
                </tr>
              </thead>

              <tbody>
                {iterations.map(
                  ({ a, b, c, fa, fb, fc }, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{Number(a.toFixed(decimals))}</td>
                      <td>{Number(c.toFixed(decimals))}</td>
                      <td>{Number(b.toFixed(decimals))}</td>
                      <td>{Number(fa.toFixed(decimals))}</td>
                      <td>{Number(fc.toFixed(decimals))}</td>
                      <td>{Number(fb.toFixed(decimals))}</td>
                    </tr>
                  )
                )}
              </tbody>

            </table>
          </div>
        </section>
      )}
    </CalculadoraNoLineal>
  );
}

export default Biseccion;
