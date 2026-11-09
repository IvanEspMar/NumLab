
import { useMemo, useId, useState } from 'react';
import { compile } from 'mathjs';
import './graficadora.scss';

const WIDTH = 800;
const HEIGHT = 420;

const X_MIN = -6;
const X_MAX = 6;
const Y_MIN = -4;
const Y_MAX = 4;

const MARGEN = 35;

function Graficadora() {
  const [expresion, setExpresion] = useState('x^2 - 4');

  const gradientId = useId().replace(/:/g, '');

  // Transformación de coordenadas matemáticas a SVG
  const escalaX = (x: number) =>
    MARGEN + ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - MARGEN * 2);

  const escalaY = (y: number) =>
    HEIGHT - MARGEN -
    ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (HEIGHT - MARGEN * 2);

  // Evaluación y generación de la curva
  const resultado = useMemo(() => {
    try {
      const funcion = compile(expresion);
      const muestras = 1200;

      let path = '';
      let anteriorY: number | null = null;

      for (let i = 0; i <= muestras; i++) {
        const x = X_MIN + (i / muestras) * (X_MAX - X_MIN);

        const y = funcion.evaluate({ x });

        if (
          typeof y !== 'number' ||
          !Number.isFinite(y) ||
          y < Y_MIN ||
          y > Y_MAX
        ) {
          anteriorY = null;
          continue;
        }

        const px = escalaX(x);
        const py = escalaY(y);

        // Evitar unir puntos separados por discontinuidades
        const salto =
          anteriorY !== null &&
          Math.abs(py - anteriorY) > HEIGHT * 0.25;

        path +=
          anteriorY === null || salto
            ? `M ${px} ${py} `
            : `L ${px} ${py} `;

        anteriorY = py;
      }

      return { path, error: false };
    } catch {
      return { path: '', error: true };
    }
  }, [expresion]);

  // Divisiones de la cuadrícula
  const divisionesX = Array.from(
    { length: X_MAX - X_MIN + 1 },
    (_, i) => X_MIN + i
  );

  const divisionesY = Array.from(
    { length: Y_MAX - Y_MIN + 1 },
    (_, i) => Y_MIN + i
  );

  return (
    <section className="graficadora">

      <header className="graficadora__encabezado">
        <div>
          <span className="graficadora__etiqueta">
            VISUALIZACIÓN MATEMÁTICA
          </span>

          <h2>Graficadora</h2>
        </div>

        <div className="graficadora__entrada">
          <label htmlFor="expresion">f(x) =</label>

          <input
            id="expresion"
            type="text"
            value={expresion}
            onChange={(e) => setExpresion(e.target.value)}
            placeholder="Ej. x^2 - 4"
          />
        </div>
      </header>

      <div className="graficadora__contenedor">

        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="graficadora__svg"
          role="img"
          aria-label={`Gráfica de la función ${expresion}`}
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#41B0EA" />
              <stop offset="50%" stopColor="#8A70F8" />
              <stop offset="100%" stopColor="#41B0EA" />
            </linearGradient>
          </defs>

          {/* Cuadrícula vertical */}
          {divisionesX.map((x) => (
            <line
              key={`x-${x}`}
              x1={escalaX(x)}
              y1={MARGEN}
              x2={escalaX(x)}
              y2={HEIGHT - MARGEN}
              className="graficadora__cuadricula"
            />
          ))}

          {/* Cuadrícula horizontal */}
          {divisionesY.map((y) => (
            <line
              key={`y-${y}`}
              x1={MARGEN}
              y1={escalaY(y)}
              x2={WIDTH - MARGEN}
              y2={escalaY(y)}
              className="graficadora__cuadricula"
            />
          ))}

          {/* Ejes cartesianos */}
          <line
            x1={MARGEN}
            y1={escalaY(0)}
            x2={WIDTH - MARGEN}
            y2={escalaY(0)}
            className="graficadora__eje"
          />

          <line
            x1={escalaX(0)}
            y1={MARGEN}
            x2={escalaX(0)}
            y2={HEIGHT - MARGEN}
            className="graficadora__eje"
          />

          {/* Etiquetas del eje X */}
          {divisionesX.map((x) => (
            <text
              key={`label-x-${x}`}
              x={escalaX(x)}
              y={escalaY(0) + 20}
              className="graficadora__texto"
              textAnchor="middle"
            >
              {x === 0 ? '' : x}
            </text>
          ))}

          {/* Etiquetas del eje Y */}
          {divisionesY.map((y) => (
            <text
              key={`label-y-${y}`}
              x={escalaX(0) - 12}
              y={escalaY(y) + 4}
              className="graficadora__texto"
              textAnchor="end"
            >
              {y === 0 ? '' : y}
            </text>
          ))}

          {/* Curva matemática */}
          {!resultado.error && (
            <>
              <path
                d={resultado.path}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity=".12"
              />

              <path
                d={resultado.path}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

        </svg>

        {resultado.error && (
          <p className="graficadora__error">
            No se pudo interpretar la expresión matemática.
          </p>
        )}

      </div>

      <footer className="graficadora__pie">
        <span>DOMINIO: [{X_MIN}, {X_MAX}]</span>
        <span>RANGO: [{Y_MIN}, {Y_MAX}]</span>
      </footer>

    </section>
  );
}

export default Graficadora;
