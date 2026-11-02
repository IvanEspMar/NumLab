import './App.scss'

import { BrowserRouter, Routes, Route } from 'react-router'

import Home from './routes/home'
import Menu from './routes/menu'

import { Header, Footer } from './components/header'
import NoLineales from './routes/1-nonlinear-equations'
import Biseccion from './routes/1-nonlinear-equations/biseccion'

function App() {
  return (
    <BrowserRouter>
      <main className="aplicacion">

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/nolineal" element={<NoLineales />}/>
          <Route path='/nolineal/biseccion' element={<Biseccion/>} />
        </Routes>

        <Footer />

      </main>
    </BrowserRouter>
  )
}

export default App