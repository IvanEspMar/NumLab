import { MathJax } from "better-react-mathjax";
import { useId, useMemo, type ReactNode } from "react";
import { EncabezadoCalculadora } from "@/components/encabezado-calculadora/encabezado-calculadora";
import { formatearAproximacion, formatearDecimal } from "./formato-decimal";
import { GraficaMatematica } from "./grafica-matematica";
import { createSolutionGraph, type GraphData } from "./grafica-modelo";
import type { EstadoRaiz, ResultadoRaiz } from "../calculo/metodos-raices";
import "./calculadora-nolineal.scss";

interface CalculadoraNoLinealProps {
    title: string;
    introductionPath: string;
    equationText: string;
    equationLatex: string | null;
    validationMessage: string;
    onEquationChange: (value: string) => void;
    onValidate: () => void;
    parameters: ReactNode;
    children: ReactNode;
    inputGraph: GraphData | null;
    resultado: ResultadoRaiz<unknown> | null;
    graphHint?: string;
}

export function CalculadoraNoLineal({
    title,
    introductionPath,
    equationText,
    equationLatex,
    validationMessage,
    onEquationChange,
    onValidate,
    parameters,
    children,
    inputGraph,
    resultado,
    graphHint = "Ingresa valores iniciales donde la función esté definida.",
}: CalculadoraNoLinealProps) {
    const equationId = useId();
    const solutionGraph = useMemo(() => {
        if (!inputGraph || !resultado?.ultima || !esResultadoAceptado(resultado.estado)) return null;
        return createSolutionGraph(inputGraph, resultado.ultima);
    }, [inputGraph, resultado]);

    return (
        <section className="calculadora-nolineal">
            <EncabezadoCalculadora titulo={title} introduccion={introductionPath} />

            <div className="calculadora-nolineal__workspace">
                <div className="calculadora-nolineal__panel">
                    <form className="calculadora-nolineal__equation-input" onSubmit={(event) => {
                        event.preventDefault();
                        onValidate();
                    }}>
                        <label htmlFor={equationId}>Función de x</label>
                        <div>
                            <input
                                id={equationId}
                                type="text"
                                value={equationText}
                                onChange={(event) => onEquationChange(event.target.value)}
                                placeholder="x^2 - 2"
                            />
                            <button type="submit">Validar función</button>
                        </div>
                        {equationLatex === null && validationMessage && (
                            <span className="calculadora-nolineal__error" role="status">{validationMessage}</span>
                        )}
                    </form>
                    {equationLatex !== null && (
                        <div className="calculadora-nolineal__parameters">{parameters}</div>
                    )}
                </div>

                <section className="calculadora-nolineal__panel" aria-label="Vista previa de la función">
                    <h2>Vista previa</h2>
                    {equationLatex === null ? (
                        <p className="calculadora-nolineal__hint">Valida la función para ver su fórmula y habilitar el cálculo.</p>
                    ) : (
                        <div className="calculadora-nolineal__equation-preview">
                            <MathJax dynamic>{String.raw`\[f(x)=${equationLatex}\]`}</MathJax>
                        </div>
                    )}
                    {equationLatex !== null && (
                        <div className="calculadora-nolineal__input-graph">
                            <h2>Gráfica de entrada</h2>
                            {inputGraph ? <GraficaMatematica data={inputGraph} /> : (
                                <p className="calculadora-nolineal__hint">{graphHint}</p>
                            )}
                        </div>
                    )}
                </section>
            </div>
            {solutionGraph && (
                <section className="calculadora-nolineal__panel calculadora-nolineal__solution-graph">
                    <h2>Gráfica del resultado</h2>
                    <GraficaMatematica data={solutionGraph} />
                </section>
            )}
            {equationLatex !== null && resultado && <ResultadoNoLineal resultado={resultado} />}
            {equationLatex !== null && children}
        </section>
    );
}

interface EntradaDecimalProps {
    id: string;
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
}

export function EntradaDecimal({ id, value, onValueChange, placeholder }: EntradaDecimalProps) {
    function changeSign() {
        const numberText = value.trim();
        onValueChange(/^[-−]/.test(numberText) ? numberText.slice(1) : `-${numberText.replace(/^\+/, "")}`);
    }

    return (
        <div className="calculadora-nolineal__decimal-input">
            <input
                id={id}
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
            />
            <button type="button" aria-label="Cambiar signo" aria-controls={id} onClick={changeSign}>±</button>
        </div>
    );
}

export function TablaIteraciones({ columnas, filas }: {
    columnas: readonly string[];
    filas: readonly (readonly number[])[];
}) {
    if (filas.length === 0) return null;

    return (
        <section className="calculadora-nolineal__iterations">
            <h2>Iteraciones</h2>
            <div className="calculadora-nolineal__table-scroll" tabIndex={0} role="region" aria-label="Tabla de iteraciones">
                <table className="calculadora-nolineal__iterations-table">
                    <thead>
                        <tr>
                            {columnas.map((columna) => (
                                <th key={columna} scope="col">
                                    <MathJax inline>{String.raw`\(${columna}\)`}</MathJax>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((fila, i) => (
                            <tr key={i}>
                                {fila.map((valor, j) => <td key={j}>{formatearAproximacion(valor)}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

const titulos: Record<EstadoRaiz, string> = {
    exacta: "Raíz exacta en la evaluación",
    aproximada: "Raíz aproximada",
    condicionada: "Aproximación condicionada a la continuidad",
    invalida: "Entradas inválidas",
    condiciones: "Condiciones del método incumplidas",
    interrumpida: "Interrupción numérica",
    limite: "Máximo de iteraciones alcanzado",
};

function esResultadoAceptado(estado: EstadoRaiz): boolean {
    return estado === "exacta" || estado === "aproximada" || estado === "condicionada";
}

function ResultadoNoLineal({ resultado }: { resultado: ResultadoRaiz<unknown> }) {
    const { estado, ultima, mensaje } = resultado;
    const exacta = estado === "exacta";
    const formatear = exacta ? formatearDecimal : formatearAproximacion;
    const relacion = exacta ? "=" : String.raw`\approx `;

    return (
        <section className="calculadora-nolineal__result" role="status">
            <div>
                <h3>{titulos[estado]}</h3>
                {mensaje && <p>{mensaje}</p>}
                {ultima && (
                    <>
                        {!esResultadoAceptado(estado) && <p>Última aproximación evaluada</p>}
                        <MathJax dynamic>{String.raw`\[x${relacion}${formatear(ultima.x)}\]`}</MathJax>
                    </>
                )}
            </div>
            {ultima && (
                <div>
                    <h3>Comprobación</h3>
                    <MathJax dynamic>{String.raw`\[|f(x)|${relacion}${formatear(Math.abs(ultima.fx))}\]`}</MathJax>
                    {ultima.semiancho !== undefined && <p>Semiancho del intervalo {formatearAproximacion(ultima.semiancho)}</p>}
                    {ultima.cambio !== undefined && <p>Cambio entre aproximaciones {formatearAproximacion(ultima.cambio)}</p>}
                </div>
            )}
        </section>
    );
}
