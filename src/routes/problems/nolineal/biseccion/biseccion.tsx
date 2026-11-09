
import { useState } from "react";
import { parse, compile } from "mathjs";
import "./biseccion.scss";

const variablesPermitidas = ["x", "pi", "e"];

const funcionesPermitidas = [
  "sin", "cos", "tan",
  "asin", "acos", "atan",
  "sqrt", "abs",
  "log", "log10",
  "exp",
  "sinh", "cosh", "tanh"
];

function validarExpresion(expresion: string) {
  try {
    const nodo = parse(expresion);
    let valida = true;

    nodo.traverse((node) => {
      if (node.isSymbolNode) {
        const nombre = node.name;

        if (
          !variablesPermitidas.includes(nombre) &&
          !funcionesPermitidas.includes(nombre)
        ) {
          valida = false;
        }
      }
    });

    if (!valida) return false;

    compile(expresion);
    return true;

  } catch {
    return false;
  }
}

function Biseccion() {
  const [a, setA] = useState("0");
  const [b, setB] = useState("0");
  const [expression, setExpression] = useState("");

  const [expIsValid, setExpIsValid] = useState(false);
  const [abIsValid, setAbIsValid] = useState(false);
  const [signosOpuestos, setSignosOpuestos] = useState(false);

  function validarIntervalo(exp, valorA, valorB) {
    if (!validarExpresion(exp)) {
      setExpIsValid(false);
      setAbIsValid(false);
      setSignosOpuestos(false);
      return;
    }

    const f = compile(exp);
    setExpIsValid(true);

    const numA = Number(valorA);
    const numB = Number(valorB);

    const intervaloValido =
      valorA.trim() !== "" &&
      valorB.trim() !== "" &&
      Number.isFinite(numA) &&
      Number.isFinite(numB) &&
      numA < numB;

    setAbIsValid(intervaloValido);

    if (!intervaloValido) {
      setSignosOpuestos(false);
      return;
    }

    try {
      const fa = f.evaluate({ x: numA });
      const fb = f.evaluate({ x: numB });

      const signosValidos =
        typeof fa === "number" &&
        typeof fb === "number" &&
        Number.isFinite(fa) &&
        Number.isFinite(fb) &&
        fa * fb < 0;

      setSignosOpuestos(signosValidos);

    } catch {
      setSignosOpuestos(false);
    }
  }

  return (
    <section className="seccion-biseccion">
      <h1>MÉTODO DE BISECCIÓN</h1>

      <div>
        <label htmlFor="expresion">
          Introduce una expresión
        </label>

        <input
          id="expresion"
          type="text"
          value={expression}
          onChange={(e) => {
            const value = e.target.value;
            setExpression(value);
            validarIntervalo(value, a, b);
          }}
        />

        {!expIsValid && expression.trim() !== "" && (
          <p>Expresión inválida o contiene variables no permitidas.</p>
        )}
      </div>

      <div>
        <label>
          Introduce el intervalo (b debe ser mayor que a)
        </label>

        <label htmlFor="intervalo-a">a</label>

        <input
          id="intervalo-a"
          type="number"
          value={a}
          onChange={(e) => {
            const value = e.target.value;
            setA(value);
            validarIntervalo(expression, value, b);
          }}
          disabled={!expIsValid}
        />

        <label htmlFor="intervalo-b">b</label>

        <input
          id="intervalo-b"
          type="number"
          value={b}
          onChange={(e) => {
            const value = e.target.value;
            setB(value);
            validarIntervalo(expression, a, value);
          }}
          disabled={!expIsValid}
        />

        {abIsValid && !signosOpuestos && (
          <p>f(a) y f(b) deben tener signos contrarios.</p>
        )}

        {signosOpuestos && (
          <p>Intervalo válido: existe un cambio de signo.</p>
        )}
      </div>

      <div>
        <button disabled={!expIsValid || !abIsValid || !signosOpuestos}>
          Iniciar ejecución del método
        </button>
      </div>
    </section>
  );
}

function Renglon(a, b, c, fa, fb, fc) {
  return(
    <div>
      <div>
        {a}
      </div>
      <div>
        {b}
      </div>
      <div>
        {c}
      </div>
      <div>
        {fa}
      </div>
      <div>
        {fb}
      </div>
      <div>
        {fc}
      </div>
    </div>
  )
}

export default Biseccion;
