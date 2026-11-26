const decimal = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    maximumSignificantDigits: 21,
});

const decimalDeMagnitud = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    maximumSignificantDigits: 6,
});

export function formatearDecimal(valor: number): string {
    return valor === 0 ? "0" : decimal.format(valor);
}

export function formatearAproximacion(valor: number): string {
    const magnitud = Math.abs(valor);
    if (magnitud >= 1e7 || (magnitud > 0 && magnitud < 1e-4)) {
        return decimalDeMagnitud.format(valor);
    }
    return formatearDecimal(Number(valor.toFixed(6)));
}
