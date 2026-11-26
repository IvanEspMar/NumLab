import { useState } from "react";
import { prepararFuncion } from "../calculo/funcion-real";
import type { ResultadoRaiz } from "../calculo/metodos-raices";

export function useCalculoRaiz<Fila>(ejemplo: string, conDerivada = false) {
  const [ecuacion, setEcuacion] = useState(ejemplo);
  const [preparacion, setPreparacion] = useState<ReturnType<typeof prepararFuncion> | null>(null);
  const [resultado, setResultado] = useState<ResultadoRaiz<Fila> | null>(null);

  function cambiarEcuacion(texto: string) {
    setEcuacion(texto);
    setPreparacion(null);
    setResultado(null);
  }

  function validarFuncion() {
    setResultado(null);
    setPreparacion(prepararFuncion(ecuacion, conDerivada));
  }

  return {
    ecuacion,
    funcion: preparacion?.funcion,
    error: preparacion?.error ?? "",
    resultado,
    setResultado,
    cambiarEcuacion,
    validarFuncion,
  };
}
