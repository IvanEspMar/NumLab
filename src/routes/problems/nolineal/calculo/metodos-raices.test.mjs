import assert from "node:assert/strict";
import test from "node:test";
import { parseDecimal } from "../../../../functions/parse-decimal.ts";
import { ejemplosRaices } from "./ejemplos-raices.ts";
import { formatearAproximacion, formatearDecimal } from "../compartido/formato-decimal.ts";
import { evaluarReal, prepararFuncion } from "./funcion-real.ts";
import { createInputGraph, createSolutionGraph, sampleCurve } from "../compartido/grafica-modelo.ts";
import { resolverBiseccion, resolverNewton, resolverSecante } from "./metodos-raices.ts";

const tolerancia = 1e-6;
const maximo = 100;

test("las tablas y los resultados muestran decimales sin exponentes", () => {
  assert.equal(formatearAproximacion(-1.23456789), "-1.234568");
  assert.equal(formatearAproximacion(-1.23456789e-9), "-0.00000000123457");
  assert.equal(formatearAproximacion(1.23456789e21), "1234570000000000000000");
  assert.equal(formatearAproximacion(-0), "0");

  for (const valor of [Number.MIN_VALUE, -1e-250, 1.0000000000000002, 1e21, Number.MAX_VALUE]) {
    const exacto = formatearDecimal(valor);
    assert.match(exacto, /^-?\d+(?:\.\d+)?$/);
    assert.equal(Number(exacto), valor);

    const aproximado = formatearAproximacion(valor);
    assert.match(aproximado, /^-?\d+(?:\.\d+)?$/);
    assert.notEqual(Number(aproximado), 0);
  }
});

function preparar(texto, conDerivada = false) {
  const { funcion, error } = prepararFuncion(texto, conDerivada);
  assert.ok(funcion, error);
  return funcion;
}

test("las expresiones se compilan sin confundir sintaxis, derivabilidad y dominio", () => {
  assert.match(prepararFuncion("").error, /Ingresa/);
  assert.match(prepararFuncion("x + (").error, /sintaxis/);
  assert.match(prepararFuncion("floor(x)", true).error, /derivada simbólica/);
  const { evaluar, pendiente, latex } = preparar("sqrt(x)", true);
  assert.ok(latex);
  assert.equal(evaluarReal(evaluar, 4), 2);
  assert.equal(evaluarReal(pendiente, 4), 0.25);
  assert.equal(evaluarReal(evaluar, -1), null);
  for (const texto of ["sqrt(-1)", "1/0", "y", "[1, 2]"]) {
    assert.equal(evaluarReal(preparar(texto).evaluar, 0), null);
  }
  assert.equal(evaluarReal(() => { throw new RangeError(); }, 1), null);
});

test("los tres ejemplos precargados convergen con los parámetros de sus calculadoras", () => {
  const { biseccion, newton, secante } = ejemplosRaices;
  const bis = resolverBiseccion(
    preparar(biseccion.funcion).evaluar, parseDecimal(biseccion.a), parseDecimal(biseccion.b),
    biseccion.tolerancia, biseccion.maximo,
  );
  const { evaluar, pendiente } = preparar(newton.funcion, true);
  const nr = resolverNewton(
    evaluar, pendiente, parseDecimal(newton.x), newton.tolerancia, newton.maximo,
  );
  const sec = resolverSecante(
    preparar(secante.funcion).evaluar, parseDecimal(secante.x0), parseDecimal(secante.x1),
    secante.tolerancia, secante.maximo,
  );

  assert.equal(bis.estado, "condicionada");
  assert.equal(nr.estado, "aproximada");
  assert.equal(sec.estado, "aproximada");
  assert.ok(Math.abs(bis.ultima.x - Math.sqrt(3.5)) <= bis.ultima.semiancho);
  assert.ok(evaluar(2.9643478) < 0 && evaluar(2.9643479) > 0);
  assert.ok(nr.ultima.x > 2.9643478 && nr.ultima.x < 2.9643479);
  assert.ok(Math.abs(sec.ultima.x - Math.SQRT2) < 1e-5);
  assert.equal(nr.ultima.fx, evaluar(nr.ultima.x));
});

