import './App.scss'

import { HashRouter, Routes, Route, useLocation } from 'react-router'

import Home from './routes/home'
import Problemas from './routes/problems/problems'

import { Header, Footer } from './components/header'
import Breadcrumbs from './components/breadcrumbs/breadcrumbs.tsx'

import NoLineales from './routes/problems/nolineal/nolineal'
import Biseccion from './routes/problems/nolineal/biseccion/biseccion'
import BiseccionIntroduccion from './routes/problems/nolineal/biseccion/biseccion-introduccion'
import NewtonIntroduccion from './routes/problems/nolineal/newton/newton-introduccion'
import SecanteIntroduccion from './routes/problems/nolineal/secante/secante-introduccion'
import SistemasIntroduccion from './routes/problems/sistemas/sistemas-introducciones'
import EigenIntroduccion from './routes/problems/eigenvalues/eigenvalues-introducciones'
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
        <Route path="/nolineal/biseccion" element={<BiseccionIntroduccion />} />
        <Route path="/nolineal/biseccion/calcular" element={<Biseccion />} />
        <Route path="/nolineal/newton" element={<NewtonIntroduccion />} />
        <Route path="/nolineal/newton/calcular" element={<Newton />} />
        <Route path="/nolineal/secante" element={<SecanteIntroduccion />} />
        <Route path="/nolineal/secante/calcular" element={<Secante />} />

        <Route path="/lineal" element={<Sistemas />} />
        <Route path="/lineal/gauss-jordan" element={<SistemasIntroduccion method="gauss-jordan" />} />
        <Route path="/lineal/gauss-jordan/calcular" element={<GaussJordan />} />
        <Route path="/lineal/jacobi" element={<SistemasIntroduccion method="jacobi" />} />
        <Route path="/lineal/jacobi/calcular" element={<Jacobi />} />
        <Route path="/lineal/gauss-seidel" element={<SistemasIntroduccion method="gauss-seidel" />} />
        <Route path="/lineal/gauss-seidel/calcular" element={<GaussSeidel />} />
        <Route path="/lineal/doolittle" element={<SistemasIntroduccion method="doolittle" />} />
        <Route path="/lineal/doolittle/calcular" element={<Doolittle />} />
        <Route path="/lineal/crout" element={<SistemasIntroduccion method="crout" />} />
        <Route path="/lineal/crout/calcular" element={<Crout />} />

        <Route path="/eigenvalues" element={<EigenValues />} />
        <Route path="/eigenvalues/potencia" element={<EigenIntroduccion method="potencia" />} />
        <Route path="/eigenvalues/potencia/calcular" element={<Potencia />} />
         <Route path="/eigenvalues/inversa" element={<EigenIntroduccion method="inversa" />} />
        <Route path="/eigenvalues/inversa/calcular" element={<PotenciaInversa />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />

    </main>
  )
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

export default App