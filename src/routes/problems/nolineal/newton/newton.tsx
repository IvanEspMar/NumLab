
import { useState } from "react";
import './newton.scss'

interface RowNewtonType {
    x_n: number;
    fx_n: number;
    dfx_n: number;
}
function equation(x: number) {
    return x ** 4 - 3 * x ** 3 + 2 * x - 5;
}

function equationD(x: number) {
    return 4 * x ** 3 - 9 * x ** 2 + 2;
}

function Newton() {
    const [iterations, setIterations] = useState<RowNewtonType[]>([]);
    const [initialValue, setInitialValue] = useState("0");
    const tolerance = 0.00001;
    const decimals = 6;

    function computeIterations() {
        const x_0 = Number(initialValue)
        const firstIteration:RowNewtonType = {x_n: x_0, fx_n: equation(x_0), dfx_n: equationD(x_0)}
        let iterations = [firstIteration] 
        let i = 0
        do {
            const x_n = iterations[i].x_n
            const f_n = equation(x_n)
            const df_n = equationD(x_n)
            const x_np1 = x_n - (f_n / df_n)
            const f_np1 = equation(x_np1)
            const df_np1 = equationD(x_np1) 
            iterations.push({x_n: x_np1, fx_n: f_np1, dfx_n: df_np1})
            i++
            if(Math.abs(iterations[i].fx_n) < tolerance)
                break
        } while (i < 100)
        setIterations(iterations)
    }

    return (
        <section className="newton">
            <h1>MÉTODO DE NEWTON RAPHSON<span className="punto">.</span></h1>

            <div className="newton__interval-inputs">
                <h3>Valor inicial</h3>
                <label htmlFor="interval-a">a:</label>
                <input id="interval-a" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} type="number" placeholder="1" />
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
                            <th>x_n</th>
                            <th>f(x_n)</th>
                            <th>f'(x_n)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {iterations.map(({x_n,fx_n, dfx_n}, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
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

export default Newton;
