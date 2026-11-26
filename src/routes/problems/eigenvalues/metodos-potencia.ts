export interface EigenIteration {
  index: number;
  pivot: number | null;
  divisor: number | null;
  vector: number[];
  auxiliary: number[] | null;
  mu: number | null;
  lambda: number | null;
  error: number | null;
  residual: number | null;
}

export interface EigenResult {
  status: "converged" | "zero-eigenpair" | "limit" | "interrupted" | "invalid";
  iterations: EigenIteration[];
  initial?: number[];
  message?: string;
  verification?: { index: number; av: number[]; lambdaV: number[] };
}

function multiply(matrix: number[][], vector: number[]) {
  return matrix.map(row => row.reduce((sum, value, i) => sum + value * vector[i], 0));
}

function normalize(vector: number[]) {
  const pivot = vector.reduce((best, value, i) => Math.abs(value) > Math.abs(vector[best]) ? i : best, 0);
  const divisor = vector[pivot];
  return divisor === 0 ? null : { pivot, divisor, vector: vector.map(value => value / divisor) };
}

export function solveEigen(matrix: number[][], initial: number[], tolerance: number, maxIterations: number, inverse = false): EigenResult {
  const iterations: EigenIteration[] = [];
  if (matrix.length < 2 || matrix.length > 8 || initial.length !== matrix.length ||
      !matrix.every(row => row.length === matrix.length && row.every(Number.isFinite)) ||
      !initial.every(Number.isFinite) || !Number.isFinite(tolerance) || tolerance <= 0 ||
      !Number.isInteger(maxIterations) || maxIterations < 1 || maxIterations > 1000) {
    return { status: "invalid", iterations, message: "Revisa la dimensión, los valores y los parámetros de cálculo." };
  }

  let current = normalize(initial);
  if (!current) return { status: "invalid", iterations, message: "El vector inicial no puede ser el vector cero." };
  iterations.push({ ...current, index: 0, auxiliary: null, mu: null, lambda: null, error: null, residual: null });

  let previous: number | null = null;
  let verification: EigenResult["verification"];
  const interrupt = (message: string): EigenResult => ({ status: "interrupted", iterations, initial, verification, message });
  const solve = inverse ? factorLinearSystem(matrix) : undefined;
  if (solve === null) return interrupt("La matriz es singular o numéricamente singular.");

  for (let index = 1; index <= maxIterations; index++) {
    const auxiliary = solve ? solve(current.vector) : multiply(matrix, current.vector);
    if (!auxiliary.every(Number.isFinite)) return interrupt("El vector auxiliar excedió el rango numérico.");
    const next = normalize(auxiliary);
    if (!next) {
      if (inverse) return interrupt("El vector auxiliar es nulo. No se puede normalizar.");
      iterations.push({ index, pivot: null, divisor: null, vector: current.vector,
        auxiliary, mu: 0, lambda: 0, error: previous === null ? null : Math.abs(previous), residual: 0 });
      return { status: "zero-eigenpair", iterations, initial,
        verification: { index, av: auxiliary, lambdaV: auxiliary },
        message: "El producto Ax es cero en la precisión de cálculo. El vector anterior verifica un par propio para λ = 0. Su dominancia queda sin determinar." };
    }

    const mu = auxiliary[current.pivot];
    const estimate = inverse ? (mu === 0 ? null : 1 / mu) : mu;
    const lambda = estimate !== null && Number.isFinite(estimate) ? estimate : null;
    const difference = lambda === null || previous === null ? null : Math.abs(lambda - previous);
    const error = difference !== null && Number.isFinite(difference) ? difference : null;
    let residual: number | null = null;
    if (lambda !== null) {
      const av = multiply(matrix, next.vector);
      const lambdaV = next.vector.map(value => value * lambda);
      const norm = Math.max(...av.map((value, i) => Math.abs(value - lambdaV[i])));
      if (Number.isFinite(norm)) {
        residual = norm;
        verification = { index, av, lambdaV };
      }
    }
    iterations.push({ ...next, index, auxiliary, mu, lambda, error, residual });
    if (lambda !== null && residual === null) return interrupt("El residuo excedió el rango numérico.");
    if (error !== null && residual !== null && error <= tolerance && residual <= tolerance) {
      return { status: "converged", iterations, initial, verification };
    }
    current = next;
    previous = lambda;
  }
  return { status: "limit", iterations, initial, verification };
}

function factorLinearSystem(matrix: number[][]): ((vector: number[]) => number[]) | null {
  const size = matrix.length;
  const scale = Math.max(...matrix.flat().map(Math.abs));
  if (scale === 0) return null;

  const lu = matrix.map(row => row.map(value => value / scale));
  const permutation = matrix.map((_, index) => index);
  const pivotTolerance = Number.EPSILON * size * 100;

  for (let col = 0; col < size; col++) {
    let pivotRow = col;
    for (let row = col + 1; row < size; row++) {
      if (Math.abs(lu[row][col]) > Math.abs(lu[pivotRow][col])) pivotRow = row;
    }

    if (Math.abs(lu[pivotRow][col]) <= pivotTolerance) return null;
    [lu[col], lu[pivotRow]] = [lu[pivotRow], lu[col]];
    [permutation[col], permutation[pivotRow]] = [permutation[pivotRow], permutation[col]];

    for (let row = col + 1; row < size; row++) {
      const factor = lu[row][col] / lu[col][col];
      lu[row][col] = factor;
      for (let j = col + 1; j < size; j++) lu[row][j] -= factor * lu[col][j];
    }
  }

  return (vector) => {
    const solution = permutation.map(index => vector[index]);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < i; j++) solution[i] -= lu[i][j] * solution[j];
    }
    for (let i = size - 1; i >= 0; i--) {
      for (let j = i + 1; j < size; j++) solution[i] -= lu[i][j] * solution[j];
      solution[i] /= lu[i][i];
    }
    return solution.map(value => value / scale);
  };
}

