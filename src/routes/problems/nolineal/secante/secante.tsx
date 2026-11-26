import { parseDecimal } from "@/functions/parse-decimal";
import { useMemo, useState } from "react";
import { CalculadoraNoLineal, EntradaDecimal, TablaIteraciones } from "../compartido/calculadora-nolineal";
import { ejemplosRaices } from "../calculo/ejemplos-raices";
import { createInputGraph } from "../compartido/grafica-modelo";
import { resolverSecante, type FilaSecante } from "../calculo/metodos-raices";
import { useCalculoRaiz } from "../compartido/use-calculo-raiz";

const ejemplo = ejemplosRaices.secante;

export default function Secante() {
    const [primerValor, setPrimerValor] = useState(ejemplo.x0);
    const [segundoValor, setSegundoValor] = useState(ejemplo.x1);
    const {
        ecuacion, funcion, error, resultado, setResultado, cambiarEcuacion, validarFuncion,
    } = useCalculoRaiz<FilaSecante>(ejemplo.funcion);

    const x0 = parseDecimal(primerValor);
    const x1 = parseDecimal(segundoValor);
    const inputGraph = useMemo(
        () => funcion ? createInputGraph(funcion.evaluar, { method: "secante", x0, x1 }) : null,
        [funcion, x0, x1],
    );

    function calcular() {
        if (funcion) {
            setResultado(resolverSecante(funcion.evaluar, x0, x1, ejemplo.tolerancia, ejemplo.maximo));
        }
    }

    return (
        <CalculadoraNoLineal
            title="MÉTODO DE LA SECANTE"
            introductionPath="/nolineal/secante"
            equationText={ecuacion}
            equationLatex={funcion?.latex ?? null}
            validationMessage={error}
            onEquationChange={cambiarEcuacion}
            onValidate={validarFuncion}
            inputGraph={inputGraph}
            resultado={resultado}
            parameters={(
                <>
                    <div className="calculadora-nolineal__interval-inputs">
                        <h3>Valores iniciales</h3>
                        <label htmlFor="initial-value">x₀:</label>
                        <EntradaDecimal id="initial-value" value={primerValor} onValueChange={(value) => {
                            setPrimerValor(value);
                            setResultado(null);
                        }} />
                        <label htmlFor="initial-value-2">x₁:</label>
                        <EntradaDecimal id="initial-value-2" value={segundoValor} onValueChange={(value) => {
                            setSegundoValor(value);
                            setResultado(null);
                        }} />
                    </div>
                    <div className="calculadora-nolineal__calculation-controls">
                        <button type="button" onClick={calcular}>Calcular</button>
                    </div>
                </>
            )}
        >
            {resultado && <TablaIteraciones
                columnas={["k", "x_{k-1}", "x_k", "x_{k+1}", "f(x_k)"]}
                filas={resultado.filas.map(({ anterior, x, fx, siguiente }, i) =>
                    [i + 1, anterior, x, siguiente, fx],
                )}
            />}
        </CalculadoraNoLineal>
    );
}
