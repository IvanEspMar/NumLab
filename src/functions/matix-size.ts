
// Esta funcion aumenta y disminuye el tamaño de una matriz manteniendo sus valores
export function resizeMatrix(matrix: number[][], newSize: number): number[][] {
    const currentSize = matrix.length;

    if (newSize === currentSize)
        return matrix.map(row => [...row]);

    if (newSize < currentSize) {
        return matrix
            .slice(0, newSize)
            .map(row => row.slice(0, newSize));
    }

    const newMatrix = matrix.map(row => [
        ...row,
        ...Array(newSize - currentSize).fill(0)
    ]);

    while (newMatrix.length < newSize)
        newMatrix.push(Array(newSize).fill(0));

    return newMatrix;
}
