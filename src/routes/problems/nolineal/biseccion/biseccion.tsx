
import { useState } from "react";
import "./biseccion.scss";
import RowBisec, {type RowBisecType} from "./tablas";

function ecuation(x:number) {
  return (x ** 3 + 8 * x - 7) 
}

function Biseccion() {
  const [iteration, setIterations] = useState<RowBisecType[]>([])
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [sol, setSol] = useState(0)
  const intervaIsValid = a < b
  const hasSignChange =  ecuation(a) * ecuation(b) < 0
  const tolerance = 0.00001
  const decimals = 6
  
  
  function computeIterations() {
    const c1 = (a + b) / 2
    const firstIteration:RowBisecType = {a: a, b:b, c: c1, fa: ecuation(a), fb: ecuation(b), fc: ecuation(c1)}
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
      const newItaration = {a: newA, b:newB, c: newC, fa: fa, fb: fb, fc: fc}
      
      interations.push(newItaration)
      i++
      if(Math.abs(fc) < tolerance) {
        setSol(newC)
        break
      }
    } while (i < 50)
      
    setIterations(interations)
  }

  return (
    <section className="seccion-biseccion">
      <h1>MÉTODO DE BISECCIÓN</h1>
      <div className="intervalo-biseccion">
        <h3>Intervalo inicial</h3>
        <label>a: <input value={a} onChange={(e) => setA(Number(e.target.value))} type="number" placeholder="0" /></label>
        <label>b: <input value={b} onChange={(e) => setB(Number(e.target.value))} type="number" placeholder="0" /></label>
        <button disabled={!(intervaIsValid && hasSignChange)} onClick={() => computeIterations()}>Calcular</button>
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
            <RowBisec 
              i={i} 
              a={Number(iteration.a.toFixed(decimals))} 
              b={Number((iteration.b).toFixed(decimals))} 
              c={Number((iteration.c).toFixed(decimals))} 
              fa={Number((iteration.fa).toFixed(decimals))} 
              fb={Number((iteration.fb).toFixed(decimals))} 
              fc={Number((iteration.fc).toFixed(decimals))} 
              key={i}
            />)
          }
          {"f(" + sol + ")" + " = " + ecuation(sol)}
        </tbody>
      </table>}

    </section>
  );
}


export default Biseccion;
