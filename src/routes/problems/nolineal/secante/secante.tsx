import { CalculadoraNoLineal, ResultadoNoLineal } from "../calculadora-nolineal";

import { compile, parse } from "mathjs";
import { useState } from "react";

interface RowSecantType {
    x_nm1: number;
    x_n: number;
    x_np1: number | null;
    fx_n: number;
}

function Secante() {
    const [iterations, setIterations] = useState<RowSecantType[]>([]);
    const [equationText, setEquationText] = useState("x^4 - 3x^3 + 2x - 5");
    const [equationLatex, setEquationLatex] = useState<string | null>(null);

    const [initialValue, setInitialValue] = useState("0");
    const [initialValue2, setInitialValue2] = useState("1");

    const [sol, setSol] = useState<number | null>(null);
    const [calculationMessage, setCalculationMessage] = useState("");

    const tolerance = 0.00001;
    const decimals = 6;
    const maxIterations = 100;

    function resetResults() {
        setIterations([]);
        setSol(null);
        setCalculationMessage("");
    }

    function validateEquation() {
        try {
            const expression = parse(equationText);
            const compiledEquation = expression.compile();
            const testF = compiledEquation.evaluate({ x: 1 });

            if (
                typeof testF !== "number" ||
                !Number.isFinite(testF)
            ) {
                throw new Error("Expresión no válida");
            }

            setEquationLatex(expression.toTex());
            resetResults();

        } catch {
            setEquationLatex(null);
            resetResults();
            setCalculationMessage(
                "La función introducida no es válida."
            );
        }
    }

    function equation(x: number): number {
        const result = compile(equationText).evaluate({ x });

        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {
            throw new Error("Resultado no válido");
        }

        return result;
    }

    function computeIterations() {
        const x0 = Number(initialValue);
        const x1 = Number(initialValue2);

        resetResults();

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
                setSol(previousX);
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

                    setSol(currentX);
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
                        setSol(currentX);
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

    return (
        <CalculadoraNoLineal
            title="MÉTODO DE LA SECANTE"
            introductionPath="/nolineal/secante"
            equationText={equationText}
            equationLatex={equationLatex}
            validationMessage={calculationMessage}
            onEquationChange={(value) => {
                setEquationText(value);
                setEquationLatex(null);
                resetResults();
            }}
            onValidate={validateEquation}
            parameters={(
                <>
                    <div className="calculadora-nolineal__interval-inputs">
                        <h3>Valores iniciales</h3>

                        <label htmlFor="initial-value">
                            x₀:
                        </label>

                        <input
                            id="initial-value"
                            value={initialValue}
                            onChange={(e) => {
                                setInitialValue(e.target.value);
                                resetResults();
                            }}
                            type="number"
                            step="any"
                            placeholder="0"
                        />

                        <label htmlFor="initial-value-2">
                            x₁:
                        </label>

                        <input
                            id="initial-value-2"
                            value={initialValue2}
                            onChange={(e) => {
                                setInitialValue2(e.target.value);
                                resetResults();
                            }}
                            type="number"
                            step="any"
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
                            <thead>
                                <tr>
                                    <th scope="col">n</th>
                                    <th scope="col">xₙ₋₁</th>
                                    <th scope="col">xₙ</th>
                                    <th scope="col">xₙ₊₁</th>
                                    <th scope="col">f(xₙ)</th>
                                </tr>
                            </thead>

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
