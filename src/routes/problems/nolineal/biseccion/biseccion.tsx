import { parseDecimal } from "@/functions/parse-decimal";
import { MathJax } from "better-react-mathjax";
import { useMemo, useState } from "react";
import { CalculadoraNoLineal, EntradaDecimal, TablaIteraciones } from "../compartido/calculadora-nolineal";
import { ejemplosRaices } from "../calculo/ejemplos-raices";
import { formatearDecimal } from "../compartido/formato-decimal";
import { evaluarReal } from "../calculo/funcion-real";
import { createInputGraph } from "../compartido/grafica-modelo";
import { resolverBiseccion, type FilaBiseccion } from "../calculo/metodos-raices";
import { useCalculoRaiz } from "../compartido/use-calculo-raiz";

const ejemplo = ejemplosRaices.biseccion;

export default function Biseccion() {
    const [aInput, setAInput] = useState(ejemplo.a);
    const [bInput, setBInput] = useState(ejemplo.b);
    const {
        ecuacion, funcion, error, resultado, setResultado, cambiarEcuacion, validarFuncion,
    } = useCalculoRaiz<FilaBiseccion>(ejemplo.funcion);

    const a = parseDecimal(aInput);
    const b = parseDecimal(bInput);
    const inputGraph = useMemo(
        () => funcion ? createInputGraph(funcion.evaluar, { method: "biseccion", a, b }) : null,
        [funcion, a, b],
    );
    const fa = funcion ? evaluarReal(funcion.evaluar, a) : null;
    const fb = funcion ? evaluarReal(funcion.evaluar, b) : null;

    function calcular() {
        if (funcion) {
            setResultado(resolverBiseccion(funcion.evaluar, a, b, ejemplo.tolerancia, ejemplo.maximo));
        }
    }

    return (
        <CalculadoraNoLineal
            title="MÉTODO DE BISECCIÓN"
            introductionPath="/nolineal/biseccion"
            equationText={ecuacion}
            equationLatex={funcion?.latex ?? null}
            validationMessage={error}
            onEquationChange={cambiarEcuacion}
            onValidate={validarFuncion}
            inputGraph={inputGraph}
            resultado={resultado}
            graphHint="Ingresa un intervalo válido con a menor que b."
            parameters={(
                <>
                    <div className="calculadora-nolineal__interval-inputs">
                        <h3>Intervalo inicial</h3>
                        <label htmlFor="interval-a">a:</label>
                        <EntradaDecimal id="interval-a" value={aInput} onValueChange={(value) => {
                            setAInput(value);
                            setResultado(null);
                        }} />
                        <label htmlFor="interval-b">b:</label>
                        <EntradaDecimal id="interval-b" value={bInput} onValueChange={(value) => {
                            setBInput(value);
                            setResultado(null);
                        }} />
                    </div>

                    <div className="calculadora-nolineal__interval-values">
                        <span><MathJax inline>{String.raw`\(f(a)\)`}</MathJax> = {fa === null ? "No definido" : formatearDecimal(fa)}</span>
                        <span><MathJax inline>{String.raw`\(f(b)\)`}</MathJax> = {fb === null ? "No definido" : formatearDecimal(fb)}</span>
                    </div>

                    <div className="calculadora-nolineal__calculation-controls">
                        <button type="button" onClick={calcular}>Calcular</button>
                    </div>
                </>
            )}
        >
            {resultado && <TablaIteraciones
                columnas={["k", "a", "c", "b", "f(a)", "f(c)", "f(b)", "(b-a)/2"]}
                filas={resultado.filas.map(({ a, b, c, fa, fb, fc, semiancho }, i) =>
                    [i + 1, a, c, b, fa, fc, fb, semiancho],
                )}
            />}
        </CalculadoraNoLineal>
    );
}
