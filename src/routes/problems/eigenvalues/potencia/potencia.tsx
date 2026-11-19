import { useState } from "react";
import "./potencia.scss";

const MIN_SIZE = 2;
const MAX_SIZE = 8;
const DECIMALS = 6;

type Iteration = {
  index: number;
  values: number[];
  lambda: number;
  error: number | null;
  residual: number;
};

type Result = {
  eigenvalue: number;
  eigenvector: number[];
  iterations: Iteration[];
  converged: boolean;
  residual: number;
};

const EXAMPLE_MATRIX = [
  ["2", "1", "0"],
  ["1", "2", "1"],
  ["0", "1", "2"],
];

const EXAMPLE_SIGNS = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];

const EXAMPLE_VECTOR = ["1", "1", "1"];
const EXAMPLE_VECTOR_SIGNS = [1, 1, 1];

function createMatrix(size: number): string[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ""),
  );
}

function createSigns(size: number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 1),
  );
}

function createVector(size: number): string[] {
  return Array.from({ length: size }, () => "");
}

function formatNumber(value: number): string {
  return Number(value.toFixed(DECIMALS)).toString();
}

function norm(vector: number[]): number {
  return Math.sqrt(vector.reduce((sum, value) => sum + value ** 2, 0));
}

function dot(a: number[], b: number[]): number {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

function multiplyMatrix(A: number[][], x: number[]): number[] {
  return A.map((row) => dot(row, x));
}

function normInfinity(vector: number[]): number {
  return Math.max(...vector.map((value) => Math.abs(value)));
}

function solvePower(
  matrix: number[][],
  initial: number[],
  tolerance: number,
  maxIterations: number,
): Result | null {
  const initialNorm = norm(initial);

  if (initialNorm === 0) return null;

  let current = initial.map((value) => value / initialNorm);
  let previousLambda: number | null = null;

  const iterations: Iteration[] = [];

  for (let index = 1; index <= maxIterations; index++) {
    const product = multiplyMatrix(matrix, current);
    const productNorm = norm(product);

    if (productNorm === 0 || !Number.isFinite(productNorm)) {
      return null;
    }

    const next = product.map((value) => value / productNorm);
    const Ax = multiplyMatrix(matrix, next);

    const lambda = dot(next, Ax) / dot(next, next);

    if (!Number.isFinite(lambda)) return null;

    const residual = normInfinity(
      Ax.map((value, i) => value - lambda * next[i]),
    );

    const error =
      previousLambda === null ? null : Math.abs(lambda - previousLambda);

    iterations.push({
      index,
      values: [...next],
      lambda,
      error,
      residual,
    });

    const converged =
      error !== null && error <= tolerance && residual <= tolerance;

    current = next;

    if (converged) {
      return {
        eigenvalue: lambda,
        eigenvector: current,
        iterations,
        converged: true,
        residual,
      };
    }

    previousLambda = lambda;
  }

  const last = iterations[iterations.length - 1];

  return {
    eigenvalue: last.lambda,
    eigenvector: last.values,
    iterations,
    converged: false,
    residual: last.residual,
  };
}

function Potencia() {
  const [size, setSize] = useState(3);

  const [matrix, setMatrix] = useState<string[][]>(EXAMPLE_MATRIX);

  const [signs, setSigns] = useState<number[][]>(EXAMPLE_SIGNS);

  const [vector, setVector] = useState<string[]>(EXAMPLE_VECTOR);

  const [vectorSigns, setVectorSigns] =
    useState<number[]>(EXAMPLE_VECTOR_SIGNS);

  const [tolerance, setTolerance] = useState("0.000001");
  const [maxIterations, setMaxIterations] = useState("100");

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function loadExample() {
    setSize(3);
    setMatrix(EXAMPLE_MATRIX.map((row) => [...row]));
    setSigns(EXAMPLE_SIGNS.map((row) => [...row]));
    setVector([...EXAMPLE_VECTOR]);
    setVectorSigns([...EXAMPLE_VECTOR_SIGNS]);
    setTolerance("0.000001");
    setMaxIterations("100");
    setResult(null);
    setError("");
  }

  function clearMatrix() {
    setMatrix(createMatrix(size));
    setSigns(createSigns(size));
    setVector(createVector(size));
    setVectorSigns(Array(size).fill(1));
    setResult(null);
    setError("");
  }

  function resizeMatrix(newSize: number) {
    setMatrix((previous) =>
      Array.from({ length: newSize }, (_, i) =>
        Array.from({ length: newSize }, (_, j) => previous[i]?.[j] ?? ""),
      ),
    );

    setSigns((previous) =>
      Array.from({ length: newSize }, (_, i) =>
        Array.from({ length: newSize }, (_, j) => previous[i]?.[j] ?? 1),
      ),
    );

    setVector((previous) =>
      Array.from({ length: newSize }, (_, i) => previous[i] ?? ""),
    );

    setVectorSigns((previous) =>
      Array.from({ length: newSize }, (_, i) => previous[i] ?? 1),
    );

    setSize(newSize);
    setResult(null);
    setError("");
  }

  function updateMatrix(row: number, col: number, value: string) {
    setMatrix((previous) => {
      const next = previous.map((current) => [...current]);
      next[row][col] = value;
      return next;
    });

    setResult(null);
  }

  function toggleMatrixSign(row: number, col: number) {
    setSigns((previous) => {
      const next = previous.map((current) => [...current]);
      next[row][col] *= -1;
      return next;
    });

    setResult(null);
  }

  function updateVector(index: number, value: string) {
    setVector((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });

    setResult(null);
  }

  function toggleVectorSign(index: number) {
    setVectorSigns((previous) => {
      const next = [...previous];
      next[index] *= -1;
      return next;
    });

    setResult(null);
  }

  function calculate() {
    setError("");
    setResult(null);

    const parsedTolerance = Number(tolerance);
    const parsedIterations = Number(maxIterations);

    if (!Number.isFinite(parsedTolerance) || parsedTolerance <= 0) {
      setError("La tolerancia debe ser un número mayor que cero.");
      return;
    }

    if (
      !Number.isInteger(parsedIterations) ||
      parsedIterations < 1 ||
      parsedIterations > 1000
    ) {
      setError("El máximo de iteraciones debe estar entre 1 y 1000.");
      return;
    }

    const parsedMatrix = matrix.map((row, i) =>
      row.map((value, j) => {
        const magnitude = value.trim() === "" ? 0 : Number(value);
        return magnitude * signs[i][j];
      }),
    );

    const parsedVector = vector.map((value, i) => {
      const magnitude = value.trim() === "" ? 0 : Number(value);
      return magnitude * vectorSigns[i];
    });

    if (
      !parsedMatrix.flat().every(Number.isFinite) ||
      !parsedVector.every(Number.isFinite)
    ) {
      setError("Verifica que todos los valores sean números válidos.");
      return;
    }

    if (norm(parsedVector) === 0) {
      setError("El vector inicial no puede ser el vector cero.");
      return;
    }

    const answer = solvePower(
      parsedMatrix,
      parsedVector,
      parsedTolerance,
      parsedIterations,
    );

    if (!answer) {
      setError(
        "No fue posible completar el cálculo. Revisa la matriz y el vector inicial.",
      );
      return;
    }

    setResult(answer);
  }

  return (
    <section className="potencia">
      <header className="potencia__header">
        <div>
          <span className="potencia__eyebrow">
            MÉTODOS NUMÉRICOS / VALORES PROPIOS
          </span>

          <h1>Método de la potencia</h1>

          <p>
            Aproximación del valor propio dominante y su vector propio asociado
            mediante un proceso iterativo.
          </p>
        </div>

        <span className="potencia__tag">U5 · VALORES PROPIOS</span>
      </header>

      <section className="potencia__section">
        <div className="potencia__section-header">
          <div>
            <span className="potencia__number">01</span>
            <h2>Matriz de entrada</h2>
          </div>

          <div className="potencia__size">
            <label htmlFor="potencia-size">Dimensión</label>

            <select
              id="potencia-size"
              value={size}
              onChange={(event) => resizeMatrix(Number(event.target.value))}
            >
              {Array.from(
                { length: MAX_SIZE - MIN_SIZE + 1 },
                (_, i) => i + MIN_SIZE,
              ).map((value) => (
                <option key={value} value={value}>
                  {value} × {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="potencia__matrix-area">
          <div className="potencia__matrix-labels">
            <span>MATRIZ A</span>
            <span>VECTOR INICIAL x₀</span>
          </div>

          <div className="potencia__matrix-wrapper">
            <div
              className="potencia__matrix"
              style={{
                gridTemplateColumns: `repeat(${size}, minmax(75px, 1fr))`,
              }}
            >
              {matrix.map((row, i) =>
                row.map((value, j) => (
                  <div className="potencia__cell" key={`${i}-${j}`}>
                    <button
                      type="button"
                      className={`potencia__sign ${
                        signs[i][j] < 0 ? "is-negative" : ""
                      }`}
                      onClick={() => toggleMatrixSign(i, j)}
                      aria-label={`Cambiar signo de la fila ${i + 1}, columna ${j + 1}`}
                    >
                      {signs[i][j] > 0 ? "+" : "−"}
                    </button>

                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={value}
                      placeholder="0"
                      aria-label={`Matriz fila ${i + 1}, columna ${j + 1}`}
                      onChange={(event) =>
                        updateMatrix(i, j, event.target.value)
                      }
                    />
                  </div>
                )),
              )}
            </div>

            <div className="potencia__vector">
              {vector.map((value, i) => (
                <div className="potencia__cell" key={i}>
                  <button
                    type="button"
                    className={`potencia__sign ${
                      vectorSigns[i] < 0 ? "is-negative" : ""
                    }`}
                    onClick={() => toggleVectorSign(i)}
                    aria-label={`Cambiar signo del vector inicial ${i + 1}`}
                  >
                    {vectorSigns[i] > 0 ? "+" : "−"}
                  </button>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={value}
                    placeholder="0"
                    aria-label={`Componente ${i + 1} del vector inicial`}
                    onChange={(event) => updateVector(i, event.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="potencia__matrix-note">
          <span>+</span> y <span>−</span> permiten cambiar el signo de cada
          valor. Las celdas vacías se consideran cero.
        </div>
      </section>

      <section className="potencia__section">
        <div className="potencia__section-header">
          <div>
            <span className="potencia__number">02</span>
            <h2>Parámetros de cálculo</h2>
          </div>
        </div>

        <div className="potencia__parameters">
          <label>
            Tolerancia
            <input
              type="number"
              min="0"
              step="any"
              value={tolerance}
              onChange={(event) => setTolerance(event.target.value)}
            />
          </label>

          <label>
            Máximo de iteraciones
            <input
              type="number"
              min="1"
              max="1000"
              step="1"
              value={maxIterations}
              onChange={(event) => setMaxIterations(event.target.value)}
            />
          </label>
        </div>
      </section>

      <div className="potencia__actions">
        <button
          type="button"
          className="potencia__calculate"
          onClick={calculate}
        >
          Calcular método <span>→</span>
        </button>

        <button type="button" onClick={loadExample}>
          Cargar ejemplo
        </button>

        <button type="button" onClick={clearMatrix}>
          Limpiar
        </button>
      </div>

      {error && (
        <p className="potencia__error" role="alert">
          {error}
        </p>
      )}

      {result && (
        <>
          <section className="potencia__section potencia__results">
            <div className="potencia__section-header">
              <div>
                <span className="potencia__number">03</span>
                <h2>Resultados</h2>
              </div>

              <span
                className={`potencia__status ${
                  result.converged ? "is-success" : "is-warning"
                }`}
              >
                {result.converged
                  ? "Convergencia alcanzada"
                  : "Máximo de iteraciones alcanzado"}
              </span>
            </div>

            <div className="potencia__solution">
              <div className="potencia__solution-item">
                <span>Valor propio λ</span>
                <strong>{formatNumber(result.eigenvalue)}</strong>
              </div>

              {result.eigenvector.map((value, i) => (
                <div className="potencia__solution-item" key={i}>
                  <span>x{i + 1}</span>
                  <strong>{formatNumber(value)}</strong>
                </div>
              ))}
            </div>

            <p className="potencia__result-info">
              {result.iterations.length} iteraciones realizadas
            </p>
          </section>

          <section className="potencia__section">
            <div className="potencia__section-header">
              <div>
                <span className="potencia__number">04</span>
                <h2>Tabla de iteraciones</h2>
              </div>
            </div>

            <div className="potencia__table-wrapper">
              <table className="potencia__table">
                <thead>
                  <tr>
                    <th>Iteración</th>

                    {Array.from({ length: size }, (_, i) => (
                      <th key={i}>x{i + 1}</th>
                    ))}

                    <th>λ</th>
                  </tr>
                </thead>

                <tbody>
                  {result.iterations.map((iteration) => (
                    <tr key={iteration.index}>
                      <td>{iteration.index}</td>

                      {iteration.values.map((value, i) => (
                        <td key={i}>{formatNumber(value)}</td>
                      ))}

                      <td>{formatNumber(iteration.lambda)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default Potencia;
