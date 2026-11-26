import { parseDecimal } from "@/functions/parse-decimal";
import { CalculadoraNoLineal, EncabezadosIteraciones, EntradaDecimal, ResultadoNoLineal } from "../calculadora-nolineal";
import { derivative, parse, type EvalFunction } from "mathjs";
import { useMemo, useState } from "react";
import { createInputGraph, createSolutionGraph, type GraphData } from "../grafica-modelo";

interface NewtonIteration {
    x: number;
    fx: number;
    slope: number;
    nextX: number;
}

interface NewtonFunction {
    value: EvalFunction;
    derivative: EvalFunction;
    latex: string;
}

const tolerance = 0.00001;
const decimals = 6;
const maxIterations = 100;

function evaluateReal(expression: EvalFunction, x: number): number {
    const result = expression.evaluate({ x });
    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("La evaluación debe producir un número real y finito.");
    }
    return result;
}

export default function Newton() {
    const [equationText, setEquationText] = useState("x^4 - 3x^3 + 2x - 5");
    const [validatedFunction, setValidatedFunction] = useState<NewtonFunction | null>(null);
    const [initialValue, setInitialValue] = useState("3");
    const [iterations, setIterations] = useState<NewtonIteration[]>([]);
    const [solution, setSolution] = useState<{ x: number; fx: number } | null>(null);
    const [solutionGraph, setSolutionGraph] = useState<GraphData | null>(null);
    const [calculationMessage, setCalculationMessage] = useState("");
    const initialX = parseDecimal(initialValue);
    const inputGraph = useMemo(() => validatedFunction && createInputGraph(validatedFunction.value, {
        method: "newton", x: initialX, derivative: validatedFunction.derivative,
    }), [validatedFunction, initialX]);

    function resetResults() {
        setIterations([]);
        setSolution(null);
        setCalculationMessage("");
    }

    function validateEquation() {
        resetResults();

        try {
            const expression = parse(equationText);
            setValidatedFunction({
                value: expression.compile(),
                derivative: derivative(expression, "x").compile(),
                latex: expression.toTex(),
            });
        } catch {
            setValidatedFunction(null);
            setCalculationMessage("Ingresa una función válida que se pueda derivar respecto a x.");
        }
    }

    function computeIterations() {
        if (!validatedFunction) return;

        resetResults();
        setSolutionGraph(null);

        let x = initialX;
        if (initialValue.trim() === "" || !Number.isFinite(x)) {
            setCalculationMessage("Ingresa un valor inicial válido.");
            return;
        }

        const rows: NewtonIteration[] = [];
        let message = "Se alcanzó el máximo de iteraciones sin converger.";

        for (let step = 0; step <= maxIterations; step++) {
            let fx: number;
            try {
                fx = evaluateReal(validatedFunction.value, x);
            } catch {
                message = "No se pudo evaluar la función en la aproximación actual.";
                break;
            }

            if (Math.abs(fx) < tolerance) {
                setSolution({ x, fx });
                if (inputGraph) setSolutionGraph(createSolutionGraph(inputGraph, x));
                message = "";
                break;
            }
            if (step === maxIterations) break;

            let slope: number;
            try {
                slope = evaluateReal(validatedFunction.derivative, x);
            } catch {
                message = "No se pudo evaluar la derivada en la aproximación actual.";
                break;
            }

            if (slope === 0) {
                message = "La derivada es cero en la aproximación actual.";
                break;
            }

            const nextX = x - fx / slope;
            if (!Number.isFinite(nextX)) {
                message = "La siguiente aproximación no es finita.";
                break;
            }
            if (nextX === x) {
                message = "La aproximación dejó de cambiar sin alcanzar la tolerancia.";
                break;
            }

            rows.push({ x, fx, slope, nextX });
            x = nextX;
        }

        setIterations(rows);
        setCalculationMessage(message);
    }

    return (
        <CalculadoraNoLineal
            title="MÉTODO DE NEWTON-RAPHSON"
            introductionPath="/nolineal/newton"
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
                        <h3>Valor inicial</h3>
                        <label htmlFor="newton-initial-value">x₀:</label>
                        <EntradaDecimal
                            id="newton-initial-value"
                            value={initialValue}
                            onValueChange={(value) => {
                                setInitialValue(value);
                                resetResults();
                            }}
                        />
                    </div>

                    <div className="calculadora-nolineal__calculation-controls">
                        <button onClick={computeIterations}>Calcular</button>
                        <span role="status">{calculationMessage}</span>
                    </div>
                </>
            )}
        >
            {solution && (
                <ResultadoNoLineal
                    x={solution.x.toFixed(decimals)}
                    fx={solution.fx.toFixed(decimals)}
                />
            )}

            {iterations.length > 0 && (
                <section className="calculadora-nolineal__iterations">
                    <h2>Iteraciones</h2>
                    <div className="calculadora-nolineal__table-scroll" tabIndex={0} role="region" aria-label="Tabla de iteraciones">
                        <table className="calculadora-nolineal__iterations-table">
                            <EncabezadosIteraciones columns={["n", "x_n", "f(x_n)", "f'(x_n)", "x_{n+1}"]} />
                            <tbody>
                                {iterations.map(({ x, fx, slope, nextX }, step) => (
                                    <tr key={step}>
                                        <td>{step}</td>
                                        <td>{Number(x.toFixed(decimals))}</td>
                                        <td>{Number(fx.toFixed(decimals))}</td>
                                        <td>{Number(slope.toFixed(decimals))}</td>
                                        <td>{Number(nextX.toFixed(decimals))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </CalculadoraNoLineal>
    );
}