test("Bisección reconoce ceros exactos en ambos extremos y en el punto medio", () => {
  for (const intervalo of [[2, 4], [0, 2], [0, 4]]) {
    const resultado = resolverBiseccion(x => x - 2, ...intervalo, tolerancia, maximo);
    assert.equal(resultado.estado, "exacta");
    assert.equal(resultado.ultima.x, 2);
    assert.equal(resultado.ultima.fx, 0);
    assert.equal(resultado.filas.length, intervalo.includes(2) ? 0 : 1);
  }
  const grande = resolverBiseccion(x => x, -Number.MAX_VALUE, Number.MAX_VALUE, tolerancia, maximo);
  assert.equal(grande.estado, "exacta");
  assert.equal(grande.filas[0].semiancho, Number.MAX_VALUE);
});

test("Bisección conserva el cambio de signo y separa semiancho y residuo", () => {
  const f = x => x * x - 2;
  const resultado = resolverBiseccion(f, 1, 2, tolerancia, maximo);
  assert.equal(resultado.estado, "condicionada");
  assert.ok(resultado.ultima.semiancho <= tolerancia);
  assert.ok(Math.abs(resultado.ultima.fx) <= tolerancia);
  assert.ok(Math.abs(resultado.ultima.x - Math.SQRT2) <= resultado.ultima.semiancho);
  for (const [i, fila] of resultado.filas.entries()) {
    assert.equal(fila.fa, f(fila.a));
    assert.equal(fila.fb, f(fila.b));
    assert.equal(fila.fc, f(fila.c));
    assert.ok(fila.fa < 0 && fila.fb > 0);
    if (i > 0) {
      const anterior = resultado.filas[i - 1];
      assert.equal(fila.semiancho, anterior.semiancho / 2);
      assert.equal(fila.a === anterior.c || fila.b === anterior.c, true);
    }
  }
});

test("Bisección rechaza el salto de la auditoría aun con cambio de signo e intervalo estrecho", () => {
  const f = preparar("x < 0 ? -1 : 1 + 1e9*x").evaluar;
  const resultado = resolverBiseccion(f, -4e-7, 6e-7, tolerancia, 50);
  assert.equal(resultado.estado, "condiciones");
  assert.match(resultado.mensaje, /intervalo es estrecho.*residuo/);
  assert.ok(resultado.ultima.semiancho <= tolerancia);
  assert.ok(Math.abs(resultado.ultima.fx) >= 1);
});

test("las constantes sin raíz no convergen aunque sean pequeñas", () => {
  for (const valor of [1, 1e-8]) {
    const f = () => valor;
    assert.equal(resolverBiseccion(f, -1, 1, tolerancia, maximo).estado, "condiciones");
    const newton = resolverNewton(f, () => 0, 1, tolerancia, maximo);
    const secante = resolverSecante(f, 1, 2, tolerancia, maximo);
    assert.equal(newton.estado, "interrumpida");
    assert.match(newton.mensaje, /derivada/);
    assert.equal(secante.estado, "interrumpida");
    assert.match(secante.mensaje, /denominador/);
  }
});

test("reescalar la función preserva la convergencia y la aproximación de los tres métodos", () => {
  for (const escala of [1e-200, 1, -1e200]) {
    const f = x => escala * (x * x - 2);
    const pendiente = x => escala * (2 * x);
    const resultados = [
      resolverBiseccion(f, 1, 2, tolerancia, maximo),
      resolverNewton(f, pendiente, 2, tolerancia, maximo),
      resolverSecante(f, 1, 2, tolerancia, maximo),
    ];
    assert.deepEqual(resultados.map(r => r.estado), ["condicionada", "aproximada", "aproximada"]);
    for (const r of resultados) {
      assert.ok(Math.abs(r.ultima.x - Math.SQRT2) <= tolerancia);
      assert.ok(Math.abs(r.ultima.fx / escala) <= 2 * tolerancia);
    }
  }
});

