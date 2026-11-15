
import { useState } from "react";
import "./biseccion.scss";
import RowBisec, {type RowBisecProps} from "./tablas";

function ecuation(x:number) {
  return (x ** 3 + 8 * x - 7)  * -1
}

function Biseccion() {
  const [iteration, setIterations] = useState<RowBisecProps[]>([])
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const intervaIsValid = a < b
  const hasSignChange =  ecuation(a) * ecuation(b) < 0
  
  
  function computeIterations() {
    const c1 = (a + b) / 2
    const firstIteration:RowBisecProps = {a: a, b:b, c: c1, fa: ecuation(a), fb: ecuation(b), fc: ecuation(c1), i: 0}
    let interations = [firstIteration]
    let i = 0
    do {
      const acHasSignChange = interations[i].fa * interations[i].fc < 0
      const newA = acHasSignChange ? interations[i].a : interations[i].c
      const newB = acHasSignChange ? interations[i].c : interations[i].b
      const newC = (newA + newB) / 2
      const fa = ecuation(newA)
      const fb = ecuation(newB)
      const fc = ecuation(newC)
      const newItaration = {a: newA, b:newB, c: newC, fa: fa, fb: fb, fc: fc, i:i}
      
      interations.push(newItaration)
      i++
      if(Math.abs(Number((ecuation(newC)).toFixed(5))) == 0) break
    } while (i < 50)
      console.log(interations);
      
    setIterations(interations)
  }

  return (
    <section className="seccion-biseccion">
      <h1>MÉTODO DE BISECCIÓN</h1>
      <div className="intervalo-biseccion">
        <h3>Intervalo inicial</h3>
        <label>a: <input value={a} onChange={(e) => setA(Number(e.target.value))} type="number" placeholder="0" /></label>
        <label>b: <input value={b} onChange={(e) => setB(Number(e.target.value))} type="number" placeholder="0" /></label>
        <button disabled={!intervaIsValid} onClick={() => computeIterations()}>Calcular</button>
        {intervaIsValid ? "" : "Intervalo invalido a mayor que b"}
        {hasSignChange || !intervaIsValid ? "": "Intervalo invalido f(a) y f(b) tienen el mismo signo"}
      </div>
      {iteration.length > 0 && 
      <table>
        <thead>
          <tr>
            <td>n</td>
            <th>a</th>
            <th>b</th>
            <th>c</th>
            <th>f(a)</th>
            <th>f(b)</th>
            <th>f(c)</th>
          </tr> 
        </thead>
        <tbody>
          {iteration.map((iteration, i) => 
            <RowBisec i={i + 1} 
              a={Number(iteration.a.toFixed(7))} 
              b={Number((iteration.b).toFixed(7))} 
              c={Number((iteration.c).toFixed(7))} 
              fa={Number((iteration.fa).toFixed(7))} 
              fb={Number((iteration.fb).toFixed(7))} 
              fc={Number((iteration.fc).toFixed(7))} 
              key={i}
            />)
          }
        </tbody>
      </table>}

    </section>
  );
}


export default Biseccion;
