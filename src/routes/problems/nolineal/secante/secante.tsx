import { parseDecimal } from "@/functions/parse-decimal";
import { CalculadoraNoLineal, EncabezadosIteraciones, EntradaDecimal, ResultadoNoLineal } from "../calculadora-nolineal";

import { parse, type EvalFunction } from "mathjs";
import { useMemo, useState } from "react";
import { createInputGraph, createSolutionGraph, evaluateGraphValue, isNumericExpression, type GraphData } from "../grafica-modelo";

interface RowSecantType {
    x_nm1: number;
    x_n: number;
    x_np1: number | null;
    fx_n: number;
}

function Secante() {
    const [iterations, setIterations] = useState<RowSecantType[]>([]);
    const [equationText, setEquationText] = useState("x^4 - 3x^3 + 2x - 5");
    const [validatedFunction, setValidatedFunction] = useState<{ value: EvalFunction; latex: string } | null>(null);

    const [initialValue, setInitialValue] = useState("0");
    const [initialValue2, setInitialValue2] = useState("1");

    const [sol, setSol] = useState<number | null>(null);
    const [solutionGraph, setSolutionGraph] = useState<GraphData | null>(null);
    const [calculationMessage, setCalculationMessage] = useState("");

    const tolerance = 0.00001;
    const decimals = 6;
    const maxIterations = 100;
    const x0 = parseDecimal(initialValue);
    const x1 = parseDecimal(initialValue2);
    const inputGraph = useMemo(() => validatedFunction && createInputGraph(validatedFunction.value, {
        method: "secante", x0, x1,
    }), [validatedFunction, x0, x1]);

    function resetResults() {
        setIterations([]);
        setSol(null);
        setCalculationMessage("");
    }

    function validateEquation() {
        try {
            const expression = parse(equationText);
            const compiledEquation = expression.compile();
            if (!isNumericExpression(compiledEquation, [x0, x1])) {
                throw new Error("Expresión no válida");
            }

            setValidatedFunction({ value: compiledEquation, latex: expression.toTex() });
            resetResults();

        } catch {
            setValidatedFunction(null);
            resetResults();
            setCalculationMessage(
                "La función introducida no es válida."
            );
        }
    }

    function equation(x: number): number {
        const result = validatedFunction ? evaluateGraphValue(validatedFunction.value, x) : null;
        if (result === null) {
            throw new Error("Resultado no válido");
        }

        return result;
    }

    function computeIterations() {
        resetResults();
        setSolutionGraph(null);

        if (
            initialValue.trim() === "" ||
            initialValue2.trim() === "" ||
            !Number.isFinite(x0) ||
            !Number.isFinite(x1)
        ) {
            setCalculationMessage(
                "Ingresa valores iniciales válidos."
            );
            return;
        }

        if (x0 === x1) {
            setCalculationMessage(
                "Los valores iniciales deben ser diferentes."
            );
            return;
        }

        let previousX = x0;
        let currentX = x1;

        const newIterations: RowSecantType[] = [];

        try {
            let previousFx = equation(previousX);
            let currentFx = equation(currentX);

            if (Math.abs(previousFx) < tolerance) {
                recordSolution(previousX);
                return;
            }

            for (let i = 0; i < maxIterations; i++) {

                if (Math.abs(currentFx) < tolerance) {
                    newIterations.push({
                        x_nm1: previousX,
                        x_n: currentX,
                        x_np1: null,
                        fx_n: currentFx
                    });

                    recordSolution(currentX);
                    break;
                }

                const denominator = currentFx - previousFx;

                if (denominator === 0) {
                    setCalculationMessage(
                        "El denominador es cero. No se puede continuar."
                    );
                    break;
                }

                const nextX = currentX -
                    currentFx * (
                        (currentX - previousX) / denominator
                    );

                if (!Number.isFinite(nextX)) {
                    setCalculationMessage(
                        "La siguiente aproximación no es válida."
                    );
                    break;
                }

                newIterations.push({
                    x_nm1: previousX,
                    x_n: currentX,
                    x_np1: nextX,
                    fx_n: currentFx
                });

                previousX = currentX;
                previousFx = currentFx;

                currentX = nextX;
                currentFx = equation(currentX);

                if (i === maxIterations - 1) {
                    if (Math.abs(currentFx) < tolerance) {
                        recordSolution(currentX);
                    } else {
                        setCalculationMessage(
                            "Se alcanzó el máximo de iteraciones sin converger."
                        );
                    }
                }
            }

        } catch {
            setCalculationMessage(
                "Ocurrió un error al evaluar la función."
            );
        }

        setIterations(newIterations);
    }

    function recordSolution(root: number) {
        setSol(root);
        if (inputGraph) setSolutionGraph(createSolutionGraph(inputGraph, root));
    }

    return (
        <CalculadoraNoLineal
            title="MÉTODO DE LA SECANTE"
            introductionPath="/nolineal/secante"
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
            parameters={(
                <>
                    <div className="calculadora-nolineal__interval-inputs">
                        <h3>Valores iniciales</h3>

                        <label htmlFor="initial-value">
                            x₀:
                        </label>

                        <EntradaDecimal
                            id="initial-value"
                            value={initialValue}
                            onValueChange={(value) => {
                                setInitialValue(value);
                                resetResults();
                            }}
                            placeholder="0"
                        />

                        <label htmlFor="initial-value-2">
                            x₁:
                        </label>

                        <EntradaDecimal
                            id="initial-value-2"
                            value={initialValue2}
                            onValueChange={(value) => {
                                setInitialValue2(value);
                                resetResults();
                            }}
                            placeholder="1"
                        />
                    </div>

                    <div className="calculadora-nolineal__calculation-controls">
                        <button onClick={computeIterations}>
                            Calcular
                        </button>

                        <span role="status">{calculationMessage}</span>
                    </div>
                </>
            )}
        >
            {sol !== null && (
                <ResultadoNoLineal
                    x={sol.toFixed(decimals)}
                    fx={equation(sol).toFixed(decimals)}
                />
            )}

            {iterations.length > 0 && (
                <section className="calculadora-nolineal__iterations">
                    <h2>Iteraciones</h2>
                    <div className="calculadora-nolineal__table-scroll" tabIndex={0} role="region" aria-label="Tabla de iteraciones">
                        <table className="calculadora-nolineal__iterations-table">
                            <EncabezadosIteraciones columns={["n", "x_{n-1}", "x_n", "x_{n+1}", "f(x_n)"]} />

                            <tbody>
                                {iterations.map(
                                    ({ x_nm1, x_n, x_np1, fx_n }, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>
                                                {Number(x_nm1.toFixed(decimals))}
                                            </td>
                                            <td>
                                                {Number(x_n.toFixed(decimals))}
                                            </td>
                                            <td>
                                                {x_np1 !== null
                                                    ? Number(x_np1.toFixed(decimals))
                                                    : "—"}
                                            </td>
                                            <td>
                                                {Number(fx_n.toFixed(decimals))}
                                            </td>
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

export default Secante;
