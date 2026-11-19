
import { Link } from 'react-router'
import './tarjeta.scss'

function Tarjeta({ tarjeta }: { tarjeta: TarjetaData }) {
  return (
    <Link className="tarjeta" to={tarjeta.ruta} aria-label={`Conocer ${tarjeta.titulo}`}>
      <header className="tarjeta__encabezado">
        <span className="tarjeta__numero">{tarjeta.numero}</span>
        <span className="tarjeta__categoria">{tarjeta.categoria}</span>
      </header>

      <h3 className="tarjeta__titulo">{tarjeta.titulo}</h3>

      <div className="tarjeta__visual">
        {tarjeta.imagen && (
          <img
            src={tarjeta.imagen}
            alt={tarjeta.textoAlternativo ?? ''}
          />
        )}

        {tarjeta.formula && (
          <span className="tarjeta__formula">
            {tarjeta.formula}
          </span>
        )}
      </div>

      <p className="tarjeta__descripcion">
        {tarjeta.descripcion}
      </p>

      <footer className="tarjeta__pie">
        <span className="tarjeta__pie-texto">{tarjeta.pie}</span>
      </footer>
    </Link>
  )
}

export type TarjetaData = {
  numero: string
  categoria: string
  titulo: string
  imagen?: string
  textoAlternativo?: string
  formula?: string
  descripcion: string
  pie: string
  ruta: string
}

export default Tarjeta
