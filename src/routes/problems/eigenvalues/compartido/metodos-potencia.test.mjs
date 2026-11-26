import assert from "node:assert/strict";
import test from "node:test";
import { solveEigen } from "./metodos-potencia.ts";

const matrix = [[2, -2, 1], [2, -8, 2], [1, 2, 2]];
const tolerance = 1e-12;

function assertApprox(actual, expected, limit = tolerance) {
  assert.ok(Math.abs(actual - expected) <= limit, `${actual} ≈ ${expected}`);
}

function verifyPair(matrix, result, lambda, expectedVector) {
  assert.equal(result.status, "converged");
  const { index, av, lambdaV } = result.verification;
  const step = result.iterations[index];
  assert.equal(index, result.iterations.length - 1);
  assertApprox(step.lambda, lambda);
  step.vector.forEach((value, i) => assertApprox(value, expectedVector[i]));
  assert.equal(Math.max(...step.vector.map(Math.abs)), 1);
  assert.ok(step.error <= tolerance && step.residual <= tolerance);
  for (let i = 0; i < matrix.length; i++) {
    assertApprox(av[i], matrix[i].reduce((sum, value, j) => sum + value * step.vector[j], 0));
    assertApprox(lambdaV[i], step.lambda * step.vector[i]);
    assertApprox(av[i], lambdaV[i]);
  }
}

test("potencia usa el pivote anterior para estimar y el nuevo para normalizar", () => {
  const result = solveEigen(matrix, [1, 1, 1], tolerance, 100);
  const first = result.iterations[1];
  assert.deepEqual(first.auxiliary, [1, -4, 5]);
  assert.equal(first.pivot, 2);
  assert.equal(first.divisor, 5);
  assert.equal(first.lambda, 1);
  verifyPair(matrix, result, -8, [2 / 9, 1, -2 / 9]);
  verifyPair(matrix, solveEigen(matrix, [3, 1, -1], tolerance, 100), -8, [2 / 9, 1, -2 / 9]);
});

test("potencia inversa resuelve el ejercicio y una matriz que requiere intercambiar filas", () => {
  const result = solveEigen(matrix, [3, 1, -1], tolerance, 100, true);
  verifyPair(matrix, result, 1, [1, 0, -1]);
  assert.deepEqual(result.iterations[0].vector, [1, 1 / 3, -1 / 3]);

  const pivoted = [[0, 1], [1, 1]];
  const swap = solveEigen(pivoted, [1, 0], tolerance, 100, true);
  assertApprox(swap.iterations[1].auxiliary[0], -1);
  assertApprox(swap.iterations[1].auxiliary[1], 1);
  verifyPair(pivoted, swap, (1 - Math.sqrt(5)) / 2, [1, (1 - Math.sqrt(5)) / 2]);
});

test("conserva el signo y selecciona el primer índice en un empate", () => {
  const { iterations } = solveEigen([[-4, 0], [0, 1]], [-2, 2], tolerance, 100);
  assert.equal(iterations[0].pivot, 0);
  assert.equal(iterations[0].divisor, -2);
  assert.deepEqual(iterations[0].vector, [1, -1]);
  assert.equal(iterations[0].lambda, null);
  assert.equal(iterations.at(-1).lambda, -4);
});

test("el residuo distingue una estimación estancada de un par convergente", () => {
  for (const inverse of [false, true]) {
    const result = solveEigen([[2, 0], [0, -2]], [1, 1], tolerance, 1000, inverse);
    assert.equal(result.status, "limit");
    assert.equal(result.iterations.length, 1001);
    assert.equal(result.iterations.at(-1).error, 0);
    assert.ok(result.iterations.at(-1).residual > tolerance);
  }
});

test("distingue el vector nulo, la singularidad, el desbordamiento y la estimación indefinida", () => {
  assert.equal(solveEigen(matrix, [0, 0, 0], tolerance, 100).status, "invalid");
  assert.equal(solveEigen([[1, 2], [2, 4]], [1, 1], tolerance, 100, true).status, "interrupted");
  assert.equal(solveEigen([[1, 0], [0, 1e-18]], [1, 1], tolerance, 100, true).status, "interrupted");
  assert.equal(solveEigen([[Number.MAX_VALUE, Number.MAX_VALUE], [0, 1]], [1, 1], tolerance, 100).status, "interrupted");
  const inverse = solveEigen([[1, 1], [1, 0]], [1, 0], tolerance, 100, true);
  assert.equal(inverse.iterations[1].mu, 0);
  assert.equal(inverse.iterations[1].lambda, null);
  assert.equal(inverse.status, "converged");
});

test("un producto nulo verifica el par de valor propio cero y conserva el vector anterior", () => {
  const result = solveEigen([[0, 0], [0, 3]], [2, 0], tolerance, 100);
  assert.equal(result.status, "zero-eigenpair");
  const row = result.iterations[result.verification.index];
  assert.deepEqual(row.vector, result.iterations[0].vector);
  assert.equal(row.divisor, null);
  assert.equal(row.lambda, 0);
  assert.equal(row.residual, 0);
  assert.deepEqual(result.verification.av, [0, 0]);
});
