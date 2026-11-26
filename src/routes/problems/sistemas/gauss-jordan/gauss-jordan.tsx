import { CeldaMatriz, EditorMatriz } from '@/components/editor-matriz/editor-matriz'
import { parseDecimal } from '@/functions/parse-decimal'
import { useState } from "react";
import "./gauss-jordan.scss";

type Matrix = number[][];

type Step = {
  title: string;
  description: string;
  matrix: Matrix;
};

type Solution = {
  steps: Step[];
  matrix: Matrix;
  status: "unique" | "infinite" | "none";
  values: number[];
  rank: number;
};

const MIN_SIZE = 2;
const MAX_SIZE = 8;
const EPSILON = 1e-10;
const DECIMALS = 6;
const EXAMPLE_MATRIX = [
  [10, -1, 2, 6],
  [-1, 11, -1, 22],
  [2, -1, 10, -10],
];

function createExampleValues() {
  return EXAMPLE_MATRIX.map((row) => row.map((value) => String(Math.abs(value))));
}

function createExampleSigns() {
  return EXAMPLE_MATRIX.map((row) => row.map((value) => value < 0));
}

function createMatrix(size: number): string[][] {
  return Array.from({ length: size }, () => Array(size + 1).fill(""));
}

function createSigns(size: number): boolean[][] {
  return Array.from({ length: size }, () => Array(size + 1).fill(false));
}

function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}

function formatNumber(value: number): string {
  if (Math.abs(value) < EPSILON) return "0";

  return Number(value.toFixed(DECIMALS)).toString();
}

function gaussJordan(source: Matrix): Solution {
  const matrix = cloneMatrix(source);
  const size = matrix.length;
  const steps: Step[] = [];

  let pivotRow = 0;

  steps.push({
    title: "Matriz inicial",
    description: "Se comienza con la matriz aumentada del sistema.",
    matrix: cloneMatrix(matrix),
  });

  for (let col = 0; col < size && pivotRow < size; col++) {
    let maxRow = pivotRow;

    for (let row = pivotRow + 1; row < size; row++) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[maxRow][col])) {
        maxRow = row;
      }
    }

    if (Math.abs(matrix[maxRow][col]) < EPSILON) {
      continue;
    }

    if (maxRow !== pivotRow) {
      [matrix[pivotRow], matrix[maxRow]] = [matrix[maxRow], matrix[pivotRow]];

      steps.push({
        title: `Intercambio F${pivotRow + 1} ↔ F${maxRow + 1}`,
        description: `Se intercambian las filas para colocar el mayor pivote disponible.`,
        matrix: cloneMatrix(matrix),
      });
    }

    const pivot = matrix[pivotRow][col];

    if (Math.abs(pivot - 1) > EPSILON) {
      for (let j = 0; j <= size; j++) {
        matrix[pivotRow][j] /= pivot;
      }

      steps.push({
        title: `Normalización F${pivotRow + 1}`,
        description: `Se divide toda la fila entre ${formatNumber(pivot)} para convertir el pivote en 1.`,
        matrix: cloneMatrix(matrix),
      });
    }

    for (let row = 0; row < size; row++) {
      if (row === pivotRow) continue;

      const factor = matrix[row][col];

      if (Math.abs(factor) < EPSILON) continue;

      for (let j = 0; j <= size; j++) {
        matrix[row][j] -= factor * matrix[pivotRow][j];
      }

      steps.push({
        title: `F${row + 1} ← F${row + 1} − (${formatNumber(factor)})F${pivotRow + 1}`,
        description: `Se elimina el elemento de la columna ${col + 1} utilizando la fila pivote.`,
        matrix: cloneMatrix(matrix),
      });
    }

    pivotRow++;
  }

  const inconsistent = matrix.some((row) => {
    const coefficientsAreZero = row
      .slice(0, size)
      .every((value) => Math.abs(value) < EPSILON);

    return coefficientsAreZero && Math.abs(row[size]) >= EPSILON;
  });

  const status = inconsistent
    ? "none"
    : pivotRow === size
      ? "unique"
      : "infinite";

  const values = Array(size).fill(0);

  if (status === "unique") {
    for (let row = 0; row < size; row++) {
      const pivotCol = matrix[row].findIndex(
        (value, col) => col < size && Math.abs(value - 1) < EPSILON,
      );

      if (pivotCol !== -1) {
        values[pivotCol] = matrix[row][size];
      }
    }
  }

  return {
    steps,
    matrix,
    status,
    values,
    rank: pivotRow,
  };
}

