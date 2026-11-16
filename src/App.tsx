import './App.scss'

import { BrowserRouter, Routes, Route } from 'react-router'

import Home from './routes/home'
import Problemas from './routes/problems/problems'

import { Header, Footer } from './components/header'
import NoLineales from './routes/problems/nolineal/nolineal'
import Biseccion from './routes/problems/nolineal/biseccion/biseccion'
import Sistemas from './routes/problems/sistemas/sistemas'
import Newton from './routes/problems/nolineal/newton/newton'
import Secante from './routes/problems/nolineal/secante/secante'

function App() {
  return (
    <BrowserRouter>
      <main className="aplicacion">

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problemas />} />
          <Route path="/nolineal" element={<NoLineales />}/>
          <Route path='/nolineal/biseccion' element={<Biseccion/>} />
          <Route path='/nolineal/newton' element={<Newton/>} />
          <Route path='/nolineal/secante' element={<Secante/>} />
          <Route path='/lineal' element={<Sistemas/>}/>
        </Routes>

        <Footer />

      </main>
    </BrowserRouter>
  )
}

export default App