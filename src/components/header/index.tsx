import { Link } from 'react-router'
import './header.scss'

export function Header() {
  return (
    <nav className="navegacion">

      <Link to="/" className="marca">
        NumLab<span className="punto">.</span>
      </Link>

      <div className="navegacion-enlaces">

        <Link to="/" className="enlace-nav">
          INICIO
        </Link>

        <Link to="/menu" className="enlace-nav">
          MENÚ DE MÉTODOS
        </Link>

      </div>

      <span className="navegacion-anio">
        FES ACATLÁN · 2026
      </span>

    </nav>
  )
}

export function Footer() {
  return (
    <footer className="pie-pagina">
      <span>FES ACATLÁN · UNAM · 2026</span>
    </footer>
  )
}