test("Newton y Secante reconocen raíces exactas sin exigir una actualización", () => {
  const f = x => x - 2;
  const nr = resolverNewton(f, () => { throw new Error(); }, 2, tolerancia, maximo);
  assert.equal(nr.estado, "exacta");
  assert.equal(nr.filas.length, 0);
  for (const puntos of [[2, 1], [1, 2]]) {
    const sec = resolverSecante(f, ...puntos, tolerancia, maximo);
    assert.equal(sec.estado, "exacta");
    assert.equal(sec.ultima.x, 2);
    assert.equal(sec.filas.length, 0);
  }
  assert.equal(resolverNewton(f, () => 1, 0, tolerancia, 1).estado, "exacta");
  assert.equal(resolverSecante(f, 0, 1, tolerancia, 1).estado, "exacta");
});

test("los métodos abiertos requieren tanto un paso pequeño como reducción del residuo", () => {
  const f = x => 1 + 1e-3 * Math.atan(1e12 * x);
  const df = x => 1e9 / (1 + (1e12 * x) ** 2);
  const nrPaso = resolverNewton(f, df, 0, tolerancia, 1);
  assert.equal(nrPaso.estado, "limite");
  assert.ok(nrPaso.ultima.cambio < tolerancia);
  assert.ok(nrPaso.ultima.fx > 0.99);

  const exponencial = resolverNewton(Math.exp, Math.exp, 0, tolerancia, 100);
  assert.equal(exponencial.estado, "limite");
  assert.ok(exponencial.ultima.fx < tolerancia);
  assert.equal(exponencial.ultima.cambio, 1);

  const meseta = preparar("x < 0 ? 1e8 : 1").evaluar;
  const sec = resolverSecante(meseta, -1, 1, tolerancia, 1);
  assert.equal(sec.estado, "limite");
  assert.ok(sec.ultima.cambio < tolerancia);
  assert.equal(sec.ultima.fx, 1);
});

test("se detectan pendientes y denominadores inutilizables sin desbordar diferencias recuperables", () => {
  const nr = resolverNewton(x => 1 + 1e-30 * x, () => 1e-30, 0, tolerancia, maximo);
  assert.equal(nr.estado, "interrumpida");
  assert.match(nr.mensaje, /derivada.*demasiado pequeña/);
  const sec = resolverSecante(x => 1 + Number.EPSILON * x, 0, 1, tolerancia, maximo);
  assert.equal(sec.estado, "interrumpida");
  assert.match(sec.mensaje, /denominador.*demasiado pequeño/);

  const resultado = resolverSecante(x => 1e308 * x, -1, 1, tolerancia, maximo);
  assert.equal(resultado.estado, "exacta");
  assert.equal(resultado.ultima.x, 0);
  assert.equal(resultado.filas.length, 1);
});

test("distingue entradas inválidas y condiciones iniciales incumplidas", () => {
  const f = x => x * x + 1;
  assert.equal(resolverBiseccion(f, NaN, 2, tolerancia, maximo).estado, "invalida");
  assert.equal(resolverNewton(f, x => 2 * x, Infinity, tolerancia, maximo).estado, "invalida");
  assert.equal(resolverSecante(f, 1, 2, 0, maximo).estado, "invalida");
  assert.equal(resolverBiseccion(f, 2, 1, tolerancia, maximo).estado, "condiciones");
  assert.equal(resolverBiseccion(f, 1, 2, tolerancia, maximo).estado, "condiciones");
  assert.equal(resolverSecante(f, 1, 1, tolerancia, maximo).estado, "condiciones");

  for (const texto of ["sqrt(-1)", "1/0"]) {
    const evaluar = preparar(texto).evaluar;
    assert.equal(resolverBiseccion(evaluar, 1, 2, tolerancia, maximo).estado, "condiciones");
    assert.equal(resolverNewton(evaluar, () => 1, 1, tolerancia, maximo).estado, "condiciones");
    assert.equal(resolverSecante(evaluar, 1, 2, tolerancia, maximo).estado, "condiciones");
  }
});

