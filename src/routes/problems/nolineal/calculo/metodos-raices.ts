import { evaluarReal, type FuncionReal } from "./funcion-real.ts";

export type EstadoRaiz = "exacta" | "aproximada" | "condicionada" | "invalida"
  | "condiciones" | "interrumpida" | "limite";

type Aproximacion = {
  x: number;
  fx: number;
  cambio?: number;
  semiancho?: number;
};

export type ResultadoRaiz<Fila> = {
  estado: EstadoRaiz;
  filas: Fila[];
  ultima?: Aproximacion;
  mensaje?: string;
};

export type FilaBiseccion = {
  a: number;
  b: number;
  c: number;
  fa: number;
  fb: number;
  fc: number;
  semiancho: number;
};

export type FilaNewton = {
  x: number;
  fx: number;
  pendiente: number;
  siguiente: number;
};

export type FilaSecante = {
  anterior: number;
  x: number;
  fx: number;
  siguiente: number;
};

function parametrosValidos(tolerancia: number, maximo: number): boolean {
  return Number.isFinite(tolerancia) && tolerancia > 0 &&
    Number.isSafeInteger(maximo) && maximo > 0;
}

function signosOpuestos(a: number, b: number): boolean {
  return (a < 0) !== (b < 0);
}

function calcularSemiancho(a: number, b: number): number {
  const ancho = b - a;
  return Number.isFinite(ancho) ? ancho / 2 : b / 2 - a / 2;
}

export function resolverBiseccion(
  f: FuncionReal, a: number, b: number, tolerancia: number, maximo: number,
): ResultadoRaiz<FilaBiseccion> {
  const filas: FilaBiseccion[] = [];
  if (!parametrosValidos(tolerancia, maximo) || !Number.isFinite(a) || !Number.isFinite(b)) {
    return { estado: "invalida", filas, mensaje: "Ingresa extremos y parámetros numéricos válidos." };
  }
  if (a >= b) {
    return { estado: "condiciones", filas, mensaje: "El extremo a debe ser menor que b." };
  }

  let fa = evaluarReal(f, a);
  if (fa === 0) return { estado: "exacta", filas, ultima: { x: a, fx: fa } };
  let fb = evaluarReal(f, b);
  if (fb === 0) return { estado: "exacta", filas, ultima: { x: b, fx: fb } };
  if (fa === null || fb === null) {
    return { estado: "condiciones", filas, mensaje: "La función debe ser real y finita en ambos extremos." };
  }
  if (!signosOpuestos(fa, fb)) {
    return { estado: "condiciones", filas, mensaje: "Los extremos deben presentar un cambio de signo." };
  }

  const escala = Math.min(Math.abs(fa), Math.abs(fb));
  const residuoIncompatible = "El intervalo es estrecho, pero el residuo sigue por encima del criterio. Revisa la continuidad o la precisión disponible.";
  let ultima: Aproximacion | undefined;
  for (let i = 0; i < maximo; i++) {
    const semiancho = calcularSemiancho(a, b);
    const c = Number.isFinite(b - a) ? a + semiancho : a / 2 + b / 2;
    if (c === a || c === b) {
      return {
        estado: "interrumpida", filas, ultima,
        mensaje: semiancho <= tolerancia && ultima && Math.abs(ultima.fx) / escala > tolerancia
          ? `El punto medio dejó de cambiar por precisión finita. ${residuoIncompatible}`
          : "El punto medio dejó de cambiar por precisión finita.",
      };
    }

    const fc = evaluarReal(f, c);
    if (fc === null) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La función no produjo un valor real y finito en el punto medio." };
    }

    filas.push({ a, b, c, fa, fb, fc, semiancho });
    ultima = { x: c, fx: fc, semiancho };
    if (fc === 0) return { estado: "exacta", filas, ultima };
    // El ancho solo acota el error de localización si la función es continua.
    if (semiancho <= tolerancia && Math.abs(fc) / escala <= tolerancia) {
      return {
        estado: "condicionada", filas, ultima,
        mensaje: "La cota dada por el semiancho depende de que la función sea continua en el intervalo.",
      };
    }

    if (signosOpuestos(fa, fc)) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }

  if (ultima?.semiancho !== undefined && ultima.semiancho <= tolerancia) {
    return { estado: "condiciones", filas, ultima, mensaje: residuoIncompatible };
  }
  return { estado: "limite", filas, ultima, mensaje: "Se agotaron las iteraciones sin satisfacer el criterio de parada." };
}

function convergenciaAbierta(
  x: number, anterior: number, fx: number, escala: number, tolerancia: number,
): boolean {
  const escalaPaso = Math.max(1, Math.abs(x), Math.abs(anterior));
  return Math.abs(x - anterior) / escalaPaso <= tolerancia &&
    Math.abs(fx) / escala <= tolerancia;
}

