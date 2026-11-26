import { MathJax } from "better-react-mathjax";
import { useId, useState } from "react";
import type { EigenIteration, EigenResult } from "./metodos-potencia";
import "./resultados-potencia.scss";

const states = {
  converged: "Convergencia alcanzada",
  "zero-eigenpair": "Par propio nulo verificado",
  limit: "Máximo de iteraciones alcanzado",
  interrupted: "Interrupción numérica",
  invalid: "Entradas inválidas",
};

function format(value: number | null) {
  if (value === null) return "—";
  if (value !== 0 && (Math.abs(value) < 0.0001 || Math.abs(value) >= 1e7)) return value.toExponential(5);
  return Number(value.toFixed(6)).toString();
}

function GraficasPotencia({ iterations }: { iterations: EigenIteration[] }) {
  const estimates = iterations.flatMap(({ index, lambda }) => lambda === null ? [] : [{ index, lambda }]);
  const plane = iterations[0]?.vector.length === 2;
  if (!estimates.length && !plane) return null;

  return (
    <section className="potencia__section">
      <h2>Evolución de las aproximaciones</h2>
      <div className="resultado-propio__graficas">
        {estimates.length > 0 && <Convergencia estimates={estimates} />}
        {plane && <Vectores iterations={iterations} />}
      </div>
    </section>
  );
}

function Convergencia({ estimates }: { estimates: { index: number; lambda: number }[] }) {
  const gradient = useId();
  const last = estimates[estimates.length - 1];
  const scale = Math.max(...estimates.map(row => Math.abs(row.lambda))) || 1;
  const values = estimates.map(row => row.lambda / scale);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const spread = high - low;
  const margin = spread === 0 ? 0.12 : Math.max(spread * 0.12, 0.001);
  const limit = Number.MAX_VALUE / scale;
  const min = Math.max(-limit, low - margin);
  const max = Math.min(limit, high + margin);
  const x = (k: number) => 132 + k / (last.index + 0.15) * 302;
  const y = (value: number) => 177 - (value - min) / (max - min) * 153;
  const digits = Math.max(5, Math.min(8, Math.ceil(-Math.log10(max - min)) + 3));
  const yTicks = [...new Set(Array.from({ length: 5 }, (_, i) => min + (max - min) * i / 4))];
  const xTicks = [...new Set(Array.from({ length: 6 }, (_, i) => Math.round(last.index * i / 5)))];
  const path = estimates.map((row, i) => {
    const connect = i > 0 && estimates[i - 1].index + 1 === row.index;
    return `${connect ? "L" : "M"}${x(row.index)} ${y(values[i])}`;
  }).join(" ");
  const lastY = y(values[values.length - 1]);

  return (
    <figure className="resultado-propio__convergencia">
      <svg viewBox="0 0 456 216" role="img" aria-label="Valor propio aproximado por iteración">
        <defs><linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="132" x2="434">
          <stop stopColor="#8874f6" /><stop offset="1" stopColor="#3586d8" />
        </linearGradient></defs>
        {yTicks.map(value => (
          <g key={value}>
            <path d={`M127 ${y(value)} H434`} className="resultado-propio__ejes" />
            <text x="123" y={y(value)} textAnchor="end" dominantBaseline="middle">
              {(value * scale).toPrecision(digits)}
            </text>
          </g>
        ))}
        {xTicks.map(k => (
          <g key={k}>
            <path d={`M${x(k)} 24 V182`} className="resultado-propio__ejes" />
            <text x={x(k)} y="197" textAnchor="middle">{k}</text>
          </g>
        ))}
        <path d="M132 24 V177 H434" className="resultado-propio__eje" />
        <path d={`M132 ${lastY} H434`} className="resultado-propio__referencia" />
        <path d={path} className="resultado-propio__trayectoria" stroke={`url(#${gradient})`} />
        <circle cx={x(last.index)} cy={lastY} r="4" fill="#e64b45" />
        <text x="132" y="15">λ aproximado</text><text x="434" y="212" textAnchor="end">Iteración k</text>
      </svg>
      <figcaption><span className="resultado-propio__muestra" aria-hidden="true" /> Última estimación · k = {last.index}, λ ≈ {format(last.lambda)}</figcaption>
    </figure>
  );
}

