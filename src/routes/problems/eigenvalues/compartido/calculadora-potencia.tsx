import { EncabezadoCalculadora } from "@/components/encabezado-calculadora/encabezado-calculadora";
import { solveEigen, type EigenResult } from "./metodos-potencia";
import { ResultadosPotencia } from "./resultados-potencia";
import { CeldaMatriz, EditorMatriz } from '@/components/editor-matriz/editor-matriz'
import { parseDecimal } from '@/functions/parse-decimal'
import { useState } from "react";
import { MathJax } from "better-react-mathjax";
import "./calculadora-potencia.scss";

const MIN_SIZE = 2;
const MAX_SIZE = 8;
const COEFFICIENTS = [
  [2, -2, 1],
  [2, -8, 2],
  [1, 2, 2],
];

const EXAMPLE_MATRIX = COEFFICIENTS.map(row => row.map(value => String(Math.abs(value))));
const EXAMPLE_SIGNS = COEFFICIENTS.map(row => row.map<number>(value => value < 0 ? -1 : 1));

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

export function CalculadoraPotencia({ inversa = false }: { inversa?: boolean }) {
  const exampleVector = inversa ? [3, 1, -1] : [1, 1, 1];
  const [size, setSize] = useState(COEFFICIENTS.length);

  const [matrix, setMatrix] = useState<string[][]>(EXAMPLE_MATRIX);

  const [signs, setSigns] = useState<number[][]>(EXAMPLE_SIGNS);

  const [vector, setVector] = useState(() => exampleVector.map(value => String(Math.abs(value))));

  const [vectorSigns, setVectorSigns] =
    useState(() => exampleVector.map<number>(value => value < 0 ? -1 : 1));

  const [tolerance, setTolerance] = useState("0.000001");
  const [maxIterations, setMaxIterations] = useState("100");

  const [result, setResult] = useState<EigenResult | null>(null);
  const [error, setError] = useState("");

  function loadExample() {
    setSize(COEFFICIENTS.length);
    setMatrix(EXAMPLE_MATRIX.map((row) => [...row]));
    setSigns(EXAMPLE_SIGNS.map((row) => [...row]));
    setVector(exampleVector.map(value => String(Math.abs(value))));
    setVectorSigns(exampleVector.map(value => value < 0 ? -1 : 1));
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

    setResult(solveEigen(parsedMatrix, parsedVector, parsedTolerance, parsedIterations, inversa));
  }

  return (
    <section className="potencia">
      <EncabezadoCalculadora
        titulo={inversa ? "Método de la potencia inversa" : "Método de la potencia"}
        introduccion={inversa ? "/eigenvalues/inversa" : "/eigenvalues/potencia"}
        descripcion={inversa ? (
          <MathJax inline>{String.raw`Aproxima el valor propio de menor magnitud de una matriz invertible y su vector propio. Si \(Av=\lambda v\), entonces \(A^{-1}v=(1/\lambda)v\). Cada iteración resuelve un sistema lineal sin formar la inversa.`}</MathJax>
        ) : (
          <MathJax inline>{String.raw`Aproxima el valor propio dominante en magnitud de una matriz cuadrada y su vector propio, ligados por \(Av=\lambda v\). El método multiplica y normaliza el vector en cada iteración. Un valor propio negativo puede dominar si su magnitud es la mayor.`}</MathJax>
        )}
      />

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

        <EditorMatriz
          size={size}
          vectorLabel="Vector inicial x₀"
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
              label={`Componente inicial ${row + 1}`}
              value={vector[row]}
              negative={vectorSigns[row] < 0}
              onValueChange={(value) => updateVector(row, value)}
              onToggleSign={() => toggleVectorSign(row)}
            />
          )}
        />

        <div className="potencia__matrix-note">
          Alterna el signo con ±. Las celdas vacías valen 0.
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
              onChange={(event) => { setTolerance(event.target.value); setResult(null); setError(""); }}
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
              onChange={(event) => { setMaxIterations(event.target.value); setResult(null); setError(""); }}
            />
          </label>
        </div>
      </section>

      <div className="potencia__actions">
        <button type="button" onClick={loadExample}>
          Cargar ejemplo
        </button>
        <button type="button" onClick={clearMatrix}>
          Limpiar
        </button>
        <button
          type="button"
          className="potencia__calculate"
          onClick={calculate}
        >
          Calcular <span aria-hidden="true">→</span>
        </button>
      </div>

      {error && (
        <p className="potencia__error" role="alert">
          <strong>Entradas inválidas.</strong> {error}
        </p>
      )}

      {result && <ResultadosPotencia result={result} inversa={inversa} />}
    </section>
  );
}
