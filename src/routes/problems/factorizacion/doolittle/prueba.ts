import { doli, multiplicar } from './lu.ts'

const A=[[10,1,2],[-2,3,8],[4,6,-1]]
const {L,U}=doli(A)

console.log('A =')
console.table(A)
console.log('L =')
console.table(L)
console.log('U =')
console.table(U)
console.log('L·U =')
console.table(multiplicar(L,U))
