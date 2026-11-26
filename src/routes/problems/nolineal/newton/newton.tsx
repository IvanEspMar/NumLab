import { parseDecimal } from "@/functions/parse-decimal";
import { useMemo, useState } from "react";
import { CalculadoraNoLineal, EntradaDecimal, TablaIteraciones } from "../compartido/calculadora-nolineal";
import { ejemplosRaices } from "../calculo/ejemplos-raices";
import { createInputGraph } from "../compartido/grafica-modelo";
import { resolverNewton, type FilaNewton } from "../calculo/metodos-raices";
import { useCalculoRaiz } from "../compartido/use-calculo-raiz";

const ejemplo = ejemplosRaices.newton;

export default function Newton() {
    const [valorInicial, setValorInicial] = useState(ejemplo.x);
    const {
        ecuacion, funcion, error, resultado, setResultado, cambiarEcuacion, validarFuncion,
    } = useCalculoRaiz<FilaNewton>(ejemplo.funcion, true);

    const x = parseDecimal(valorInicial);
    const inputGraph = useMemo(() => funcion?.pendiente ? createInputGraph(funcion.evaluar, {
        method: "newton", x, derivative: funcion.pendiente,
    }) : null, [funcion, x]);

    function calcular() {
        if (funcion?.pendiente) {
            setResultado(resolverNewton(funcion.evaluar, funcion.pendiente, x, ejemplo.tolerancia, ejemplo.maximo));
        }
    }

    return (
        <CalculadoraNoLineal
            title="MÉTODO DE NEWTON-RAPHSON"
            introductionPath="/nolineal/newton"
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
                        <h3>Valor inicial</h3>
                        <label htmlFor="newton-initial-value">x₀:</label>
                        <EntradaDecimal id="newton-initial-value" value={valorInicial} onValueChange={(value) => {
                            setValorInicial(value);
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
                columnas={["k", "x_k", "f(x_k)", "f'(x_k)", "x_{k+1}"]}
                filas={resultado.filas.map(({ x, fx, pendiente, siguiente }, i) =>
                    [i, x, fx, pendiente, siguiente],
                )}
            />}
        </CalculadoraNoLineal>
    );
}
