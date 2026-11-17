
import { compile, derivative } from "mathjs";
import { useState } from "react";
import "./newton.scss";

interface RowNewtonType {
    x_n: number;
    fx_n: number;
    dfx_n: number;
}

function Newton() {
    const [iterations, setIterations] = useState<RowNewtonType[]>([]);
    const [equationText, setEquationText] = useState("x^4 - 3x^3 + 2x - 5");
    const [equationIsValid, setEquationIsValid] = useState(false);

    const [initialValue, setInitialValue] = useState("0");
    const [sol, setSol] = useState<number | null>(null);
    const [calculationMessage, setCalculationMessage] = useState("");

    const tolerance = 0.00001;
    const decimals = 6;
    const maxIterations = 100;

    function validateEquation() {
        try {
            const compiledEquation = compile(equationText);
            const derivedEquation = compile(
                derivative(equationText, "x").toString()
            );

            const testF = compiledEquation.evaluate({ x: 1 });
            const testDF = derivedEquation.evaluate({ x: 1 });

            if (
                typeof testF !== "number" ||
                typeof testDF !== "number" ||
                !Number.isFinite(testF) ||
                !Number.isFinite(testDF)
            ) {
                throw new Error("Expresión no válida");
            }

            setEquationIsValid(true);
            setIterations([]);
            setSol(null);
            setCalculationMessage("");

        } catch (error) {
            setEquationIsValid(false);
            setIterations([]);
            setSol(null);
            setCalculationMessage("La función introducida no es válida.");
        }
    }

    function equation(x: number): number {
        return compile(equationText).evaluate({ x });
    }

    function equationD(x: number): number {
        const derivedEquation = derivative(equationText, "x");
        return compile(derivedEquation.toString()).evaluate({ x });
    }

    function computeIterations() {
        const x0 = Number(initialValue);

        if (initialValue.trim() === "" || !Number.isFinite(x0)) {
            setCalculationMessage("Ingresa un valor inicial válido.");
            return;
        }

        let currentX = x0;
        const newIterations: RowNewtonType[] = [];

        setSol(null);
        setCalculationMessage("");

        try {
            for (let i = 0; i < maxIterations; i++) {
                const fx = equation(currentX);
                const dfx = equationD(currentX);

                if (!Number.isFinite(fx) || !Number.isFinite(dfx)) {
                    setCalculationMessage(
                        "Se obtuvo un resultado no válido durante el cálculo."
                    );
                    break;
                }

                newIterations.push({
                    x_n: currentX,
                    fx_n: fx,
                    dfx_n: dfx
                });

                if (Math.abs(fx) < tolerance) {
                    setSol(currentX);
                    break;
                }

                if (dfx === 0) {
                    setCalculationMessage(
                        "La derivada es cero. No se puede continuar."
                    );
                    break;
                }

                const xNext = currentX - (fx / dfx);

                if (!Number.isFinite(xNext)) {
                    setCalculationMessage(
                        "La siguiente aproximación no es válida."
                    );
                    break;
                }

                currentX = xNext;

                if (i === maxIterations - 1) {
                    setSol(currentX);
                    setCalculationMessage(
                        "Se alcanzó el máximo de iteraciones."
                    );
                }
            }

        } catch (error) {
            setCalculationMessage(
                "Ocurrió un error al evaluar la función."
            );
        }

        setIterations(newIterations);
    }

    return (
        <section className="newton">

            <div className="newton__introduction">
                <h1>MÉTODO DE NEWTON-RAPHSON</h1>
                <button className="start-button">Más detalles</button>
            </div>

            <div className="newton__equation-input">
                <label>Ingresa una ecuación válida</label>

                <div>
                    <input
                        type="text"
                        value={equationText}
                        onChange={(e) => {
                            setEquationText(e.target.value);
                            setEquationIsValid(false);
                            setIterations([]);
                            setSol(null);
                            setCalculationMessage("");
                        }}
                        placeholder="x^2 + 5x"
                    />

                    <button onClick={validateEquation}>
                        Validar función
                    </button>
                </div>
            </div>

            {equationIsValid && (
                <>
                    <div className="newton__interval-inputs">
                        <h3>Valor inicial</h3>

                        <label htmlFor="initial-value">x₀:</label>

                        <input
                            id="initial-value"
                            value={initialValue}
                            onChange={(e) => {
                                setInitialValue(e.target.value);
                                setIterations([]);
                                setSol(null);
                                setCalculationMessage("");
                            }}
                            type="number"
                            placeholder="1"
                        />
                    </div>

                    <div className="newton__calculation-controls">
                        <button onClick={computeIterations}>
                            Calcular
                        </button>

                        <span>{calculationMessage}</span>
                    </div>

                    {sol !== null && (
                        <div className="newton__result">
                            Resultado: x = {sol.toFixed(decimals)}
                            {" | "}
                            f(x) = {equation(sol).toFixed(decimals)}
                        </div>
                    )}

                    {iterations.length > 0 && (
                        <table className="newton__iterations-table">
                            <thead>
                                <tr>
                                    <th>n</th>
                                    <th>xₙ</th>
                                    <th>f(xₙ)</th>
                                    <th>f'(xₙ)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {iterations.map(({ x_n, fx_n, dfx_n }, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{Number(x_n.toFixed(decimals))}</td>
                                        <td>{Number(fx_n.toFixed(decimals))}</td>
                                        <td>{Number(dfx_n.toFixed(decimals))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </section>
    );
}

export default Newton;