function GaussJordan() {
  const [size, setSize] = useState(EXAMPLE_MATRIX.length);
  const [matrix, setMatrix] = useState(createExampleValues);
  const [signs, setSigns] = useState(createExampleSigns);
  const [result, setResult] = useState<Solution | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  function changeSize(nextSize: number) {
    if (nextSize < MIN_SIZE || nextSize > MAX_SIZE) return;

    setSize(nextSize);
    setMatrix(createMatrix(nextSize));
    setSigns(createSigns(nextSize));
    setResult(null);
    setActiveStep(0);
  }

  function updateCell(row: number, col: number, value: string) {
    if (!/^\d*([.,]\d*)?$/.test(value)) return;

    setMatrix((previous) =>
      previous.map((currentRow, i) =>
        currentRow.map((currentValue, j) =>
          i === row && j === col ? value : currentValue,
        ),
      ),
    );

    setResult(null);
  }

  function toggleSign(row: number, col: number) {
    setSigns((previous) =>
      previous.map((currentRow, i) =>
        currentRow.map((value, j) => (i === row && j === col ? !value : value)),
      ),
    );

    setResult(null);
  }

  function solve() {
    const numericMatrix = matrix.map((row, i) =>
      row.map((value, j) => {
        const number =
          value.trim() === "" ? 0 : parseDecimal(value);

        return signs[i][j] ? -number : number;
      }),
    );

    const solution = gaussJordan(numericMatrix);

    setResult(solution);
    setActiveStep(0);
  }

  function loadExample() {
    setSize(EXAMPLE_MATRIX.length);
    setMatrix(createExampleValues());
    setSigns(createExampleSigns());
    setResult(null);
    setActiveStep(0);
  }

  function reset() {
    setMatrix(createMatrix(size));
    setSigns(createSigns(size));
    setResult(null);
    setActiveStep(0);
  }

  const currentStep = result?.steps[activeStep];
  const invalidEntry = matrix.some((row) =>
    row.some((value) => value.trim() !== "" && !Number.isFinite(parseDecimal(value))),
  );

  return (
    <main className="gauss-jordan">
      <header className="gauss-jordan__header">
        <div>
          <span className="gauss-jordan__eyebrow">
            UNIDAD 3 / SISTEMAS DE ECUACIONES LINEALES
          </span>
          <h1>Gauss-Jordan</h1>
          <p>
            Resuelve sistemas de ecuaciones mediante operaciones elementales
            sobre matrices.
          </p>
        </div>

        <span className="gauss-jordan__tag">MÉTODO DIRECTO</span>
      </header>

      <section className="gauss-jordan__workspace">
        <div className="gauss-jordan__section-header">
          <div>
            <span className="gauss-jordan__number">01</span>
            <h2>Matriz aumentada</h2>
          </div>

          <div className="gauss-jordan__size">
            <button
              type="button"
              onClick={() => changeSize(size - 1)}
              disabled={size === MIN_SIZE}
              aria-label="Disminuir tamaño"
            >
              −
            </button>

            <span>
              {size} × {size + 1}
            </span>

            <button
              type="button"
              onClick={() => changeSize(size + 1)}
              disabled={size === MAX_SIZE}
              aria-label="Aumentar tamaño"
            >
              +
            </button>
          </div>
        </div>

        <p className="gauss-jordan__hint">
          Alterna el signo con ±. Las celdas vacías valen 0.
        </p>
        {invalidEntry && <p role="status">Completa el número en la celda antes de resolver.</p>}

        <EditorMatriz
          size={size}
          renderCell={(row, column) => (
            <CeldaMatriz
              label={`Coeficiente: fila ${row + 1}, columna ${column + 1}`}
              value={matrix[row][column]}
              negative={signs[row][column]}
              onValueChange={(value) => updateCell(row, column, value)}
              onToggleSign={() => toggleSign(row, column)}
            />
          )}
          renderVector={(row) => (
            <CeldaMatriz
              label={`Término independiente ${row + 1}`}
              value={matrix[row][size]}
              negative={signs[row][size]}
              onValueChange={(value) => updateCell(row, size, value)}
              onToggleSign={() => toggleSign(row, size)}
            />
          )}
        />

        <div className="gauss-jordan__matrix-footer">
          <span>
            <span className="gauss-jordan__legend"></span>
            Coeficientes
          </span>

          <span>
            <span className="gauss-jordan__legend gauss-jordan__legend--result"></span>
            Términos independientes
          </span>
        </div>

        <div className="gauss-jordan__actions">
          <button type="button" className="gauss-jordan__reset" onClick={loadExample}>
            Cargar ejemplo
          </button>

          <button type="button" className="gauss-jordan__reset" onClick={reset}>
            <span>↺</span> Limpiar
          </button>

          <button type="button" className="gauss-jordan__solve" onClick={solve} disabled={invalidEntry}>
            Resolver sistema <span>→</span>
          </button>
        </div>
      </section>

      {result && (
        <section className="gauss-jordan__results">
          <div className="gauss-jordan__section-header">
            <div>
              <span className="gauss-jordan__number">02</span>
              <h2>Procedimiento</h2>
            </div>

            <span className="gauss-jordan__step-count">
              {result.steps.length} pasos
            </span>
          </div>

          <div className="gauss-jordan__step-navigation">
            <button
              type="button"
              onClick={() =>
                setActiveStep((previous) => Math.max(0, previous - 1))
              }
              disabled={activeStep === 0}
            >
              ← Anterior
            </button>

            <span>
              Paso {activeStep + 1} de {result.steps.length}
            </span>

            <button
              type="button"
              onClick={() =>
                setActiveStep((previous) =>
                  Math.min(result.steps.length - 1, previous + 1),
                )
              }
              disabled={activeStep === result.steps.length - 1}
            >
              Siguiente →
            </button>
          </div>

          {currentStep && (
            <article className="gauss-jordan__step">
              <div className="gauss-jordan__step-title">
                <span>PASO {String(activeStep + 1).padStart(2, "0")}</span>
                <h3>{currentStep.title}</h3>
              </div>

              <p>{currentStep.description}</p>

              <div className="gauss-jordan__result-matrix">
                {currentStep.matrix.map((row, i) => (
                  <div className="gauss-jordan__result-row" key={i}>
                    <span>F{i + 1}</span>

                    {row.map((value, j) => (
                      <span
                        className={
                          j === size
                            ? "gauss-jordan__result-value is-independent"
                            : "gauss-jordan__result-value"
                        }
                        key={j}
                      >
                        {formatNumber(value)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </article>
          )}

          <div className="gauss-jordan__progress">
            {result.steps.map((step, i) => (
              <button
                type="button"
                key={i}
                className={i === activeStep ? "is-active" : ""}
                onClick={() => setActiveStep(i)}
                aria-label={`Ir al paso ${i + 1}: ${step.title}`}
              />
            ))}
          </div>

          <div className="gauss-jordan__section-header gauss-jordan__final-header">
            <div>
              <span className="gauss-jordan__number">03</span>
              <h2>Resultado</h2>
            </div>
          </div>

          <div
            className={`gauss-jordan__answer gauss-jordan__answer--${result.status}`}
          >
            <span className="gauss-jordan__answer-label">
              {result.status === "unique"
                ? "SOLUCIÓN ÚNICA"
                : result.status === "infinite"
                  ? "INFINITAS SOLUCIONES"
                  : "SISTEMA INCOMPATIBLE"}
            </span>

            {result.status === "unique" ? (
              <div className="gauss-jordan__variables">
                {result.values.map((value, i) => (
                  <div className="gauss-jordan__variable" key={i}>
                    <span>x{i + 1}</span>
                    <strong>{formatNumber(value)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                {result.status === "infinite"
                  ? `El sistema tiene ${size - result.rank} variable(s) libre(s). No existe una solución única.`
                  : "Se encontró una contradicción en la matriz reducida. No existe solución para este sistema."}
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default GaussJordan;
