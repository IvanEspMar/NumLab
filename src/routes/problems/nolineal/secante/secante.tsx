
import { useState } from "react";

interface RowNewtonType {
    x_nm1: number;
    x_n: number;
    x_np1: number;
    fx_n: number;
}
function equation(x: number) {
    return x ** 4 - 3 * x ** 3 + 2 * x - 5;
}

function equationSecan(x_n: number, x_nm1: number) {
    return x_n - equation(x_n) * ((x_n - x_nm1) / (equation(x_n) - equation(x_nm1)))
}

function Secante() {
    const [iterations, setIterations] = useState<RowNewtonType[]>([]);
    const [initialValue, setInitialValue] = useState("0");
    const [initialValue2, setInitialValue2] = useState("0");
    const tolerance = 0.00001;
    const decimals = 6;

    function computeIterations() {
        const x_0 = Number(initialValue)
        const x_1 = Number(initialValue2)
        const firstIteration:RowNewtonType = {x_nm1: x_0, x_n: x_1, x_np1: equationSecan(x_1, x_0), fx_n: equation(x_1)}
        let iterations = [firstIteration] 
        let i = 0
        do {
            const x_nm1 = iterations[i].x_n
            const x_n = iterations[i].x_np1
            const x_np1 = equationSecan(x_n, x_nm1)
            const fx_n = equation(x_n);
            iterations.push({x_nm1: x_nm1, x_n: x_n,  x_np1: x_np1, fx_n: fx_n})
            i++
            if(Math.abs(equation(iterations[i].x_n)) < tolerance)
                break
        } while (i < 99)
        setIterations(iterations)
    }

    return (
        <section className="newton">
            <h1>MÉTODO DE LA SECANTE<span className="punto">.</span></h1>

            <div className="newton__interval-inputs">
                <h3>Valor inicial de x_0</h3>
                <label htmlFor="interval-a">a:</label>
                <input id="interval-a" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} type="number" placeholder="1" />
            </div>
             <div className="newton__interval-inputs">
                <h3>Valor inicial de x_1</h3>
                <label htmlFor="interval-a">a:</label>
                <input id="interval-a" value={initialValue2} onChange={(e) => setInitialValue2(e.target.value)} type="number" placeholder="1" />
            </div>
            <div className="newton__calculation-controls">
                <button onClick={computeIterations}>
                    Calcular
                </button>
            </div>
            {iterations.length > 0 &&
                <table className="newton__iterations-table">
                    <thead>
                        <tr>
                            <th>n</th>
                            <th>x_n-1</th>
                            <th>x_n</th>
                            <th>f(x_n)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {iterations.map(({x_n, x_nm1, x_np1, fx_n}, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{Number(x_nm1.toFixed(decimals))}</td>
                                <td>{Number(x_n.toFixed(decimals))}</td>
                                <td>{Number(fx_n.toFixed(decimals))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </section>
    );
}

export default Secante;
