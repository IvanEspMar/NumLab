
import "./biseccion.scss";
import RowBisec from "./tablas";

function ecuation(x:number) {
  return x^3 + 8 * x - 7
}

function Biseccion() {

 
  return (
    <section className="seccion-biseccion">
      <h1>MÉTODO DE BISECCIÓN</h1>
      <div className="intervalo-biseccion">
        <h3>Intervalo inicial</h3>
        <label>a: <input type="number" placeholder="0" /></label>
        <label>b: <input type="number" placeholder="0" /></label>
        <button>Calcular</button>
      </div>
      <table>
        <tr>
          <th>a</th>
          <th>b</th>
          <th>c</th>
          <th>f(a)</th>
          <th>f(b)</th>
          <th>f(c)</th>
        </tr>
        <RowBisec a={0.14354} b={1.54815} c={2.15465} fa={37894.125487} fb={5.18445} fc={8.54865}/>
        <RowBisec a={0.14354} b={1.54815} c={2.15465} fa={37894.125487} fb={5.18445} fc={8.54865}/>
        <RowBisec a={0.14354} b={1.54815} c={2.15465} fa={37894.125487} fb={5.18445} fc={8.54865}/>
        <RowBisec a={0.14354} b={1.54815} c={2.15465} fa={37894.125487} fb={5.18445} fc={8.54865}/>
      </table>

    </section>
  );
}


export default Biseccion;
