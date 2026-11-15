interface RowBisecProps {
    a: number;
    b: number;
    c: number;
    fa: number;
    fb: number;
    fc: number;
}

function RowBisec({ a, b, c, fa, fb, fc }: RowBisecProps) {
    return (
        <tr>
            <td>{a}</td>
            <td>{b}</td>
            <td>{c}</td>
            <td>{fa}</td>
            <td>{fb}</td>
            <td>{fc}</td>
        </tr>
    );
}

export default RowBisec;