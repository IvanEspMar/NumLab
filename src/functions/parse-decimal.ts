export function parseDecimal(input: string): number {
    const value = input.trim().replace(/^−/, "-").replace(",", ".");

    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) {
        return NaN;
    }

    return Number(value);
}