export function resolverNewton(
  f: FuncionReal, derivada: FuncionReal, x: number, tolerancia: number, maximo: number,
): ResultadoRaiz<FilaNewton> {
  const filas: FilaNewton[] = [];
  if (!parametrosValidos(tolerancia, maximo) || !Number.isFinite(x)) {
    return { estado: "invalida", filas, mensaje: "Ingresa un valor inicial y parámetros numéricos válidos." };
  }

  let fx = evaluarReal(f, x);
  if (fx === null) {
    return { estado: "condiciones", filas, mensaje: "La función debe ser real y finita en el punto inicial." };
  }

  let ultima: Aproximacion = { x, fx };
  if (fx === 0) return { estado: "exacta", filas, ultima };
  const escala = Math.abs(fx);

  for (let i = 0; i < maximo; i++) {
    const pendiente = evaluarReal(derivada, x);
    if (pendiente === null) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La derivada no produjo un valor real y finito en la aproximación actual." };
    }
    // Compara la pendiente con la escala local de f y x, no con un mínimo absoluto.
    const umbral = Math.abs(fx) / Math.max(1, Math.abs(x)) * Number.EPSILON;
    if (Math.abs(pendiente) <= umbral) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La derivada es nula o demasiado pequeña para calcular un paso fiable." };
    }

    const siguiente = x - fx / pendiente;
    if (!Number.isFinite(siguiente)) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La siguiente aproximación excede el rango numérico." };
    }
    if (siguiente === x) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La aproximación dejó de cambiar por precisión finita." };
    }

    filas.push({ x, fx, pendiente, siguiente });
    const valor = evaluarReal(f, siguiente);
    if (valor === null) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La función no produjo un valor real y finito en la nueva aproximación." };
    }
    const cambio = Math.abs(siguiente - x);
    if (!Number.isFinite(cambio)) {
      return { estado: "interrumpida", filas, ultima, mensaje: "El cambio de aproximación excede el rango numérico." };
    }
    ultima = { x: siguiente, fx: valor, cambio };
    if (valor === 0) return { estado: "exacta", filas, ultima };
    if (convergenciaAbierta(siguiente, x, valor, escala, tolerancia)) {
      return { estado: "aproximada", filas, ultima };
    }

    x = siguiente;
    fx = valor;
  }

  return { estado: "limite", filas, ultima, mensaje: "Se agotaron las iteraciones sin satisfacer el criterio de parada." };
}

export function resolverSecante(
  f: FuncionReal, anterior: number, x: number, tolerancia: number, maximo: number,
): ResultadoRaiz<FilaSecante> {
  const filas: FilaSecante[] = [];
  if (!parametrosValidos(tolerancia, maximo) || !Number.isFinite(anterior) || !Number.isFinite(x)) {
    return { estado: "invalida", filas, mensaje: "Ingresa valores iniciales y parámetros numéricos válidos." };
  }

  let fa = evaluarReal(f, anterior);
  if (fa === 0) return { estado: "exacta", filas, ultima: { x: anterior, fx: fa } };
  let fx = evaluarReal(f, x);
  if (fx === 0) return { estado: "exacta", filas, ultima: { x, fx } };
  if (anterior === x || fa === null || fx === null) {
    return { estado: "condiciones", filas, mensaje: "Usa dos puntos distintos en los que la función sea real y finita." };
  }

  let ultima: Aproximacion = { x, fx };
  const escala = Math.min(Math.abs(fa), Math.abs(fx));
  for (let i = 0; i < maximo; i++) {
    // Normalizar ambos valores evita desbordar f(x) - f(anterior).
    const escalaLocal = Math.max(Math.abs(fx), Math.abs(fa));
    const actual = fx / escalaLocal;
    const denominador = actual - fa / escalaLocal;
    if (Math.abs(denominador) <= 4 * Number.EPSILON) {
      return { estado: "interrumpida", filas, ultima, mensaje: "El denominador de la secante es nulo o demasiado pequeño respecto a los valores de la función." };
    }

    const siguiente = x - (actual / denominador) * (x - anterior);
    if (!Number.isFinite(siguiente)) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La siguiente aproximación excede el rango numérico." };
    }
    if (siguiente === x) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La aproximación dejó de cambiar por precisión finita." };
    }

    filas.push({ anterior, x, fx, siguiente });
    const valor = evaluarReal(f, siguiente);
    if (valor === null) {
      return { estado: "interrumpida", filas, ultima, mensaje: "La función no produjo un valor real y finito en la nueva aproximación." };
    }
    const cambio = Math.abs(siguiente - x);
    if (!Number.isFinite(cambio)) {
      return { estado: "interrumpida", filas, ultima, mensaje: "El cambio de aproximación excede el rango numérico." };
    }
    ultima = { x: siguiente, fx: valor, cambio };
    if (valor === 0) return { estado: "exacta", filas, ultima };
    if (convergenciaAbierta(siguiente, x, valor, escala, tolerancia)) {
      return { estado: "aproximada", filas, ultima };
    }

    anterior = x;
    fa = fx;
    x = siguiente;
    fx = valor;
  }

  return { estado: "limite", filas, ultima, mensaje: "Se agotaron las iteraciones sin satisfacer el criterio de parada." };
}
