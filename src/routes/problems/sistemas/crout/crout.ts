import { Cmatriz, type Matriz, type paso } from '../doolittle/lu.ts'

//copia de una matriz, para guardar cómo van L y U en cada turno
function copia(M:Matriz):Matriz
{
  return M.map(fila=>[...fila])
}

//Paso 1: A = L·U (Crout: la diagonal de U son unos)
export function crout(A:Matriz)
{
  const pasos:paso[]=[]
  const n=A.length
  const L=Cmatriz(n)
  const U=Cmatriz(n)
  for(let k=0;k<n;++k)
  {
    U[k][k]=1//la diagonal de U siempre son unos

    //columna k de L (incluye la diagonal)
    for(let i=k;i<n;++i)
    {
      let sum=0
      for(let s=0;s<k;++s)
        sum+=L[i][s]*U[s][k]
      L[i][k]=A[i][k]-sum//lᵢₖ = aᵢₖ − Σ
    }

    //pivote: L[k][k] divide en la fila de U
    if(Math.abs(L[k][k])<1e-12)
      throw new Error(`El pivote l${k+1}${k+1} es 0, Crout sin pivoteo no puede continuar`)

    //fila k de U (a la derecha de la diagonal)
    for(let j=k+1;j<n;++j)
    {
      let sum2=0
      for(let s=0;s<k;++s)
        sum2+=L[k][s]*U[s][j]
      U[k][j]=(A[k][j]-sum2)/L[k][k]//uₖⱼ = [aₖⱼ − Σ] / lₖₖ
    }

    pasos.push({k:k+1,L:copia(L),U:copia(U)})
  }
  return{L,U,pasos}
}

//Paso 2: L·y = b (hacia adelante). Aquí SÍ se divide entre la diagonal de L
export function adelanteCrout(L:Matriz,b:number[]):number[]
{
  const n=L.length
  const y:number[]=Array(n).fill(0)
  for(let i=0;i<n;++i)
  {
    let sum=0
    for(let j=0;j<i;++j)
      sum+=L[i][j]*y[j]
    y[i]=(b[i]-sum)/L[i][i]
  }
  return y
}

//Paso 3: U·x = y (hacia atrás). Aquí NO se divide, porque la diagonal de U son unos
export function atrasCrout(U:Matriz,y:number[]):number[]
{
  const n=U.length
  const x:number[]=Array(n).fill(0)
  for(let i=n-1;i>=0;--i)
  {
    let sum=0
    for(let j=i+1;j<n;++j)
      sum+=U[i][j]*x[j]
    x[i]=y[i]-sum
  }
  return x
}

//Junta los tres pasos: factoriza y resuelve A·x = b
export function resolverCrout(A:Matriz,b:number[])
{
  const {L,U,pasos}=crout(A)
  const y=adelanteCrout(L,b)
  const x=atrasCrout(U,y)
  return{L,U,pasos,y,x}
}