test("una evaluación inválida durante el procedimiento conserva las filas y la última evaluación válida", () => {
  const bis = resolverBiseccion(preparar("1/(x-0.5)").evaluar, 0, 2, tolerancia, maximo);
  assert.equal(bis.estado, "interrumpida");
  assert.equal(bis.filas.length, 1);
  assert.equal(bis.ultima.x, 1);
  assert.match(bis.mensaje, /punto medio/);

  const { evaluar, pendiente } = preparar("sqrt(x)+1", true);
  const nr = resolverNewton(evaluar, pendiente, 1, tolerancia, maximo);
  assert.equal(nr.estado, "interrumpida");
  assert.equal(nr.filas.length, 1);
  assert.equal(nr.ultima.x, 1);
  assert.equal(nr.filas[0].siguiente, -3);

  const f = x => {
    if (x > 1.38 && x < 1.5) throw new RangeError();
    return x * x - 2;
  };
  const sec = resolverSecante(f, 1, 2, tolerancia, maximo);
  assert.equal(sec.estado, "interrumpida");
  assert.equal(sec.filas.length, 2);
  assert.equal(sec.ultima.x, sec.filas[0].siguiente);
  assert.equal(sec.ultima.fx, f(sec.ultima.x));
});

test("una derivada no real o no finita y un paso que se desborda interrumpen Newton", () => {
  const f = () => 1;
  for (const texto of ["sqrt(-1)", "1/0"]) {
    const nr = resolverNewton(f, preparar(texto).evaluar, 0, tolerancia, maximo);
    assert.equal(nr.estado, "interrumpida");
    assert.match(nr.mensaje, /derivada.*real y finito/);
  }
  const nr = resolverNewton(() => 1e308, () => 0.5, -1e308, tolerancia, maximo);
  assert.equal(nr.estado, "interrumpida");
  assert.match(nr.mensaje, /rango numérico/);
  const sec = resolverSecante(x => Math.sign(x), -1e308, 1e308, tolerancia, maximo);
  assert.equal(sec.estado, "interrumpida");
  assert.match(sec.mensaje, /rango numérico/);
});

test("los tres métodos distinguen estancamiento por precisión finita del límite", () => {
  const c = 2 ** 53;
  const casos = [
    resolverBiseccion(x => x === c ? -1 : 1, c, c + 2, tolerancia, maximo),
    resolverNewton(() => 1, () => 3, c, tolerancia, maximo),
    resolverSecante(x => x === c ? 1 : 100, c - 2, c, tolerancia, maximo),
  ];
  for (const resultado of casos) {
    assert.equal(resultado.estado, "interrumpida");
    assert.match(resultado.mensaje, /precisión finita/);
    assert.equal(resultado.filas.length, 0);
  }

  const f = x => x * x - 2;
  for (const resultado of [
    resolverBiseccion(f, 1, 2, tolerancia, 1),
    resolverNewton(f, x => 2 * x, 2, tolerancia, 1),
    resolverSecante(f, 1, 2, tolerancia, 1),
  ]) {
    assert.equal(resultado.estado, "limite");
    assert.equal(resultado.filas.length, 1);
    assert.ok(Number.isFinite(resultado.ultima.x));
    assert.ok(Number.isFinite(resultado.ultima.fx));
  }
});

test("la gráfica recibe las coordenadas calculadas sin volver a evaluar el punto al crear el resultado", () => {
  let evaluaciones = 0;
  const f = x => {
    evaluaciones++;
    return x * x - 2;
  };
  const entrada = createInputGraph(f, { method: "biseccion", a: 1, b: 2 });
  const resultado = resolverBiseccion(f, 1, 2, tolerancia, maximo);
  const antes = evaluaciones;
  const grafica = createSolutionGraph(entrada, resultado.ultima);
  assert.equal(evaluaciones, antes);
  assert.deepEqual(grafica.result, resultado.ultima);
  assert.notEqual(grafica.result.fx, 0);
  assert.ok(sampleCurve(grafica).length > 0);
});
