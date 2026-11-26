import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { axisTicks, formatGraphNumber, normalize, sampleCurve, type GraphData } from "./grafica-modelo";
import "./grafica-matematica.scss";

export const GraficaMatematica = memo(function GraficaMatematica({ data }: { data: GraphData }) {
    const id = useId();
    const figure = useRef<HTMLElement>(null);
    const [width, setWidth] = useState(420);
    const segments = useMemo(() => sampleCurve(data), [data]);

    useEffect(() => {
        const element = figure.current;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            if (entry.contentRect.width > 0) setWidth(Math.round(entry.contentRect.width));
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const left = width < 360 ? 59 : 71;
    const right = width - 21;
    const top = 25;
    const height = Math.min(340, Math.max(194, Math.round(width * 0.57)));
    const bottom = height - 35;
    const plotWidth = Math.max(1, right - left);
    const plotHeight = bottom - top;
    const plotX = (position: number) => left + position * plotWidth;
    const plotY = (position: number) => bottom - position * plotHeight;
    const x = (value: number) => plotX(normalize(value, data.x));
    const y = (value: number) => plotY(normalize(value, data.y));
    const zeroY = y(0);
    const xTicks = axisTicks(data.x, Math.max(2, Math.floor(plotWidth / 66)));
    const yTicks = axisTicks(data.y, Math.max(2, Math.floor(plotHeight / 38)));
    const path = segments.map((segment) => segment.map(([u, v], index) =>
        `${index === 0 ? "M" : "L"}${plotX(u).toFixed(2)} ${plotY(v).toFixed(2)}`,
    ).join(" ")).join(" ");
    const rootLabel = data.root === undefined ? null : `x ≈ ${formatGraphNumber(data.root, 9)}`;
    const title = rootLabel ? `Gráfica de la solución, ${rootLabel}` : "Gráfica de los datos de entrada";
    const points = data.points ?? [];

    return (
        <figure className="grafica-matematica" ref={figure}>
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title`}>
                <title id={`${id}-title`}>{title}</title>
                <defs>
                    <clipPath id={`${id}-plot`}>
                        <rect x={left} y={top} width={plotWidth} height={plotHeight} />
                    </clipPath>
                    <linearGradient id={`${id}-curve`} gradientUnits="userSpaceOnUse" x1={left} y1={0} x2={right} y2={0}>
                        <stop stopColor="#8874f6" />
                        <stop offset="0.52" stopColor="#606df9" />
                        <stop offset="1" stopColor="#3586d8" />
                    </linearGradient>
                    <linearGradient id={`${id}-interval`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop stopColor="#8874f6" stopOpacity="0.16" />
                        <stop offset="1" stopColor="#60a3fb" stopOpacity="0.06" />
                    </linearGradient>
                </defs>

                <rect className="grafica-matematica__area" x={left} y={top} width={plotWidth} height={plotHeight} />
                <g clipPath={`url(#${id}-plot)`}>
                    {data.interval && (
                        <rect x={x(data.interval[0])} y={top} width={x(data.interval[1]) - x(data.interval[0])}
                            height={plotHeight} fill={`url(#${id}-interval)`} />
                    )}
                    <g className="grafica-matematica__grid">
                        {xTicks.ticks.map(({ position }) => <line key={position} x1={plotX(position)} y1={top} x2={plotX(position)} y2={bottom} />)}
                        {yTicks.ticks.map(({ position }) => <line key={position} x1={left} y1={plotY(position)} x2={right} y2={plotY(position)} />)}
                    </g>
                    <g className="grafica-matematica__axes">
                        <line x1={left} y1={zeroY} x2={right} y2={zeroY} />
                        {data.x[0] <= 0 && data.x[1] >= 0 && <line x1={x(0)} y1={top} x2={x(0)} y2={bottom} />}
                    </g>
                    {points.map((point) => (
                        <line className="grafica-matematica__guide" key={point.label}
                            x1={x(point.x)} x2={x(point.x)} y1={data.interval ? top : y(point.y)} y2={data.interval ? bottom : zeroY} />
                    ))}
                    <path className="grafica-matematica__curve" d={path} stroke={`url(#${id}-curve)`} />
                    {points.map((point) => (
                        <Point key={point.label} x={x(point.x)} y={y(point.y)} />
                    ))}
                    {data.root !== undefined && <Point x={x(data.root)} y={zeroY} root />}
                </g>

                <g className="grafica-matematica__ticks">
                    {xTicks.ticks.map(({ position, label }) => (
                        <text key={position} x={plotX(position)} y={bottom + 17} textAnchor="middle">{label}</text>
                    ))}
                    {yTicks.ticks.map(({ position, label }) => (
                        <text key={position} x={left - 7} y={plotY(position)} textAnchor="end" dominantBaseline="middle">{label}</text>
                    ))}
                    <text x={left} y={16}>{yTicks.offset ? `y − (${formatGraphNumber(yTicks.offset, 16)})` : "y"}</text>
                    <text x={right} y={height - 4} textAnchor="end">
                        {xTicks.offset ? `x − (${formatGraphNumber(xTicks.offset, 16)})` : "x"}
                    </text>
                </g>

                {points.map((point, index) => {
                    const nearOther = points.some((other) => other !== point && Math.abs(x(other.x) - x(point.x)) < 38);
                    const anchor = nearOther ? (point.x <= points[1 - index].x ? "end" : "start") : "middle";
                    const dx = anchor === "end" ? -8 : anchor === "start" ? 8 : 0;
                    const py = y(point.y);
                    return <text className="grafica-matematica__point-label" key={point.label} textAnchor={anchor}
                        x={Math.max(left + 19, Math.min(right - 19, x(point.x) + dx))} y={py < top + 22 ? py + 20 : py - 12}>
                        {point.label}
                    </text>;
                })}
            </svg>
            {segments.length === 0 && <p className="grafica-matematica__note">No hay valores reales visibles en esta escala.</p>}
            {rootLabel && <figcaption className="grafica-matematica__root">{rootLabel}</figcaption>}
        </figure>
    );
});

function Point({ x, y, root = false }: { x: number; y: number; root?: boolean }) {
    return (
        <g className={root ? "grafica-matematica__root-point" : "grafica-matematica__point"}>
            <circle cx={x} cy={y} r={10} opacity={0.13} />
            <circle cx={x} cy={y} r={7} opacity={0.24} />
            <circle cx={x} cy={y} r={4} stroke="white" strokeWidth={1} />
        </g>
    );
}
