export interface RowBisecProps {
    a: number;
    b: number;
    c: number;
    fa: number;
    fb: number;
    fc: number;
    i: number | String;
}

function RowBisec({ a, b, c, fa, fb, fc, i }: RowBisecProps) {
    return (
        <tr>
            <td>{i}</td>
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