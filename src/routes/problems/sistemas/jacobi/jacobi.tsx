import { EncabezadoCalculadora } from "@/components/encabezado-calculadora/encabezado-calculadora";
import { CeldaMatriz, EditorMatriz } from '@/components/editor-matriz/editor-matriz'
import { parseDecimal } from '@/functions/parse-decimal'
import { useState } from "react";
import "../compartido/iterativos.scss";

type Iteration = {
  index: number;
  values: number[];
  error: number;
};

type Result = {
  values: number[];
  iterations: Iteration[];
  converged: boolean;
};

const MIN_SIZE = 2;
const MAX_SIZE = 8;

const EXAMPLE_MATRIX = [
  ["10", "1", "2"],
  ["1", "11", "1"],
  ["2", "1", "10"],
];

const EXAMPLE_SIGNS = [
  [1, -1, 1],
  [-1, 1, -1],
  [1, -1, 1],
];

const EXAMPLE_VECTOR = ["6", "22", "10"];
const EXAMPLE_VECTOR_SIGNS = [1, 1, -1];

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
  return Number(value.toFixed(6)).toString();
}

function solveJacobi(
  matrix: number[][],
  vector: number[],
  tolerance: number,
  maxIterations: number,
): Result | null {
  const size = matrix.length;

  if (matrix.some((row, i) => matrix[i][i] === 0)) {
    return null;
  }

  let current = Array(size).fill(0);
  const iterations: Iteration[] = [];

  for (let index = 1; index <= maxIterations; index++) {
    const next = Array(size).fill(0);

    for (let i = 0; i < size; i++) {
      let sum = vector[i];

      for (let j = 0; j < size; j++) {
        if (i !== j) {
          sum -= matrix[i][j] * current[j];
        }
      }

      next[i] = sum / matrix[i][i];
    }

    if (!next.every(Number.isFinite)) {
      return null;
    }

    const error = Math.max(
      ...next.map((value, i) => Math.abs(value - current[i])),
    );

    iterations.push({
      index,
      values: [...next],
      error,
    });

    current = next;

    if (error <= tolerance) {
      return {
        values: current,
        iterations,
        converged: true,
      };
    }
  }

  return {
    values: current,
    iterations,
    converged: false,
  };
}

