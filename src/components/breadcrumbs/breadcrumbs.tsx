import { Link, useLocation } from "react-router";
import "./breadcrumbs.scss";

const routes: Record<string, string> = {
  "/": "NumLab",
  "/problems": "Problemas",
  "/nolineal": "Ecuaciones no lineales",
  "/nolineal/biseccion": "Bisección",
  "/nolineal/newton": "Newton-Raphson",
  "/nolineal/secante": "Secante",
  "/lineal": "Sistemas de ecuaciones",
  "/lineal/gauss-jordan": "Gauss-Jordan",
  "/lineal/gauss-seidel": "Gauss-Seidel",
  "/lineal/jacobi": "Jacobi",
  "/lineal/doolittle": "Doolittle",
  "/lineal/crout": "Crout",
  "/eigenvalues": "Valores propios",
  "/eigenvalues/potencia": "Potencia",
  "/eigenvalues/inversa": "Potencia inversa",
};

function Breadcrumbs() {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const paths = ["/", ...segments.map((_, index) =>
    "/" + segments.slice(0, index + 1).join("/")
  )];

  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <ol className="breadcrumbs__trail" role="list">
        {paths.map((path, index) => {
          const isCurrent = index === paths.length - 1;
          const label = path.endsWith("/calcular") ? "Calculadora" : routes[path] ?? "Sección";

          return (
            <li className="breadcrumbs__item" key={path}>
              {index > 0 && <span className="breadcrumbs__separator" aria-hidden="true">/</span>}
              {isCurrent ? (
                <span className="breadcrumbs__current" aria-current="page">{label}</span>
              ) : (
                <Link to={path}>{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
