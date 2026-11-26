import { parseDecimal } from "@/functions/parse-decimal";
import { CalculadoraNoLineal, EncabezadosIteraciones, EntradaDecimal, ResultadoNoLineal } from "../calculadora-nolineal";

import { parse, type EvalFunction } from "mathjs";
import { MathJax } from "better-react-mathjax";
import { useMemo, useState } from "react";
import { createInputGraph, createSolutionGraph, evaluateGraphValue, isNumericExpression, type GraphData } from "../grafica-modelo";

interface RowBisecType {
  a: number;
  b: number;
  c: number;
  fa: number;
  fb: number;
  fc: number;
  aChanged: boolean;
}

function midpoint(a: number, b: number): number {
  const width = b - a;
  return Number.isFinite(width) ? a + width / 2 : a / 2 + b / 2;
}

function bracketApproachesZero(evaluate: GraphData["evaluate"], row: RowBisecType, tolerance: number): boolean {
  let { a, b, fa, fb } = row;
  const initialMagnitude = Math.max(Math.abs(fa), Math.abs(fb));
  for (let refinement = 0; refinement < 6; refinement++) {
    const c = midpoint(a, b);
    if (c === a || c === b) break;
    const fc = evaluate(c);
    if (fc === null) return false;
    if (Math.abs(fc) < tolerance) return true;
    if ((fa < 0) !== (fc < 0)) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }
  return Math.max(Math.abs(fa), Math.abs(fb)) < initialMagnitude * 0.9;
}

function Biseccion() {

  const [iterations, setIterations] = useState<RowBisecType[]>([]);
  const [equationText, setEquationText] = useState("2x^2 - 7");
  const [validatedFunction, setValidatedFunction] = useState<{ value: EvalFunction; latex: string } | null>(null);

  const [aInput, setAInput] = useState("0");
  const [bInput, setBInput] = useState("0");

  const [sol, setSol] = useState<{ x: number; fx: number } | null>(null);
  const [solutionGraph, setSolutionGraph] = useState<GraphData | null>(null);
  const [calculationMessage, setCalculationMessage] = useState("");

  const tolerance = 0.00001;
  const decimals = 6;
  const maxIterations = 50;

  const a = parseDecimal(aInput);
  const b = parseDecimal(bInput);
  const inputGraph = useMemo(() => validatedFunction && createInputGraph(validatedFunction.value, {
    method: "biseccion", a, b,
  }), [validatedFunction, a, b]);

  const intervalIsValid =
    Number.isFinite(a) &&
    Number.isFinite(b) &&
    a < b;

  function resetResults() {
    setIterations([]);
    setSol(null);
    setCalculationMessage("");
  }

  function validateEquation() {
    resetResults();

    try {
      const parsedEquation = parse(equationText);
      const compiledEquation = parsedEquation.compile();
      if (!isNumericExpression(compiledEquation, [a, b])) {
        throw new Error("La función no devuelve un número válido");
      }

      setValidatedFunction({ value: compiledEquation, latex: parsedEquation.toTex() });

    } catch {
      setValidatedFunction(null);
      setCalculationMessage("La función introducida no es válida.");
    }
  }

  const fa = validatedFunction ? evaluateGraphValue(validatedFunction.value, a) : null;
  const fb = validatedFunction ? evaluateGraphValue(validatedFunction.value, b) : null;

  const intervalHasSignChange =
    intervalIsValid &&
    fa !== null &&
    fb !== null &&
    fa !== 0 && fb !== 0 && (fa < 0) !== (fb < 0);

  function computeIterations() {
    if (!intervalHasSignChange || !inputGraph) return;

    resetResults();
    setSolutionGraph(null);

    let currentA = a;
    let currentB = b;

    const newIterations: RowBisecType[] = [];

    for (let i = 0; i < maxIterations; i++) {

      const currentC = midpoint(currentA, currentB);

      const fa = inputGraph.evaluate(currentA);
      const fb = inputGraph.evaluate(currentB);
      const fc = inputGraph.evaluate(currentC);

      if (fa === null || fb === null || fc === null) {
        setCalculationMessage(
          "Se obtuvo un resultado no válido durante el cálculo."
        );
        break;
      }

      const acHasSignChange = (fa < 0) !== (fc < 0);

      const row = {
        a: currentA,
        b: currentB,
        c: currentC,
        fa,
        fb,
        fc,
        aChanged: !acHasSignChange
      };
      newIterations.push(row);

      const residualConverged = Math.abs(fc) < tolerance;
      if (residualConverged || Math.abs(currentB - currentA) / 2 < tolerance) {
        if (residualConverged || bracketApproachesZero(inputGraph.evaluate, row, tolerance)) {
          setSol({ x: currentC, fx: fc });
          setSolutionGraph(createSolutionGraph(inputGraph, currentC));
        } else {
          setCalculationMessage("El intervalo se redujo sin aproximarse a una raíz. Revisa si la función es continua en el intervalo.");
        }
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
      equationLatex={validatedFunction?.latex ?? null}
      validationMessage={calculationMessage}
      onEquationChange={(value) => {
        setEquationText(value);
        setValidatedFunction(null);
        resetResults();
      }}
      onValidate={validateEquation}
      inputGraph={inputGraph}
      solutionGraph={solutionGraph}
      graphHint="Ingresa un intervalo válido con a menor que b."
      parameters={(
        <>
          <div className="calculadora-nolineal__interval-inputs">

            <h3>Intervalo inicial</h3>

            <label htmlFor="interval-a">
              <MathJax inline>
                {String.raw`\(a:\)`}
              </MathJax>
            </label>

            <EntradaDecimal
              id="interval-a"
              value={aInput}
              onValueChange={(value) => {
                setAInput(value);
                resetResults();
              }}
              placeholder="0"
            />

            <label htmlFor="interval-b">
              <MathJax inline>
                {String.raw`\(b:\)`}
              </MathJax>
            </label>

            <EntradaDecimal
              id="interval-b"
              value={bInput}
              onValueChange={(value) => {
                setBInput(value);
                resetResults();
              }}
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
          x={sol.x.toFixed(decimals)}
          fx={sol.fx.toFixed(decimals)}
        />
      )}

      {iterations.length > 0 && (
        <section className="calculadora-nolineal__iterations">
          <h2>Iteraciones</h2>
          <div className="calculadora-nolineal__table-scroll" tabIndex={0} role="region" aria-label="Tabla de iteraciones">
            <table className="calculadora-nolineal__iterations-table">

              <EncabezadosIteraciones columns={["n", "a", "c", "b", "f(a)", "f(c)", "f(b)"]} />

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
