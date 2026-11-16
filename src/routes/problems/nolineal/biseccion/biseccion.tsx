
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

function equation(x: number) {
    return (-1 * (x + 1) ** 3 + 8 * x - 7);
}

function Biseccion() {
    const [iterations, setIterations] = useState<RowBisecType[]>([]);
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);
    const [sol, setSol] = useState(a);

    const intervalIsValid = a < b;
    // Valida si f(a) y f(b) tienen signos diferentes.
    const intervalHasSignChange = equation(a) * equation(b) < 0;
    const tolerance = 0.00001;
    const decimals = 6;

    function computeIterations() {
        const c1 = (a + b) / 2;
        const firstIteration: RowBisecType = {
            a: a, b: b, c: c1,
            fa: equation(a), fb: equation(b), fc: equation(c1),
            aChanged: false
        };

        let interations = [firstIteration];
        let i = 0;

        do {
            // Verificamos si f(a) y f(c) tienen signos contrarios.
            const acHasSignChange = interations[i].fa * interations[i].fc < 0;

            // Si es así, a mantiene su valor y b toma el valor intermedio c de la iteración anterior.
            // De lo contrario, b mantiene su valor y a toma el valor intermedio c de la iteración anterior.
            const newA = acHasSignChange ? interations[i].a : interations[i].c;
            const newB = acHasSignChange ? interations[i].c : interations[i].b;

            const newC = (newA + newB) / 2;
            const fa = equation(newA);
            const fb = equation(newB);
            const fc = equation(newC);

            const newItaration = {
                a: newA, b: newB, c: newC,
                fa: fa, fb: fb, fc: fc,
                aChanged: !acHasSignChange
            };

            interations.push(newItaration);
            i++;

            if (Math.abs(fc) < tolerance) {
                setSol(newC);
                break;
            }
        } while (i < 50);

        setIterations(interations);
    }

    return (
        <section className="bisection">
            <h1>MÉTODO DE BISECCIÓN</h1>

            <div className="bisection__interval-inputs">
                <h3>Intervalo inicial</h3>
                <label htmlFor="interval-a">a:</label>
                <input id="interval-a" value={a} onChange={(e) => setA(Number(e.target.value))} type="number" placeholder="0" />
                <label htmlFor="interval-b">b:</label>
                <input id="interval-b" value={b} onChange={(e) => setB(Number(e.target.value))} type="number" placeholder="0" />
            </div>

            <div className="bisection__interval-values">
                <span>f(a) = {equation(a)}</span>
                <span>f(b) = {equation(b)}</span>
            </div>

            <div className="bisection__calculation-controls">
                <button disabled={!(intervalIsValid && intervalHasSignChange)} onClick={computeIterations}>
                    Calcular
                </button>
                <span>{intervalIsValid ? "" : "Intervalo inválido: a debe ser menor que b"}</span>
                <span>{intervalHasSignChange || !intervalIsValid ? "" : "f(a) y f(b) tienen el mismo signo"}</span>
            </div>

            <div className="bisection__result">
              Resultado {"f(" + sol.toFixed(5) + ") = " + equation(sol).toFixed(6)}
            </div>
            {iterations.length > 0 &&
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
            }
        </section>
    );
}

export default Biseccion;
