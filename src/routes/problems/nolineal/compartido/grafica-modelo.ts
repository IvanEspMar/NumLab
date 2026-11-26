import { evaluarReal, type FuncionReal } from "../calculo/funcion-real.ts";

type Range = readonly [number, number];
type Evaluate = (x: number) => number | null;

export type GraphInput =
    | { method: "biseccion"; a: number; b: number }
    | { method: "newton"; x: number; derivative: FuncionReal }
    | { method: "secante"; x0: number; x1: number };

interface GraphPoint {
    x: number;
    y: number;
    label: string;
}

export interface GraphData {
    evaluate: Evaluate;
    x: Range;
    y: Range;
    points?: readonly GraphPoint[];
    interval?: Range;
    result?: { x: number; fx: number };
}

function finiteBound(value: number): number {
    return Math.max(-Number.MAX_VALUE, Math.min(Number.MAX_VALUE, value));
}

function interpolate([min, max]: Range, t: number): number {
    return min * (1 - t) + max * t;
}

export function normalize(value: number, [min, max]: Range): number {
    const width = max - min;
    return Number.isFinite(width)
        ? (value - min) / width
        : (value / 2 - min / 2) / (max / 2 - min / 2);
}

function paddedRange(min: number, max: number, padding: number, fallback: number): Range {
    const halfWidth = max / 2 - min / 2;
    const minimum = Math.max(Math.abs(min), Math.abs(max)) * Number.EPSILON * 16;
    const margin = Math.max(halfWidth * (2 * padding), minimum, Number.MIN_VALUE * 1024);
    const extra = min === max ? Math.max(fallback, margin) : margin;
    return [finiteBound(min - extra), finiteBound(max + extra)];
}

function sampleHeights(evaluate: Evaluate, range: Range): number[] {
    return Array.from({ length: 41 }, (_, i) => evaluate(interpolate(range, i / 40)))
        .filter((value): value is number => value !== null)
        .sort((a, b) => a - b);
}

export function createInputGraph(expression: FuncionReal, input: GraphInput): GraphData | null {
    const evaluate: Evaluate = (x) => evaluarReal(expression, x);
    let x: Range;
    let interval: Range | undefined;
    const points: GraphPoint[] = [];

    switch (input.method) {
        case "biseccion": {
            if (!Number.isFinite(input.a) || !Number.isFinite(input.b) || input.a >= input.b) return null;
            interval = [input.a, input.b];
            x = paddedRange(input.a, input.b, 0.18, 1);
            points.push({ x: input.a, y: 0, label: "a" }, { x: input.b, y: 0, label: "b" });
            break;
        }
        case "newton": {
            const y = evaluate(input.x);
            if (y === null) return null;
            const slope = evaluarReal(input.derivative, input.x);
            const fallback = Math.max(1, Math.abs(input.x) * 0.15);
            const step = slope === null || slope === 0 ? Infinity : Math.abs(y / slope);
            const radius = step > Number.EPSILON * fallback * 16 && step / fallback < 1e4
                ? finiteBound(step * 1.35)
                : fallback;
            x = paddedRange(finiteBound(input.x - radius), finiteBound(input.x + radius), 0.05, fallback);
            points.push({ x: input.x, y, label: "x₀" });
            break;
        }
        case "secante": {
            const y0 = evaluate(input.x0);
            const y1 = evaluate(input.x1);
            if (y0 === null || y1 === null) return null;
            const fallback = Math.max(1, Math.abs(input.x0) * 0.15);
            x = paddedRange(Math.min(input.x0, input.x1), Math.max(input.x0, input.x1), 0.45, fallback);
            if (input.x0 === input.x1) {
                points.push({ x: input.x0, y: y0, label: "x₀ = x₁" });
            } else {
                points.push({ x: input.x0, y: y0, label: "x₀" }, { x: input.x1, y: y1, label: "x₁" });
            }
            break;
        }
    }

    const heights = [0, ...points.map((point) => point.y)];
    if (interval || !heights.some((height) => height !== 0)) {
        const samples = sampleHeights(evaluate, x);
        const trim = Math.floor(samples.length * 0.1);
        if (samples.length) heights.push(samples[trim], samples[samples.length - 1 - trim]);
    }
    if (interval) {
        for (const end of interval) {
            const value = evaluate(end);
            if (value !== null) heights.push(value);
        }
    }

    return { evaluate, x, y: paddedRange(Math.min(...heights), Math.max(...heights), 0.18, 1), points, interval };
}

