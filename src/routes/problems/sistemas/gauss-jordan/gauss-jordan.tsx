
import { resizeMatrix } from "@/functions/matix-size";
import { useState } from "react";
import './gauss-jorda.scss'

function GaussJordan() {
    const [matrix, setMatrix] = useState<number[][]>([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]);

    const [size, setSize] = useState(3);

    function handleSizeChange(value: number) {
        if (!Number.isInteger(value) || value < 3 || value > 50) return;

        setMatrix(resizeMatrix(matrix, value));
        setSize(value);
    }

    function handleMatrixChange(row: number, column: number, value: number) {
        const newMatrix = matrix.map((currentRow, i) =>
            currentRow.map((currentValue, j) =>
                i === row && j === column ? value : currentValue
            )
        );

        setMatrix(newMatrix);
    }

    return (
        <section className="gauss-jordan">

            <header className="gauss-jordan__header">
                <div>
                    <h1>Gauss-Jordan</h1>
                    <p>Resolución de sistemas de ecuaciones lineales</p>
                </div>
            </header>

            <div className="gauss-jordan__workspace">

                <aside className="gauss-jordan__controls">
                    <div>
                        <label htmlFor="matrix-size">
                            Tamaño de la matriz
                        </label>

                        <input
                            id="matrix-size"
                            type="number"
                            min={3}
                            max={50}
                            value={size}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                handleSizeChange(value);
                            }}
                        />

                        <small>Dimensiones permitidas: 3 × 3 a 50 × 50</small>
                    </div>
                </aside>

                <div className="gauss-jordan__matrix-container">

                    <div className="gauss-jordan__matrix-heading">
                        <h2>Matriz aumentada</h2>
                        <span>{size} × {size}</span>
                    </div>

                    <div className="gauss-jordan__matrix">
                        {matrix.map((row, i) => (
                            <div
                                className="gauss-jordan__matrix-row"
                                key={i}
                            >
                                {row.map((value, j) => (
                                    <input
                                        key={j}
                                        type="number"
                                        value={value}
                                        onChange={(e) =>
                                            handleMatrixChange(
                                                i,
                                                j,
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default GaussJordan;
