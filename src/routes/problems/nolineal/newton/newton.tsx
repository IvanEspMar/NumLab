
import { useState } from "react";

interface RowNewtonType {
    x_n: number;
    fx_n: number;
    dfx_n: number;
}
function equation(x: number) {
    return (-1 * (x + 1) ** 3 + 8 * x - 7);
}

function Biseccion() {
    const [iterations, setIterations] = useState<RowNewtonType[]>([]);
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);
    const [sol, setSol] = useState(a);

    const intervalIsValid = a < b;
    // Valida si f(a) y f(b) tienen signos diferentes.
    const intervalHasSignChange = equation(a) * equation(b) < 0;
    const tolerance = 0.00001;
    const decimals = 6;

    function computeIterations() {
    }

    return (
        <section className="newton">
            <h1>MÉTODO DE BISECCIÓN</h1>

            <div className="newton__interval-inputs">
                <h3>Intervalo inicial</h3>
                <label htmlFor="interval-a">a:</label>
                <input id="interval-a" value={a} onChange={(e) => setA(Number(e.target.value))} type="number" placeholder="0" />
                <label htmlFor="interval-b">b:</label>
                <input id="interval-b" value={b} onChange={(e) => setB(Number(e.target.value))} type="number" placeholder="0" />
            </div>

            <div className="newton__interval-values">
                <span>f(a) = {equation(a)}</span>
                <span>f(b) = {equation(b)}</span>
            </div>

            <div className="newton__calculation-controls">
                <button disabled={!(intervalIsValid && intervalHasSignChange)} onClick={computeIterations}>
                    Calcular
                </button>
                <span>{intervalIsValid ? "" : "Intervalo inválido: a debe ser menor que b"}</span>
                <span>{intervalHasSignChange || !intervalIsValid ? "" : "f(a) y f(b) tienen el mismo signo"}</span>
            </div>

            <div className="newton__result">
              Resultado {"f(" + sol + ") = " + equation(sol)}
            </div>
            {iterations.length > 0 &&
                <table className="bisection__iterations-table">
                    <thead>
                        <tr>
                            <th>n</th>
                            <th>x_n</th>
                            <th>f(x_n)</th>
                            <th>f(x_n)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {iterations.map(({x_n,fx_n, dfx_n}, i) => (
                            <tr key={i}>
                                <td>{i}</td>
                                <td>{Number(x_n.toFixed(decimals))}</td>
                                <td>{Number(fx_n.toFixed(decimals))}</td>
                                <td>{Number(dfx_n.toFixed(decimals))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </section>
    );
}

export default Biseccion;
