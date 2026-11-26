import { MathJax } from "better-react-mathjax";
import { useId, type ReactNode } from "react";
import { Link } from "react-router";
import { GraficaMatematica } from "./grafica-matematica";
import type { GraphData } from "./grafica-modelo";
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
    solutionGraph: GraphData | null;
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
    solutionGraph,
    graphHint = "Ingresa valores iniciales donde la función esté definida.",
}: CalculadoraNoLinealProps) {
    const equationId = useId();

    return (
        <section className="calculadora-nolineal">
            <header className="calculadora-nolineal__header">
                <h1>{title}<span className="punto">.</span></h1>
                <Link to={introductionPath}>Más detalles <span aria-hidden="true">→</span></Link>
            </header>

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
                    <h2>Gráfica de la última solución</h2>
                    <GraficaMatematica data={solutionGraph} />
                </section>
            )}
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

export function EncabezadosIteraciones({ columns }: { columns: readonly string[] }) {
    return (
        <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column} scope="col">
                        <MathJax inline>{String.raw`\(${column}\)`}</MathJax>
                    </th>
                ))}
            </tr>
        </thead>
    );
}

export function ResultadoNoLineal({ x, fx }: { x: string; fx: string }) {
    return (
        <div className="calculadora-nolineal__result" role="status">
            <div>
                <h3>Resultado</h3>
                <MathJax dynamic>{String.raw`\[x\approx ${x}\]`}</MathJax>
            </div>
            <div>
                <h3>Comprobación</h3>
                <MathJax dynamic>{String.raw`\[f(${x})\approx ${fx}\]`}</MathJax>
            </div>
        </div>
    );
}
