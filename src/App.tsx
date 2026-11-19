import './App.scss'

import { BrowserRouter, Routes, Route, useLocation } from 'react-router'

import Home from './routes/home'
import Problemas from './routes/problems/problems'

import { Header, Footer } from './components/header'
import Breadcrumbs from './components/breadcrumbs/breadcrumbs.tsx'

import NoLineales from './routes/problems/nolineal/nolineal'
import Biseccion from './routes/problems/nolineal/biseccion/biseccion'
import Sistemas from './routes/problems/sistemas/sistemas'
import Newton from './routes/problems/nolineal/newton/newton'
import Secante from './routes/problems/nolineal/secante/secante'
import GaussJordan from './routes/problems/sistemas/gauss-jordan/gauss-jordan'
import Doolittle from './routes/problems/sistemas/doolittle/doolittle'
import Crout from './routes/problems/sistemas/crout/crout.tsx'
import Jacobi from './routes/problems/sistemas/jacobi/jacobi.tsx'
import GaussSeidel from './routes/problems/sistemas/gauss-seidel/gauss-seidel.tsx'
import EigenValues from './routes/problems/eigenvalues/eigenvalues.tsx'
import Potencia from './routes/problems/eigenvalues/potencia/potencia.tsx'
import PotenciaInversa from './routes/problems/eigenvalues/inversa/inversa.tsx'

function AppContent() {
  const location = useLocation()

  return (
    <main className="aplicacion">

      <Header />

      {location.pathname !== "/" && <Breadcrumbs />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problemas />} />

        <Route path="/nolineal" element={<NoLineales />} />
        <Route path="/nolineal/biseccion" element={<Biseccion />} />
        <Route path="/nolineal/newton" element={<Newton />} />
        <Route path="/nolineal/secante" element={<Secante />} />

        <Route path="/lineal" element={<Sistemas />} />
        <Route path="/lineal/gauss-jordan" element={<GaussJordan />} />
        <Route path="/lineal/jacobi" element={<Jacobi />} />
        <Route path="/lineal/gauss-seidel" element={<GaussSeidel />} />
        <Route path="/lineal/doolittle" element={<Doolittle />} />
        <Route path="/lineal/crout" element={<Crout />} />

        <Route path="/eigenvalues" element={<EigenValues />} />
        <Route path="/eigenvalues/potencia" element={<Potencia />} />
         <Route path="/eigenvalues/inversa" element={<PotenciaInversa />} />
      </Routes>

      <Footer />

    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App