function Jacobi() {
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState<string[][]>(EXAMPLE_MATRIX);
  const [signs, setSigns] = useState<number[][]>(EXAMPLE_SIGNS);
  const [vector, setVector] = useState<string[]>(EXAMPLE_VECTOR);
  const [vectorSigns, setVectorSigns] =
    useState<number[]>(EXAMPLE_VECTOR_SIGNS);

  const [tolerance, setTolerance] = useState("0.0001");
  const [maxIterations, setMaxIterations] = useState("100");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function loadExample() {
    setSize(3);
    setMatrix(EXAMPLE_MATRIX.map((row) => [...row]));
    setSigns(EXAMPLE_SIGNS.map((row) => [...row]));
    setVector([...EXAMPLE_VECTOR]);
    setVectorSigns([...EXAMPLE_VECTOR_SIGNS]);
    setTolerance("0.0001");
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

    if (!Number.isInteger(parsedIterations) || parsedIterations < 1) {
      setError("El máximo de iteraciones debe ser un entero positivo.");
      return;
    }

    const parsedMatrix = matrix.map((row, i) =>
      row.map((value, j) => {
        const magnitude = value.trim() === "" ? 0 : parseDecimal(value);
        return magnitude * signs[i][j];
      }),
    );

    const parsedVector = vector.map((value, i) => {
      const magnitude = value.trim() === "" ? 0 : parseDecimal(value);
      return magnitude * vectorSigns[i];
    });

    if (
      !parsedMatrix.flat().every(Number.isFinite) ||
      !parsedVector.every(Number.isFinite)
    ) {
      setError("Verifica que todos los valores sean números válidos.");
      return;
    }

    if (parsedMatrix.some((row, i) => row[i] === 0)) {
      setError("La diagonal principal no puede contener ceros.");
      return;
    }

    const answer = solveJacobi(
      parsedMatrix,
      parsedVector,
      parsedTolerance,
      parsedIterations,
    );

    if (!answer) {
      setError("No fue posible completar el cálculo. Revisa los valores.");
      return;
    }

    setResult(answer);
  }

  return (
    <section className="jacobi">
      <EncabezadoCalculadora
        titulo="Método de Jacobi"
        introduccion="/lineal/jacobi"
        descripcion="Solución de sistemas de ecuaciones lineales mediante aproximaciones sucesivas."
      />

      <section className="jacobi__section">
        <div className="jacobi__section-header">
          <div>
            <span className="jacobi__number">01</span>
            <h2>Sistema de ecuaciones</h2>
          </div>

          <div className="jacobi__size">
            <label htmlFor="jacobi-size">Dimensión</label>

            <select
              id="jacobi-size"
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

        <EditorMatriz
          size={size}
          renderCell={(row, column) => (
            <CeldaMatriz
              label={`Coeficiente: fila ${row + 1}, columna ${column + 1}`}
              value={matrix[row][column]}
              negative={signs[row][column] < 0}
              onValueChange={(value) => updateMatrix(row, column, value)}
              onToggleSign={() => toggleMatrixSign(row, column)}
            />
          )}
          renderVector={(row) => (
            <CeldaMatriz
              label={`Término independiente ${row + 1}`}
              value={vector[row]}
              negative={vectorSigns[row] < 0}
              onValueChange={(value) => updateVector(row, value)}
              onToggleSign={() => toggleVectorSign(row)}
            />
          )}
        />

        <div className="jacobi__matrix-note">
          Alterna el signo con ±. Las celdas vacías valen 0.
        </div>
      </section>

      <section className="jacobi__section">
        <div className="jacobi__section-header">
          <div>
            <span className="jacobi__number">02</span>
            <h2>Parámetros de cálculo</h2>
          </div>
        </div>

        <div className="jacobi__parameters">
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
              step="1"
              value={maxIterations}
              onChange={(event) => setMaxIterations(event.target.value)}
            />
          </label>
        </div>
      </section>

      <div className="jacobi__actions">
        <button type="button" className="jacobi__example" onClick={loadExample}>
          Cargar ejemplo
        </button>
        <button type="button" className="jacobi__clear" onClick={clearMatrix}>
          Limpiar
        </button>
        <button type="button" className="jacobi__calculate" onClick={calculate}>
          Calcular <span aria-hidden="true">→</span>
        </button>
      </div>

      {error && <p className="jacobi__error">{error}</p>}

      {result && (
        <section className="jacobi__results">
          <div className="jacobi__section-header">
            <div>
              <span className="jacobi__number">03</span>
              <h2>Resultados</h2>
            </div>

            <span
              className={`jacobi__status ${
                result.converged ? "is-success" : "is-warning"
              }`}
            >
              {result.converged
                ? "Convergencia alcanzada"
                : "Máximo de iteraciones alcanzado"}
            </span>
          </div>

          <div className="jacobi__solution">
            {result.values.map((value, i) => (
              <div className="jacobi__solution-item" key={i}>
                <span>x{i + 1}</span>
                <strong>{formatNumber(value)}</strong>
              </div>
            ))}
          </div>

          <p className="jacobi__result-info">
            {result.iterations.length} iteraciones realizadas
            <span>
              Error final:{" "}
              {formatNumber(
                result.iterations[result.iterations.length - 1].error,
              )}
            </span>
          </p>

          <div className="jacobi__table-wrapper">
            <table className="jacobi__table">
              <thead>
                <tr>
                  <th>Iteración</th>
                  {Array.from({ length: size }, (_, i) => (
                    <th key={i}>x{i + 1}</th>
                  ))}
                  <th>Error</th>
                </tr>
              </thead>

              <tbody>
                {result.iterations.map((iteration) => (
                  <tr key={iteration.index}>
                    <td>{iteration.index}</td>

                    {iteration.values.map((value, i) => (
                      <td key={i}>{formatNumber(value)}</td>
                    ))}

                    <td>{formatNumber(iteration.error)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}

export default Jacobi;
