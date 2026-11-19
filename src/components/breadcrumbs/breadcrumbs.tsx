import { Link, useLocation } from "react-router";
import "./breadcrumbs.scss";

const routes: Record<string, string> = {
  "/": "Inicio",
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

  const paths = segments.map((_, index) =>
    "/" + segments.slice(0, index + 1).join("/")
  );

  const labels = { ...routes };
  for (const path of paths) {
    if (path.endsWith('/calcular')) labels[path] = 'Calculadora';
  }

  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <Link to="/">NumLab</Link>

      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        const label = labels[path] || "Sección";

        return (
          <span className="breadcrumbs__item" key={path}>
            <span className="breadcrumbs__separator">/</span>

            {isLast ? (
              <span className="breadcrumbs__current">
                {label}
              </span>
            ) : (
              <Link to={path}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;