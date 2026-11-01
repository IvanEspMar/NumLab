import { useNavigate } from 'react-router';
import './home.scss'
import grafica from '../../assets/graficas.jpg'


function Presentacion() {
  const navigate = useNavigate();
  return (
    <section className="recuadro presentacion">
      <div className="presentacion-header">
        <span className="etiqueta">PROYECTO MÉTODOS NUMERICOS</span>
        
          <button onClick={() => navigate('/menu')} className='start-button'>MENÚ PRINCIPAL</button>
      </div>

      <div className="presentacion-contenido">
        <div className="presentacion-titulo">
          <span className="titulo-indice">01 / PRESENTACIÓN</span>

          <h1>
            PROGRAMACIÓN DE MÉTODOS
            <br />
            <span className='numericos'>NUMÉRICOS</span><span className="punto">.</span>
          </h1>

          <div className="titulo-pie">
            <span className="titulo-linea"></span>
            <span>FES ACATLÁN · UNAM</span>
          </div>
        </div>

        <div className="presentacion-visual">
          <div className="visual-grafica">
            <img src={grafica} alt="Gráfica de una función matemática" />
            <span className="coordenada coordenada-x">X →</span>
            <span className="coordenada coordenada-y">Y ↑</span>
          </div>
        </div>
      </div>

      <div className="presentacion-inferior">
        <div className="presentacion-descripcion">
          <span className="etiqueta">¿DE QUÉ TRATA EL PROGRAMA?</span>
          <p>
            NumLab es una aplicación para resolver ecuaciones y sistemas mediante distintos métodos numéricos. Permite obtener resultados, consultar los procedimientos paso a paso y comprender cómo funciona cada método.
          </p>
        </div>

        <aside className="integrantes">
          <span className="etiqueta">INTEGRANTES</span>

          <div className="integrante">
            <span className="integrante-numero">01</span>
            <div className="integrante-info">
              <span className="integrante-nombre">
                Huesca Martínez José Arturo
              </span>
              <span className="integrante-rol">
                Programación e investigación
              </span>
            </div>
          </div>

          <div className="integrante">
            <span className="integrante-numero">02</span>
            <div className="integrante-info">
              <span className="integrante-nombre">
                Espinosa Martínez Iván
              </span>
              <span className="integrante-rol">
                Diseño y programación
              </span>
            </div>
          </div>

          <div className="integrante">
            <span className="integrante-numero">03</span>
            <div className="integrante-info">
              <span className="integrante-nombre">
                Martínez González Enrique René
              </span>
              <span className="integrante-rol">
                Programación e investigación
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="presentacion-footer">
        <span>NUMLAB / 2026</span>
        <span>FACULTAD DE ESTUDIOS SUPERIORES ACATLÁN</span>
      </div>
    </section>
  )
}




function Home() {
  return (
    <>
      <Presentacion />
    </>
  )
}

export default Home
