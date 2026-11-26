import Tarjeta, { type TarjetaData } from '@/components/tarjeta/tarjeta'
import './tarjeta-grid.scss'

type TarjetaGridProps = {
  titulo: string
  tarjetas: TarjetaData[]
  contador?: string
  etiqueta?: string
  informacion?: string
  columnas?: number
}

function TarjetaGrid({
  titulo,
  tarjetas,
  contador,
  etiqueta = 'Sobre el problema',
  informacion,
  columnas = 3,
}: TarjetaGridProps) {
  return (
    <section className="tarjeta-grid">

      <header className="tarjeta-grid__encabezado">
        <h2 className="tarjeta-grid__titulo">
          {titulo}
          <span className="punto">.</span>
        </h2>

        {contador && (
          <span className="tarjeta-grid__contador">
            {contador}
          </span>
        )}
      </header>

      <div
        className="tarjeta-grid__contenedor"
        style={{ '--columnas': columnas } as React.CSSProperties}
      >
        {tarjetas.map((tarjeta) => (
          <Tarjeta
            key={tarjeta.numero}
            tarjeta={tarjeta}
          />
        ))}
      </div>

      {informacion && (
        <section className="tarjeta-grid__informacion">
          <h3 className="tarjeta-grid__etiqueta">{etiqueta}</h3>
          <p className="tarjeta-grid__texto">{informacion}</p>
        </section>
      )}

    </section>
  )
}

export default TarjetaGrid
