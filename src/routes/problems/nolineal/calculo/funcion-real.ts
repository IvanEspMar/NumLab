import { derivative, parse, type EvalFunction, type MathNode } from "mathjs";

export type FuncionReal = (x: number) => unknown;

type FuncionPreparada = {
  latex: string;
  evaluar: FuncionReal;
  pendiente?: FuncionReal;
};

type Preparacion = { funcion: FuncionPreparada; error?: never }
  | { funcion?: never; error: string };

function conVariableX(expresion: EvalFunction): FuncionReal {
  return (x) => expresion.evaluate({ x });
}

export function prepararFuncion(texto: string, conDerivada = false): Preparacion {
  if (texto.trim() === "") return { error: "Ingresa una función de x." };

  let expresion: MathNode;
  try {
    expresion = parse(texto);
  } catch {
    return { error: "La expresión tiene un error de sintaxis." };
  }

  let evaluar: FuncionReal;
  try {
    evaluar = conVariableX(expresion.compile());
  } catch {
    return { error: "No se pudo compilar la expresión." };
  }

  const latex = expresion.toTex();
  if (!conDerivada) return { funcion: { latex, evaluar } };

  let derivada: MathNode;
  try {
    derivada = derivative(expresion, "x");
  } catch {
    return { error: "No se pudo obtener la derivada simbólica respecto a x." };
  }

  try {
    return { funcion: { latex, evaluar, pendiente: conVariableX(derivada.compile()) } };
  } catch {
    return { error: "No se pudo compilar la derivada." };
  }
}

export function evaluarReal(funcion: FuncionReal, x: number): number | null {
  if (!Number.isFinite(x)) return null;
  try {
    const valor = funcion(x);
    return typeof valor === "number" && Number.isFinite(valor) ? valor : null;
  } catch {
    return null;
  }
}