function Vectores({ iterations }: { iterations: EigenIteration[] }) {
  const id = useId();
  const [selection, setSelection] = useState<number | null>(null);
  const last = iterations.length - 1;
  const selectedIndex = Math.min(selection ?? last, last);
  const selected = iterations[selectedIndex];
  const count = Math.min(selectedIndex, 8);
  const history = Array.from({ length: count }, (_, i) => iterations[Math.floor(i * selectedIndex / count)]);
  const arrow = (row: EigenIteration, selected: boolean) => (
    <line key={row.index} x1="100" y1="100" x2={100 + row.vector[0] * 72} y2={100 - row.vector[1] * 72}
      className={selected ? "resultado-propio__flecha--actual" : "resultado-propio__flecha"}
      stroke={selected ? undefined : `url(#${id}-azul)`}
      markerEnd={`url(#${id}-${selected ? "actual" : "historia"})`} />
  );

  return (
    <figure className="resultado-propio__direcciones">
      <svg viewBox="0 0 200 200" role="img" aria-label={`Vector normalizado de la iteración ${selected.index}`}>
        <defs>
          <linearGradient id={`${id}-azul`} gradientUnits="userSpaceOnUse" x1="28" x2="172">
            <stop stopColor="#60a3fb" /><stop offset="1" stopColor="#3586d8" />
          </linearGradient>
          <marker id={`${id}-historia`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0 0 L8 4 L0 8 Z" fill="#3586d8" />
          </marker>
          <marker id={`${id}-actual`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="9" markerHeight="9" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0 0 L8 4 L0 8 Z" fill="#e64b45" />
          </marker>
        </defs>
        <path d="M28 28 H172 V172 H28 Z" className="resultado-propio__ejes" />
        <path d="M18 100 H183 M100 18 V183" className="resultado-propio__eje" />
        {history.map(row => arrow(row, false))}
        {arrow(selected, true)}
        <text x="176" y="94">x₁</text><text x="108" y="24">x₂</text>
        <text x="25" y="113">−1</text><text x="165" y="113">1</text>
      </svg>
      <figcaption>
        <label htmlFor={id}>Vector de la iteración {selected.index}</label>
        <input id={id} type="range" min={0} max={last} value={selectedIndex} disabled={last === 0}
          onChange={event => setSelection(Number(event.target.value))} />
        <output htmlFor={id}>x₁ = {format(selected.vector[0])}, x₂ = {format(selected.vector[1])}</output>
      </figcaption>
    </figure>
  );
}

function MathLabel({ tex }: { tex: string }) {
  return <MathJax inline dynamic>{String.raw`\(${tex}\)`}</MathJax>;
}

function formatTex(value: number) {
  return format(value).replace(/e([+-]?\d+)$/, (_, exponent) => String.raw`\times 10^{${Number(exponent)}}`);
}

function Vector({ values, label }: { values: number[] | null; label?: string }) {
  if (!values) return <>—</>;
  if (label) {
    const entries = values.map(formatTex);
    return <span aria-label={label}><MathLabel tex={String.raw`\begin{bmatrix}${entries.join(String.raw`\\`)}\end{bmatrix}`} /></span>;
  }
  return (
    <span className="resultado-propio__vector">
      {values.map((value, i) => <span key={i}>{format(value)}</span>)}
    </span>
  );
}

export function ResultadosPotencia({ result, inversa }: { result: EigenResult; inversa: boolean }) {
  const { iterations, status, verification } = result;
  const last = iterations.at(-1);
  const pair = iterations[verification?.index ?? -1];
  const established = status === "converged" || status === "zero-eigenpair";

  return (
    <div className="resultado-propio">
      <section className="potencia__section">
        <h2>{established ? "Par propio aproximado" : pair ? "Última aproximación no convergente" : "Resultado del cálculo"}</h2>
        <p role={status === "invalid" ? "alert" : "status"}><strong>{states[status]}.</strong> {result.message}</p>
        {pair && (
          <div className="resultado-propio__par">
            <div><MathLabel tex={String.raw`\lambda\approx`} /> <strong>{format(pair.lambda)}</strong></div>
            <div><MathLabel tex={String.raw`v\approx`} /> <Vector values={pair.vector} label="Vector propio aproximado" /></div>
          </div>
        )}
        {last && (
          <dl className="resultado-propio__metricas">
            <div><dt>Iteraciones realizadas</dt><dd>{last.index}</dd></div>
            {pair && <div><dt>Iteración del par</dt><dd>{pair.index}</dd></div>}
            <div><dt><MathLabel tex={String.raw`|\lambda|`} /></dt><dd>{format(pair?.lambda == null ? null : Math.abs(pair.lambda))}</dd></div>
            <div><dt>Error absoluto</dt><dd>{format(pair?.error ?? null)}</dd></div>
            <div><dt>Residuo</dt><dd>{format(pair?.residual ?? null)}</dd></div>
            <div><dt>Norma infinito del vector</dt><dd>{pair ? Math.max(...pair.vector.map(Math.abs)) : "—"}</dd></div>
          </dl>
        )}
        {pair && last && pair.index !== last.index && <p>El resumen muestra el último par con residuo calculable.</p>}
        {pair && verification && (
          <div className="resultado-propio__comprobacion">
            <h3>Comprobación del par</h3>
            <MathLabel tex={String.raw`Av\approx\lambda v`} />
            <div className="resultado-propio__par">
              <div><MathLabel tex="Av" /> <Vector values={verification.av} label="Producto Av" /></div>
              <div><MathLabel tex={String.raw`\lambda v`} /> <Vector values={verification.lambdaV} label="Producto lambda v" /></div>
            </div>
            <p>Un residuo pequeño verifica un par propio aproximado. El espectro y el vector inicial determinan si se alcanza el valor propio de la magnitud buscada.</p>
          </div>
        )}
      </section>

      {last && (
        <section className="potencia__section">
          <h2>Tabla de iteraciones</h2>
          <p>La fila 0 muestra la normalización inicial. La estimación usa el pivote anterior y el divisor <MathLabel tex="c_k" /> usa el nuevo.</p>
          {status === "zero-eigenpair" && <p>La última fila conserva el vector anterior porque el producto es nulo.</p>}
          <div className="potencia__table-wrapper" tabIndex={0} role="region" aria-label="Tabla de iteraciones">
            <table className="potencia__table">
              <thead><tr>
                <th scope="col"><MathLabel tex="k" /></th>
                <th scope="col"><MathLabel tex="x^{(k-1)}" /></th>
                <th scope="col"><MathLabel tex="y^{(k)}" /></th>
                <th scope="col"><MathLabel tex="c_k" /></th>
                <th scope="col"><MathLabel tex="x^{(k)}" /></th>
                {inversa && <th scope="col"><MathLabel tex={String.raw`\mu_k\;(A^{-1})`} /></th>}
                <th scope="col"><MathLabel tex={String.raw`\lambda_k\;(A)`} /></th>
                <th scope="col">Error absoluto</th>
              </tr></thead>
              <tbody>{iterations.map(row => (
                <tr key={row.index} className={row.index === pair?.index ? "resultado-propio__fila-final" : undefined}>
                  <th scope="row">{row.index}</th>
                  <td><Vector values={iterations[row.index - 1]?.vector ?? null} /></td>
                  <td><Vector values={row.auxiliary} /></td>
                  <td>{format(row.divisor)}</td>
                  <td><Vector values={row.vector} /></td>
                  {inversa && <td>{format(row.mu)}</td>}
                  <td className="resultado-propio__estimacion">{format(row.lambda)}</td>
                  <td>{format(row.error)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      )}
      {last && <ProcedimientoPotencia iterations={iterations} initial={result.initial} inversa={inversa} />}
      <GraficasPotencia iterations={iterations} />
    </div>
  );
}

function ProcedimientoPotencia({ iterations, initial, inversa }: {
  iterations: EigenIteration[];
  initial?: number[];
  inversa: boolean;
}) {
  const id = useId();
  const [index, setIndex] = useState<number | null>(null);
  const row = iterations[Math.min(index ?? iterations.length - 1, iterations.length - 1)];
  const previous = iterations[row.index - 1];
  const pivot = row.pivot === null ? null : row.pivot + 1;
  const previousPivot = previous?.pivot == null ? null : previous.pivot + 1;

  return (
    <section className="potencia__section resultado-propio__procedimiento">
      <div className="potencia__section-header">
        <h2>Procedimiento paso a paso</h2>
        <div className="potencia__size">
          <label htmlFor={id}>Iteración</label>
          <select id={id} value={row.index} onChange={event => setIndex(Number(event.target.value))}>
            {iterations.map(({ index }) => <option key={index} value={index}>{index}</option>)}
          </select>
        </div>
      </div>
      {previous ? (
        <ol>
          <li>
            <h3>{inversa ? "Resuelve el sistema lineal" : "Multiplica por la matriz"}</h3>
            <MathLabel tex={inversa ? String.raw`Ay^{(k)}=x^{(k-1)}` : String.raw`Ax^{(k-1)}=y^{(k)}`} />
            <div className="resultado-propio__ecuacion">
              <MathLabel tex="A" />
              <Vector values={inversa ? row.auxiliary : previous.vector} />
              <MathLabel tex={String.raw`\approx`} />
              <Vector values={inversa ? previous.vector : row.auxiliary} />
            </div>
          </li>
          <li>
            <h3>Identifica la componente de mayor magnitud</h3>
            {pivot !== null && row.divisor !== null ? (
              <MathLabel tex={String.raw`p_k=${pivot},\qquad c_k=y^{(k)}_{${pivot}}\approx ${formatTex(row.divisor)}`} />
            ) : <p>El vector auxiliar es nulo y no hay un divisor válido.</p>}
          </li>
          <li>
            <h3>{row.divisor === null ? "Conserva el vector anterior" : "Normaliza el vector auxiliar"}</h3>
            <div className="resultado-propio__ecuacion">
              <MathLabel tex={row.divisor === null ? String.raw`v=x^{(k-1)}\approx` : String.raw`x^{(k)}=\frac{y^{(k)}}{c_k}\approx`} />
              <Vector values={row.vector} />
            </div>
          </li>
          <li>
            <h3>Estima con el pivote anterior</h3>
            {row.mu !== null && previousPivot !== null && (
              <MathLabel tex={String.raw`p_{k-1}=${previousPivot},\qquad ${inversa ? String.raw`\mu_k` : String.raw`\lambda_k`}=y^{(k)}_{${previousPivot}}\approx ${formatTex(row.mu)}`} />
            )}
          </li>
          {inversa && (
            <li>
              <h3>Calcula el recíproco</h3>
              {row.lambda === null ? <p>El recíproco no está definido como número finito.</p> : (
                <MathLabel tex={String.raw`\lambda_k=\frac{1}{\mu_k}\approx ${formatTex(row.lambda)}`} />
              )}
            </li>
          )}
        </ol>
      ) : (
        <div>
          <h3>Normaliza el vector inicial</h3>
          {pivot !== null && row.divisor !== null && <MathLabel tex={String.raw`p_0=${pivot},\qquad c_0\approx ${formatTex(row.divisor)}`} />}
          <div className="resultado-propio__ecuacion">
            <MathLabel tex={String.raw`x^{(0)}=\frac{1}{c_0}`} />
            <Vector values={initial ?? null} />
            <MathLabel tex={String.raw`\approx`} />
            <Vector values={row.vector} />
          </div>
        </div>
      )}
      <dl className="resultado-propio__metricas">
        <div><dt>Error absoluto</dt><dd>{format(row.error)}</dd></div>
        <div><dt>Residuo</dt><dd>{format(row.residual)}</dd></div>
      </dl>
    </section>
  );
}

