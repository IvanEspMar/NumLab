import type { ReactNode } from "react";
import { Link } from "react-router";
import "./encabezado-calculadora.scss";

interface EncabezadoCalculadoraProps {
  titulo: string;
  introduccion: string;
  descripcion?: ReactNode;
}

export function EncabezadoCalculadora({ titulo, introduccion, descripcion }: EncabezadoCalculadoraProps) {
  return (
    <header className="encabezado-calculadora">
      <div className="encabezado-calculadora__contenido">
        <h1>{titulo}<span className="punto">.</span></h1>
        {descripcion && <p>{descripcion}</p>}
      </div>
      <Link className="encabezado-calculadora__enlace" to={introduccion}>
        Más detalles <span aria-hidden="true">→</span>
      </Link>
    </header>
  );
}
