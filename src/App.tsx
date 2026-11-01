import './App.scss'

import { BrowserRouter, Routes, Route } from 'react-router'

import Home from './routes/home'
import Menu from './routes/0-menu'

import { Header, Footer } from './components/header'

function App() {
  return (
    <BrowserRouter>
      <main className="aplicacion">

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>

        <Footer />

      </main>
    </BrowserRouter>
  )
}

export default App