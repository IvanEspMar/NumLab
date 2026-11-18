export type Matriz=number[][]
export type paso={k:number,L:Matriz,U:Matriz}
function copia(M:Matriz):Matriz
{
  return M.map(fila=>[...fila])
}
//funcion llamada Cmatriz que recibe n(:number obliga a que sea un numero)
export function Cmatriz(n:number):Matriz
{
 //"Array(n).fill(0)"->una fila con n ceros
  //"Array.from({length:n},()=>...)"->ejecuta con lo qu eeta a la derecha
  //n veces y junta los resultados Asi salen n filas.
  
  return Array.from({length:n},()=>Array(n).fill(0))
}
//funcion y le llega una matriz
export function doli(A:Matriz)
{
  const  pasos:paso[]=[]
  const n=A.length//variable que mide el largo de la matriz
  const L=Cmatriz(n)
  const U=Cmatriz(n)
  //Es el contador de iteracines dependiendo de la matriz
  for(let  k=0;k<n;++k)
  {
    L[k][k]=1//coloca en la diagonal de la matriz L unos
    for(let j=k;j<n;++j)//j recorre las columans desde la diagonal hacia la derecha
    //de k hasta n-1  por eso U queda con ceros debajo de la diagonal
    {
      //sumatoria (SIGMA)
      let sum=0
      for(let s=0;s<k;++s)
        sum+=L[k][s]*U[s][j]
      U[k][j]=A[k][j]-sum//->Formula uₖⱼ = aₖⱼ − Σ(el sigma es el sum osea el for)
    }
    //PIVOTE
    //condicion que sean diferentes de cero por que se divide por ellos
    if(U[k][k]==0)
      throw new Error('EL pivote u${k+1}${k+1} es 0,Doolitle sin pivoteo no puede continuar')
    for(let i=k+1;i<n;++i)//columnas k de L
    //i recorre las filas debajo de la diagonal de k+1
    {
      //2do (SIGMA)
      let sum2=0
      for(let s=0;s<k;++s)
        sum2+=L[i][s]*U[s][k]
      L[i][k]=(A[i][k]-sum2)/U[k][k]//->Formula lᵢₖ = [aᵢₖ − Σ] / uₖₖ
    }
    pasos.push({k:k+1,L:copia(L),U:copia(U)})
  }
  return{L,U,pasos}

}
//Comprobacion
export function adelante(L:Matriz,b:number[]):number[]
{
  const n=L.length
  const y:number[]=Array(n).fill(0)
  for(let i=0;i<n;++i)
  {
    let sum=0
    for(let j=0;j<i;++j)
      sum+=L[i][j]*y[j]
    y[i]=b[i]-sum
  }
  return y
}

export function atras(U:Matriz,y:number[]):number[]
{
  const n=U.length
  const x:number[]=Array(n).fill(0)
  for(let i=n-1;i>=0;--i)
  {
    let sum=0
    for(let j=i+1;j<n;++j)
      sum+=U[i][j]*x[j]
    x[i]=(y[i]-sum)/U[i][i]
  }
  return x
}
