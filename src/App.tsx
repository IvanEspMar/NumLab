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
        <Route path="/lineal/doolittle" element={<Doolittle />} />
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