export function createSolutionGraph(input: GraphData, result: { x: number; fx: number }): GraphData {
    const position = normalize(result.x, input.x);
    const x = position > 0.02 && position < 0.98
        ? input.x
        : paddedRange(Math.min(result.x, input.x[0]), Math.max(result.x, input.x[1]), 0.07, 1);
    const y = result.fx >= input.y[0] && result.fx <= input.y[1]
        ? input.y
        : paddedRange(Math.min(result.fx, input.y[0]), Math.max(result.fx, input.y[1]), 0.07, 1);
    return { evaluate: input.evaluate, x, y, result };
}

type Sample = readonly [number, number | null];
type PlotPoint = readonly [number, number];

export function sampleCurve(graph: GraphData): PlotPoint[][] {
    const segments: PlotPoint[][] = [];
    let segment: PlotPoint[] = [];
    const zero = normalize(0, graph.y);

    function sample(t: number): Sample {
        const value = graph.evaluate(interpolate(graph.x, t));
        return [t, value === null ? null : normalize(value, graph.y)];
    }

    function add(left: PlotPoint, right: PlotPoint) {
        if (segment.at(-1)?.[0] !== left[0]) {
            segment = [left];
            segments.push(segment);
        }
        segment.push(right);
    }

    function refine(left: Sample, right: Sample, depth: number) {
        const middle = sample((left[0] + right[0]) / 2);
        const [a, b, c] = [left[1], middle[1], right[1]];
        if (a === null || b === null || c === null) {
            if (depth < 5 && (a !== null || b !== null || c !== null)) {
                refine(left, middle, depth + 1);
                refine(middle, right, depth + 1);
            }
            return;
        }
        if ((a > 1.1 && b > 1.1 && c > 1.1) || (a < -0.1 && b < -0.1 && c < -0.1)) return;

        const deviation = Math.abs(b - (a / 2 + c / 2));
        const jump = Math.max(Math.abs(a - b), Math.abs(b - c));
        const crossesAxis = (a < zero && c > zero) || (a > zero && c < zero);
        const curvedCrossing = crossesAxis && deviation > Math.abs(a - c) * 0.3;
        if (depth < 5 && (deviation > 0.005 || jump > 0.25 || curvedCrossing)) {
            refine(left, middle, depth + 1);
            refine(middle, right, depth + 1);
            return;
        }
        if (!Number.isFinite(deviation) || curvedCrossing || (jump > 0.35 && deviation > 0.1)) return;

        const bounded = (value: number) => Math.max(-1e4, Math.min(1e4, value));
        add([left[0], bounded(a)], [middle[0], bounded(b)]);
        add([middle[0], bounded(b)], [right[0], bounded(c)]);
    }

    const divisions = 160;
    const stops = new Set(Array.from({ length: divisions }, (_, index) => (index + 1) / divisions));
    const anchors = graph.result ? [graph.result.x] : graph.points?.map((point) => point.x) ?? [];
    for (const anchor of anchors) {
        const position = normalize(anchor, graph.x);
        if (position > 0 && position < 1) stops.add(position);
    }
    let left = sample(0);
    for (const stop of [...stops].sort((a, b) => a - b)) {
        const right = sample(stop);
        refine(left, right, 0);
        left = right;
    }
    return segments;
}

export function axisTicks(range: Range, count: number) {
    const [min, max] = range;
    const halfWidth = max / 2 - min / 2;
    const magnitude = Math.max(Math.abs(min), Math.abs(max));
    const offset = halfWidth / magnitude < 1e-5 ? min : 0;
    const roughStep = halfWidth / count * 2;
    const unit = Math.max(Number.MIN_VALUE, 10 ** Math.floor(Math.log10(roughStep)));
    const spacing = ([1, 2, 2.5, 5, 10].find((multiple) => multiple >= roughStep / unit) ?? 10) * unit;
    const first = Math.ceil((min - offset) / spacing);
    const last = Math.floor((max - offset) / spacing);
    const ticks = [];
    for (let index = first; index <= last && ticks.length < 12; index++) {
        const labelValue = index * spacing;
        const position = normalize(labelValue + offset, range);
        if (!(position >= 0 && position <= 1)) break;
        ticks.push({ position, label: formatGraphNumber(labelValue) });
    }
    return { ticks, offset };
}

export function formatGraphNumber(value: number, digits = 6): string {
    const text = value.toPrecision(digits);
    const rounded = Number(text);
    const compact = (Math.abs(rounded) >= 1e7 || (rounded !== 0 && Math.abs(rounded) < 1e-4))
        ? rounded.toExponential()
        : rounded.toString();
    return (Number.isFinite(rounded) ? compact : text).replace(/-/g, "−");
}
