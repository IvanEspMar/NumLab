
import { useNavigate } from 'react-router'
import './tarjeta.scss'

function Tarjeta({ tarjeta }: { tarjeta: TarjetaData }) {
  const navegar = useNavigate()

  return (
    <article
      className="tarjeta"
      onClick={() => navegar(tarjeta.ruta)}
    >
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
    </article>
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
